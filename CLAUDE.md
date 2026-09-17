# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev          # start dev server (localhost:4321)
pnpm run build        # production build → dist/
pnpm run preview      # serve dist/ locally
pnpm run typecheck    # astro check (TS + Astro template types)
pnpm run lint         # ESLint
pnpm run lint:fix     # ESLint with auto-fix
pnpm run format       # Prettier write
pnpm run format:check # Prettier check (CI)
pnpm run test          # Vitest unit tests (run once)
pnpm run test:watch    # Vitest in watch mode
pnpm run test:coverage # Vitest with coverage report
pnpm run test:e2e      # Playwright E2E (builds + previews the site first)
pnpm run test:e2e:ui   # Playwright E2E in UI mode
```

Typecheck, unit tests and E2E are all correctness gates; CI runs all three (see `.github/workflows/ci.yml`).

## Architecture

Astro `static` output, no React, no adapter. "Static" describes how the HTML is produced (pre-rendered at build time, no per-request server render), not whether the page has forms or interactivity, `ContactForm.astro`'s `#demo` form is fully functional on a static page because it submits via Netlify Forms (detected at build time from the `data-netlify` attribute, no server route or third-party backend involved). All routes are fully static: `index.astro` (landing), `terminos.astro`, `privacidad.astro`, `habeas-data.astro`, `404.astro`. Deployed as a plain static site; there is no Astro adapter configured. (`@astrojs/netlify` was removed: the app has zero `prerender = false` routes — the last one, `api/waitlist.ts`, was removed as dead code, see git history, it needed a server route specifically because it used a secret Brevo API key that can't be exposed client-side — and Netlify Forms works from static HTML output alone, no adapter required. Note `astro` itself still pulls in `unstorage` → `@netlify/blobs` as an optional session-storage driver regardless of adapter, which is why `pnpm-workspace.yaml` still carries an `@opentelemetry/core` override for a known CVE in that chain. If a future route needs SSR again, re-add an adapter with `astro add netlify`.)

**Render path:**
`index.astro` → `BaseLayout.astro` (head, GA4, fonts, Header, Footer, skip link) → `LandingTemplate.astro` (assembles all sections) → organisms/molecules/atoms. Legal pages use `LegalLayout.astro`, which wraps `BaseLayout`.

**Section order** (LandingTemplate):
Hero → Impacto → ProofStrip → Modules → Showcase → Benefits → MetricsBand → CaseStudies → Testimonials → SecuritySection → Pricing → FAQSection → CTAFooter. Deliberate conversion-funnel ordering: hook (Hero) → agitate the pain (Impacto) → quick trust signal (ProofStrip) → explain the solution (Modules) → show it (Showcase) → differentiators (Benefits) → social proof (Metrics/CaseStudies/Testimonials, placed right before the price ask) → address the security/trust objection (SecuritySection) → price (Pricing, now trust-primed) → mop up remaining objections (FAQSection) → close (CTAFooter). MetricsBand, CaseStudies and Testimonials are validation-stage placeholders hidden (`display:none`) until real data exists.

**Atomic design layers** — import aliases enforce the hierarchy:

- `@atoms/*` — Eyebrow (only atom currently)
- `@molecules/*` — Brand (logo+name), FloatChip
- `@organisms/*` — all page sections, including Hero, Header, Footer, FAQSection, CTAFooter
- `@components/*` — catch-all root (ContactForm lives here)
- `@templates/*` — LandingTemplate
- `@utils/*` — constants
- `@layouts/*` — BaseLayout, LegalLayout

**Styling approach:**

- `src/styles/globals.css` — all CSS custom properties (design tokens). Always use token names, never raw hex values. Imported once in BaseLayout via `@layer base/components/utilities`.
- Tailwind v3 configured in `tailwind.config.mjs`, processed via `postcss.config.mjs` (no `@astrojs/tailwind` integration; dropped in the Astro 6 upgrade). The `@tailwind base/components/utilities` directives live at the top of globals.css. Extends tokens from globals.css into Tailwind's theme. Prefer CSS custom properties over Tailwind utility classes for colors/spacing in component `<style>` blocks.
- Scoped `<style>` blocks in each component. Use `:global()` only for child selectors that cross component boundaries (e.g., float chip positioning from Hero.astro affecting FloatChip.astro).
- Keyframes `floatA` / `floatB` defined in globals.css, referenced in Hero.astro.

**Interactivity:**
All JS is vanilla, written in Astro `<script>` blocks (no framework). Key patterns:

- IntersectionObserver for scroll-triggered count-up (Hero); the shared `.reveal` class is wired by `src/scripts/reveal.ts`, imported once in LandingTemplate
- Dataset attributes (`data-count-to`, `data-faq`, `data-img`) drive JS behavior
- Mobile nav toggle in Header.astro uses `drawer.dataset.open` + aria attributes

**Static data:**
`src/utils/constants.ts` is the source of truth for section data: it exports typed interfaces and arrays consumed by the sections that render them. `PLANS` → `Pricing.astro` (pricing cards), `IMPACT_ROWS` → `Impacto.astro` (before/after table), `BENEFITS` → `Benefits.astro` (why-TerraCore grid), and `FAQ` → both `FAQSection.astro` (visible accordion, imports `FAQ` directly, no separate copy to keep in sync) and `index.astro` (FAQPage JSON-LD). It also exports `WHATSAPP_NUMBER`/`WHATSAPP_DISPLAY`/`waLink()`, the single source of truth for the contact WhatsApp number (see Environment variables below), consumed by every component that links to WhatsApp. No CMS.

**Lead capture:**
The `#demo` lead form (`ContactForm.astro`) submits via Netlify Forms: the `<form>` carries `data-netlify="true"`, a hidden `form-name` input, and `data-netlify-honeypot="bot-field"`; submissions are handled entirely by Netlify (dashboard + email notifications), no server endpoint or third-party database involved. The form is submitted via `fetch()` (AJAX) rather than a native browser POST, so the JS also implements a client-side honeypot check and a minimum-fill-time check as a first line of defense before the request ever reaches Netlify. (A separate Brevo-backed waitlist endpoint + form used to live at `api/waitlist.ts` / `Pricing.astro`'s `.waitlist-form`, but no pricing plan ever enabled it, so it was removed as dead code. The form previously posted directly to Supabase; that was replaced by Netlify Forms since the project's Supabase backend was no longer active.)

All three `PLANS` CTAs (`Pricing.astro`) route to `/#demo` (unified funnel, all leads land in the Netlify Forms dashboard). Each plan's `operationSize` field matches a `tamano_operacion` radio value in `ContactForm.astro` exactly; a delegated click listener on `.plans` (not the individual `.plan-cta` links, since the desktop-tablet breakpoint clones cards into an infinite slider) preselects that radio when a plan's CTA is clicked, so the demo request arrives pre-scoped to the plan the visitor was looking at.

A `WhatsAppFloat.astro` organism renders in `BaseLayout.astro`, so it appears on every page (landing, legal pages, 404): a fixed-position button linking to `waLink('Hola, estoy interesado en TerraCore')` from `constants.ts`.

**Analytics:**
GA4 wired in BaseLayout via `is:inline` scripts (excluded from Prettier — see `.prettierignore`). `window.trackEvent(name, params)` is available globally (defined inline in `BaseLayout.astro`, with a no-op fallback when GA is absent); components call `window.trackEvent?.(...)` directly.

**Environment variables** (see `.env.example`):

- `PUBLIC_GA_ID` — GA4 measurement ID (optional; tracking disabled if absent)
- `MAIN_CTA_URL` — primary CTA href (falls back to `/#demo` if absent)
- `PUBLIC_SITE_URL` — canonical site URL, read at build time in `astro.config.mjs` (falls back to `https://terracoreapp.co` if absent)
- `CONTACT_WHATSAPP` — contact WhatsApp number, digits only with country code, no `+` (falls back to `573108283088` if absent). Single source of truth is `WHATSAPP_NUMBER`/`waLink()` in `src/utils/constants.ts`, consumed by `ContactForm.astro`, `Footer.astro`, the `Pricing.astro` plan CTAs, and the three legal pages, so the number is never hardcoded per-component.

**Icons:** `astro-icon` with `@iconify-json/lucide` and `@iconify-json/simple-icons`. Usage: `<Icon name="lucide:check" width={18} height={18} />`; brand marks use the `simple-icons:` prefix (e.g. `simple-icons:whatsapp`).

**Public assets:**

- `/logo.ico` — brand logo
- `/terracore.jpg` — default OG image (1200×630)
- `/images/terracore.webp` — farm photo
- `/screens/` — dashboard screenshot WebPs (dashboard-1/2, animales-1..3, insumos-1..5, produccion-1..4, salud-animal-1..6)
- `/videos/demo.mp4` — product demo video, H.264/AAC, faststart (referenced in Hero lightbox)
- `/robots.txt` — points crawlers at `sitemap-index.xml`
- `/llms.txt` — plain-text product/site summary for LLM crawlers
- `/fonts/` — self-hosted Inter, JetBrains Mono, and Poppins woff2 files (latin + latin-ext subsets only). Declared via `@font-face` at the top of `globals.css`; replaced the previous Google Fonts CDN links in `BaseLayout.astro` to cut two extra origins off the critical rendering path. Re-fetch from `fonts.googleapis.com/css2` with a modern browser UA and re-download the referenced `.woff2` files if a font weight/style is ever added or changed.

**Testing:**

- Unit tests (Vitest, `vitest.config.ts` uses Astro's `getViteConfig` so `@utils/*` aliases and `import.meta.env` resolve the same way they do in the app): colocated as `*.test.ts` next to the source file, e.g. `src/utils/constants.test.ts`.
- If a test ever needs to cover a file under `src/pages/` (there are currently none there worth unit testing), don't colocate it as a sibling `*.test.ts`: Astro treats every file under `src/pages/` as a route, so a sibling test file gets built as a page and breaks the build. Put it in a `__tests__/` subfolder instead, Astro ignores paths starting with `_`.
- DOM-dependent tests (anything touching `window`/`document`, e.g. `src/scripts/reveal.test.ts`, `src/utils/analytics.test.ts`) need a `// @vitest-environment jsdom` pragma at the top of the file; the default environment is `node`.
- E2E tests (Playwright, `playwright.config.ts`) live in `e2e/*.spec.ts`. The config's `webServer` runs `pnpm run build && pnpm run preview:e2e` automatically (see Build & Deploy below for why not plain `pnpm run preview`), no need to start a server manually. Desktop-viewport specs run on the `chromium` project; `e2e/mobile-nav.spec.ts` is scoped to the `mobile-chromium` project (`testMatch`/`testIgnore` in the config) since the hamburger menu only exists below the `1000px` breakpoint.
- Both suites run in CI (`.github/workflows/ci.yml`): unit tests in the `quality` job, E2E in its own `e2e` job (needs `playwright install --with-deps chromium`).

## Build & Deploy

No Astro adapter; `netlify.toml` sets `command = "pnpm run build"`, `publish = "dist"`, `NODE_VERSION = 22`. `pnpm run build` emits plain static pages to `dist/`, Netlify serves them directly with no SSR function bundling. `@astrojs/sitemap` generates `dist/sitemap-index.xml` during build. Set env vars in the Netlify panel. Package manager is pnpm (`pnpm-lock.yaml`, `packageManager` field in `package.json`); native build scripts (esbuild, sharp, @parcel/watcher) are allowlisted in `pnpm-workspace.yaml`.

The Playwright E2E `webServer` runs `pnpm run build && pnpm run preview:e2e`, **not** `pnpm run preview`: `astro preview` serves its own generic 404 page for unmatched routes instead of the site's actual `dist/404.html`, so `preview:e2e` serves the static `dist/` with the `serve` package (`serve dist -l 4321`) instead, which streams the real `dist/404.html` and matches production Netlify hosting behavior.

## Key Constraints

- `src/layouts/BaseLayout.astro` is excluded from Prettier (`.prettierignore`) because Prettier 3 mangles `is:inline` script syntax. Edit it manually.
- `BaseLayout.astro` is also excluded from ESLint auto-fix for the same reason.
- No React, no client-side framework. All interactivity must be vanilla JS in `<script>` blocks.
- NEVER use the em-dash character (`—`) in user-facing UI copy (headings, leads, labels, button text, FAQ, plan descriptions, any rendered string). Use a comma, colon, period, or parentheses instead. This rule applies only to UI copy — em-dashes are fine in code comments and docs like this file.

## Folder structure

```
src/
├── components/    # atoms/, molecules/, organisms/, templates/ (see Atomic design layers above)
├── layouts/       # BaseLayout.astro, LegalLayout.astro
├── pages/         # index.astro, terminos.astro, privacidad.astro, habeas-data.astro, 404.astro
├── scripts/       # standalone vanilla-JS modules imported by components (e.g. reveal.ts)
├── styles/        # globals.css (design tokens + Tailwind directives)
├── utils/         # constants.ts (typed static data, single source of truth per section)
└── assets/        # images/, screens/ (source images, optimized into public/ at build time)
e2e/               # Playwright specs
docs/              # GOVERNANCE.md (org-wide standard), CONTRIBUTING.md
public/            # static files served as-is (fonts, videos, robots.txt, llms.txt)
```

## Database

None. Static Astro site with no server code and no adapter; all page content is
typed data in `src/utils/constants.ts`. The `#demo` form posts to Netlify Forms,
not a database (see Lead capture above). A Supabase backend existed previously
but is no longer active; `SECURITY.md` still describes the old Supabase-based
form and has not been updated to reflect the Netlify Forms migration.

## Security

- Secret scanning (trufflehog, `--only-verified`) and `pnpm audit --audit-level=high`
  run in the `security` job of `.github/workflows/ci.yml` on every push/PR to
  `main`/`dev`.
- Only env vars prefixed `PUBLIC_*` reach the client bundle; everything else stays
  server/build-side. `.env` is gitignored; only `.env.example` (no real values) is
  committed.
- No user data is stored anywhere in this repo's control: the lead form goes
  straight to Netlify's own dashboard, no server endpoint or third-party DB in
  the critical path.
- Report vulnerabilities per `SECURITY.md` (GitHub Private Vulnerability
  Reporting), not as a public issue.
- Org-wide security/CI hardening standard lives in `docs/GOVERNANCE.md`.

## Working here

**Allowed without confirmation:** `pnpm run dev|build|preview|typecheck|lint|format:check|test|test:coverage`,
read-only git commands (`status`, `log`, `diff`, `branch -a`), `gh pr view|checks`.

**Never do:**

- Push or merge directly to `dev` or `main` (both are protected integration
  branches, see `docs/GOVERNANCE.md`); always go through a PR.
- Commit real secrets or a filled-in `.env`; only `PUBLIC_*` vars may ever reach
  client code.
- Add a client-facing form or script that posts to anything other than Netlify
  Forms without checking whether it needs the removed `@astrojs/netlify` adapter
  back (see Architecture above).
- Use the em-dash in UI copy (see Key Constraints).
- Run destructive git commands (`reset --hard`, `push --force`) without explicit
  confirmation.

**Done criteria:** `pnpm run format:check`, `pnpm run lint`, `pnpm run typecheck`,
`pnpm run test` and `pnpm run build` all pass locally; run `pnpm run test:e2e` too
if the change touches markup, navigation or the lead form. This matches what CI's
`quality`, `build` and `e2e` jobs check on the PR.

## Governance

Org-wide repository governance (branch protection / rulesets model, CI/CD hardening standard, commit conventions, licensing, security) lives in `docs/GOVERNANCE.md`. It is written as the Lumina W organization standard (not terracore-specific); the canonical copy is intended for the `lumina-w/.github` repo so every product inherits it. Apply it when setting up CI, workflows, or repo governance here.

## Git conventions

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description`, where the description is lowercase and in the imperative mood. The `scope` is optional but encouraged. This is enforced by `commitlint` in a `commit-msg` hook (via `lefthook`, config in `commitlint.config.js`), and PR titles are checked in CI (`.github/workflows/pr-title.yml`) since PRs are squash-merged. Git hooks install automatically on `pnpm install` (the `prepare` script runs `lefthook install`); `lefthook.yml` also wires a pre-commit hook that runs Prettier + ESLint on staged files.

- Allowed `type` values seen in the history: `feat`, `fix`, `refactor`, `chore`, `docs`, `ci`, `seo`, `a11y`, `perf`, `test`, `style`, `build`.
- Common scopes: the area touched (`pricing`, `data`, `env`, `deps`), lowercase kebab-case.
- Examples: `feat(pricing): actualizar precios y planes`, `chore: migrate to pnpm`, `ci: fix prettier README error`.
- Branch names follow `type/kebab-description` (e.g. `chore/pnpm-migration`, `chore/astro-v6-upgrade`).
