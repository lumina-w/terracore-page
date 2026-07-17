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

Astro `static` output, no React. "Static" describes how the HTML is produced (pre-rendered at build time, no per-request server render), not whether the page has forms or interactivity, `ContactForm.astro`'s `#demo` form is fully functional on a static page because it POSTs client-side straight to Supabase's REST API with the public anon key; it never needed a server route. All routes are fully static: `index.astro` (landing), `terminos.astro`, `privacidad.astro`, `habeas-data.astro`, `404.astro`. Deployed as a plain static site (no adapter): `pnpm run build` emits static HTML to `dist/`, which Netlify publishes directly. The app has no `prerender = false` routes; the last one (`api/waitlist.ts`) was removed as dead code, see git history, it needed a server route specifically because it used a secret Brevo API key that can't be exposed client-side. The `@astrojs/netlify` adapter was dropped once that route was gone; if a future route needs SSR again, re-add an adapter (`astro add netlify`).

**Render path:**
`index.astro` → `BaseLayout.astro` (head, GA4, fonts, Header, Footer, skip link) → `LandingTemplate.astro` (assembles all sections) → organisms/molecules/atoms. Legal pages use `LegalLayout.astro`, which wraps `BaseLayout`.

**Section order** (LandingTemplate):
Hero → ProofStrip → Modules → Impacto → Showcase → Benefits → SecuritySection → Pricing → MetricsBand → CaseStudies → Testimonials → FAQSection → CTAFooter. MetricsBand, CaseStudies and Testimonials are validation-stage placeholders hidden (`display:none`) until real data exists.

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
`src/utils/constants.ts` is the source of truth for section data: it exports typed interfaces and arrays consumed by the sections that render them. `PLANS` → `Pricing.astro` (pricing cards), `IMPACT_ROWS` → `Impacto.astro` (before/after table), `BENEFITS` → `Benefits.astro` (why-TerraCore grid), and `FAQ` → `index.astro` (FAQPage JSON-LD). Note `FAQSection.astro` still holds its own visible FAQ copy inline, so `FAQ` in constants must stay in sync with it. No CMS.

**Lead capture:**
The `#demo` lead form (`ContactForm.astro`) submits directly to Supabase via the public anon key; no server endpoint involved. (A separate Brevo-backed waitlist endpoint + form used to live at `api/waitlist.ts` / `Pricing.astro`'s `.waitlist-form`, but no pricing plan ever enabled it, so it was removed as dead code.)

**Analytics:**
GA4 wired in BaseLayout via `is:inline` scripts (excluded from Prettier — see `.prettierignore`). `window.trackEvent(name, params)` is available globally (defined inline in `BaseLayout.astro`, with a no-op fallback when GA is absent); components call `window.trackEvent?.(...)` directly.

**Environment variables** (see `.env.example`):

- `PUBLIC_GA_ID` — GA4 measurement ID (optional; tracking disabled if absent)
- `MAIN_CTA_URL` — primary CTA href (falls back to `/#demo` if absent)
- `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` — used by the `#demo` lead form (ContactForm.astro)

**Icons:** `astro-icon` with `@iconify-json/lucide` and `@iconify-json/simple-icons`. Usage: `<Icon name="lucide:check" width={18} height={18} />`; brand marks use the `simple-icons:` prefix (e.g. `simple-icons:whatsapp`).

**Public assets:**

- `/logo.ico` — brand logo
- `/terracore.jpg` — default OG image (1200×630)
- `/images/terracore.webp` — farm photo
- `/screens/` — dashboard screenshot WebPs (dashboard-1/2, animales-1..3, insumos-1..5, produccion-1..4, salud-animal-1..6)
- `/videos/demo.mp4` — product demo video, H.264/AAC, faststart (referenced in Hero lightbox)
- `/robots.txt` — points crawlers at `sitemap-index.xml`
- `/llms.txt` — plain-text product/site summary for LLM crawlers

**Testing:**

- Unit tests (Vitest, `vitest.config.ts` uses Astro's `getViteConfig` so `@utils/*` aliases and `import.meta.env` resolve the same way they do in the app): colocated as `*.test.ts` next to the source file, e.g. `src/utils/constants.test.ts`.
- If a test ever needs to cover a file under `src/pages/` (there are currently none there worth unit testing), don't colocate it as a sibling `*.test.ts`: Astro treats every file under `src/pages/` as a route, so a sibling test file gets built as a page and breaks the build. Put it in a `__tests__/` subfolder instead, Astro ignores paths starting with `_`.
- DOM-dependent tests (anything touching `window`/`document`, e.g. `src/scripts/reveal.test.ts`, `src/utils/analytics.test.ts`) need a `// @vitest-environment jsdom` pragma at the top of the file; the default environment is `node`.
- E2E tests (Playwright, `playwright.config.ts`) live in `e2e/*.spec.ts`. The config's `webServer` runs `pnpm run build && pnpm run preview` automatically, no need to start a server manually. Desktop-viewport specs run on the `chromium` project; `e2e/mobile-nav.spec.ts` is scoped to the `mobile-chromium` project (`testMatch`/`testIgnore` in the config) since the hamburger menu only exists below the `1000px` breakpoint.
- Both suites run in CI (`.github/workflows/ci.yml`): unit tests in the `quality` job, E2E in its own `e2e` job (needs `playwright install --with-deps chromium`).

## Build & Deploy

Plain static deploy, no adapter; `netlify.toml` sets `command = "pnpm run build"`, `publish = "dist"`, `NODE_VERSION = 22`. `pnpm run build` emits static pages to `dist/`, which Netlify publishes as-is. `@astrojs/sitemap` generates `dist/sitemap-index.xml` during build. Set env vars in the Netlify panel. Package manager is pnpm (`pnpm-lock.yaml`, `packageManager` field in `package.json`); native build scripts (esbuild, sharp, @parcel/watcher) are allowlisted in `pnpm-workspace.yaml`.

The Playwright E2E `webServer` runs `pnpm run build && pnpm run preview:e2e`, which serves the static `dist/` with the `serve` package (`serve dist -l 4321`). `serve` streams `dist/404.html` for unknown routes, matching the deployed 404 behavior, so the E2E suite exercises the real not-found page.

## Key Constraints

- `src/layouts/BaseLayout.astro` is excluded from Prettier (`.prettierignore`) because Prettier 3 mangles `is:inline` script syntax. Edit it manually.
- `BaseLayout.astro` is also excluded from ESLint auto-fix for the same reason.
- No React, no client-side framework. All interactivity must be vanilla JS in `<script>` blocks.
- NEVER use the em-dash character (`—`) in user-facing UI copy (headings, leads, labels, button text, FAQ, plan descriptions, any rendered string). Use a comma, colon, period, or parentheses instead. This rule applies only to UI copy — em-dashes are fine in code comments and docs like this file.

## Governance

Org-wide repository governance (branch protection / rulesets model, CI/CD hardening standard, commit conventions, licensing, security) lives in `docs/GOVERNANCE.md`. It is written as the Lumina W organization standard (not terracore-specific); the canonical copy is intended for the `lumina-w/.github` repo so every product inherits it. Apply it when setting up CI, workflows, or repo governance here.

## Git conventions

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description`, where the description is lowercase and in the imperative mood. The `scope` is optional but encouraged. There is no tooling that enforces this (no commitlint, husky, or commit hooks) — it is a convention, so keep to it manually.

- Allowed `type` values seen in the history: `feat`, `fix`, `refactor`, `chore`, `docs`, `ci`, `seo`, `a11y`, `perf`, `test`, `style`, `build`.
- Common scopes: the area touched (`pricing`, `data`, `env`, `deps`), lowercase kebab-case.
- Examples: `feat(pricing): actualizar precios y planes`, `chore: migrate to pnpm`, `ci: fix prettier README error`.
- Branch names follow `type/kebab-description` (e.g. `chore/pnpm-migration`, `chore/astro-v6-upgrade`).
