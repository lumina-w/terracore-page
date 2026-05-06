# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (localhost:4321)
npm run build        # production build → dist/
npm run preview      # serve dist/ locally
npm run typecheck    # astro check (TS + Astro template types)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check (CI)
```

No test suite exists. Typecheck is the primary correctness gate.

## Architecture

Static SSG landing page. No server runtime, no React. Single route: `src/pages/index.astro`.

**Render path:**
`index.astro` → `BaseLayout.astro` (head, GA4, fonts) → `LandingTemplate.astro` (assembles all sections) → organisms/molecules/atoms

**Section order** (LandingTemplate):
Hero → ProofStrip → Modules → Showcase → Benefits → Pricing → SecuritySection → FAQSection → CTAFooter

**Atomic design layers** — import aliases enforce the hierarchy:

- `@atoms/*` — Eyebrow, Btn, TerraLogo
- `@molecules/*` — Brand (logo+name), FloatChip
- `@organisms/*` — all page sections
- `@components/*` — catch-all (Hero, Header, Footer, FAQSection, CTAFooter live here, not in organisms/)
- `@layouts/*` — BaseLayout only

**Styling approach:**

- `src/styles/globals.css` — all CSS custom properties (design tokens). Always use token names, never raw hex values. Imported once in BaseLayout via `@layer base/components/utilities`.
- Tailwind v3 configured in `tailwind.config.mjs` — extends tokens from globals.css into Tailwind's theme. Prefer CSS custom properties over Tailwind utility classes for colors/spacing in component `<style>` blocks.
- Scoped `<style>` blocks in each component. Use `:global()` only for child selectors that cross component boundaries (e.g., float chip positioning from Hero.astro affecting FloatChip.astro).
- Keyframes `floatA` / `floatB` defined in globals.css, referenced in Hero.astro.

**Interactivity:**
All JS is vanilla, written in Astro `<script>` blocks (no framework). Key patterns:

- IntersectionObserver for scroll-triggered count-up (Hero) and `.reveal` class (LandingTemplate)
- Dataset attributes (`data-count-to`, `data-faq`, `data-img`) drive JS behavior
- Mobile nav toggle in Header.astro uses `drawer.dataset.open` + aria attributes

**Static data:**
`src/utils/constants.ts` exports typed interfaces and arrays: `PLANS`, `PROBLEMS`, `FEATURES`, `FAQ`. Components consume these directly — no CMS or API.

**Analytics:**
GA4 wired in BaseLayout via `is:inline` scripts (excluded from Prettier — see `.prettierignore`). `window.trackEvent(name, params)` is available globally. `src/utils/analytics.ts` exports a typed `trackEvent` wrapper for use inside `<script>` blocks.

**Environment variables** (see `.env.example`):

- `PUBLIC_GA_ID` — GA4 measurement ID (optional; tracking disabled if absent)
- `PUBLIC_SITE_URL` — used for canonical/OG URLs
- `MAIN_CTA_URL` — primary CTA href
- `CONTACT_WHATSAPP` — WhatsApp number without `+`

**Icons:** `astro-icon` with `@iconify-json/lucide`. Usage: `<Icon name="lucide:check" width={18} height={18} />`. No other icon sets installed.

**Public assets:**

- `/logo.ico` — brand logo
- `/screens/` — dashboard screenshot PNGs (dashboard-1.png, dashboard-2.png, animales.png, herramientas.png, insumos.png, produccion.png, salud-1.png)
- `/video/demo.mp4` — product demo video (referenced in Hero lightbox)

## Key Constraints

- `src/layouts/BaseLayout.astro` is excluded from Prettier (`.prettierignore`) because Prettier 3 mangles `is:inline` script syntax. Edit it manually.
- `BaseLayout.astro` is also excluded from ESLint auto-fix for the same reason.
- No React, no client-side framework. All interactivity must be vanilla JS in `<script>` blocks.
- `tailwind.config.mjs` and `tailwind.config.ts` both exist — `astro.config.mjs` uses the `.mjs` version via `@astrojs/tailwind`.
