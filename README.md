# LP-TerraCore-App

Landing page de **TerraCore** — plataforma colombiana de gestión agroindustrial para fincas medianas. Construida con Astro 4, Tailwind v3, sin framework de UI.

---

## Stack

| Tecnología       | Versión | Uso                             |
| ---------------- | ------- | ------------------------------- |
| Astro            | 6.4     | Framework SSG + SSR adapter     |
| Tailwind CSS     | 3.4     | Utilidades de estilos (PostCSS) |
| astro-icon       | 1.x     | Íconos (Lucide + Simple Icons)  |
| @astrojs/netlify | 7.x     | Adapter para SSR del API        |
| @astrojs/sitemap | 3.x     | Genera `sitemap-index.xml`      |
| TypeScript       | 5.6     | Tipado estático                 |

Output: `static` con adapter, páginas estáticas + endpoint `/api/waitlist` server-side (`prerender = false`).

---

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con los valores reales

# 3. Iniciar servidor de desarrollo
npm run dev
# → http://localhost:4321
```

### Variables de entorno requeridas

Copiar `.env.example` y completar:

```env
PUBLIC_GA_ID=G-XXXXXXXXXX        # Google Analytics 4 (opcional; tracking desactivado si está vacío)
PUBLIC_SITE_URL=https://terracoreapp.co
MAIN_CTA_URL=/#demo                      # URL destino de los botones CTA (default /#demo)
CONTACT_WHATSAPP=573001234567           # Número WhatsApp sin +
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co   # Form #demo (ContactForm.astro)
PUBLIC_SUPABASE_ANON_KEY=eyJ...                # Form #demo
BREVO_API_KEY=xkeysib-...              # API key de Brevo (solo server-side)
BREVO_LIST_ID=1                        # ID de lista en Brevo
```

`PUBLIC_*` quedan expuestas en el bundle del cliente. `BREVO_API_KEY` y `BREVO_LIST_ID` son solo server-side.

---

## Comandos

```bash
npm run dev           # Servidor de desarrollo (localhost:4321)
npm run build         # Build de producción → dist/
npm run preview       # Servir dist/ localmente
npm run typecheck     # Astro check (TS + tipos de templates)
npm run lint          # ESLint
npm run lint:fix      # ESLint con auto-fix
npm run format        # Prettier (escribe)
npm run format:check  # Prettier (solo verifica, para CI)
```

No existe suite de tests. `typecheck` es el gate de corrección antes de hacer merge.

---

## Estructura de carpetas

```
src/
├── components/
│   ├── ContactForm.astro   # Form #demo (Supabase)
│   ├── atoms/          # Eyebrow
│   ├── molecules/      # Brand, FloatChip
│   ├── organisms/      # Secciones de página, Header/Footer y WaitlistModal
│   └── templates/      # LandingTemplate (ensambla todos los organismos)
├── layouts/
│   ├── BaseLayout.astro    # Head, GA4, skip link, Header, Footer
│   └── LegalLayout.astro   # Envuelve BaseLayout para páginas legales
├── pages/
│   ├── index.astro         # Landing principal
│   ├── terminos.astro      # Términos y condiciones
│   ├── privacidad.astro    # Política de privacidad
│   ├── habeas-data.astro   # Habeas Data
│   └── api/
│       └── waitlist.ts     # POST /api/waitlist (server-side, Brevo)
├── scripts/
│   └── reveal.ts           # IntersectionObserver para la clase .reveal
├── styles/
│   └── globals.css         # Tokens de diseño, reset, utilidades globales
└── utils/
    ├── constants.ts        # Datos estáticos: PLANS, FAQ, PROBLEMS, FEATURES
    ├── analytics.ts        # Wrapper tipado para window.trackEvent
    └── cn.ts               # Helper para concatenar clases
public/
├── logo.ico
├── terracore.jpg           # OG image por defecto (1200×630)
├── robots.txt
├── screens/                # Capturas de pantalla del dashboard (.webp)
├── images/                 # Foto de finca (terracore.webp)
└── videos/
    └── demo.mp4
```

### Aliases de importación

```ts
@atoms/*      → src/components/atoms/
@molecules/*  → src/components/molecules/
@organisms/*  → src/components/organisms/
@components/* → src/components/
@layouts/*    → src/layouts/
@templates/*  → src/components/templates/
```

---

## Deploy

El proyecto usa el adapter `@astrojs/netlify`. El build genera las páginas estáticas en `dist/` y la función SSR de `/api/waitlist` en `.netlify/`.

```bash
npm run build
```

Netlify ejecuta el build y despliega automáticamente. Las variables de entorno deben configurarse en el panel de Netlify (Site settings → Environment variables): `PUBLIC_GA_ID`, `PUBLIC_SITE_URL`, `CONTACT_WHATSAPP`, `MAIN_CTA_URL`, `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `BREVO_API_KEY`, `BREVO_LIST_ID`.

El sitemap se genera automáticamente en `dist/sitemap-index.xml` durante `npm run build`.

---

## Notas de configuración

- `BaseLayout.astro` está excluido de Prettier (`.prettierignore`) porque Prettier 3 rompe la sintaxis `is:inline`. Editar manualmente.
- Existen `tailwind.config.mjs` y `tailwind.config.ts` — Astro usa el `.mjs`. No borrar el `.ts`.
- `src/utils/constants.ts` define `PLANS`, `PROBLEMS`, `FEATURES` y `FAQ`. Solo `FAQ` se consume hoy (en `index.astro`, para el JSON-LD de FAQPage); las secciones aún tienen su copy inline. `constants.ts` puede ser la fuente de verdad si se consolidan los datos.
- `MetricsBand`, `CaseStudies` y `Testimonials` están en `LandingTemplate` pero ocultos (`display:none`) hasta tener datos reales de validación.
