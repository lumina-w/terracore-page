# LP-TerraCore-App

Landing page de **TerraCore** — plataforma colombiana de gestión agroindustrial para fincas medianas. Construida con Astro 7, Tailwind v3, sin framework de UI.

---

## Stack

| Tecnología       | Versión | Uso                                           |
| ---------------- | ------- | --------------------------------------------- |
| Astro            | 7.0     | Framework SSG + SSR adapter                   |
| Tailwind CSS     | 3.4     | Utilidades de estilos (PostCSS)               |
| astro-icon       | 1.x     | Íconos (Lucide + Simple Icons)                |
| @astrojs/netlify | 8.x     | Adapter de deploy (sin rutas SSR activas hoy) |
| @astrojs/sitemap | 3.x     | Genera `sitemap-index.xml`                    |
| TypeScript       | 5.6     | Tipado estático                               |
| pnpm             | 11.x    | Gestor de paquetes                            |
| Vitest           | 4.x     | Tests unitarios                               |

Output: `static`, todas las páginas son estáticas. "Estático" describe cómo se genera el HTML (pre-renderado en build, sin servidor armándolo por request), no si la página tiene forms o interactividad: el form `#demo` (`ContactForm.astro`) sigue funcionando normal porque hace `fetch()` desde el navegador directo a la API REST de Supabase con la key pública anónima, nunca necesitó ruta de servidor. El adapter de Netlify sigue configurado por si hace falta SSR a futuro, pero hoy no hay ninguna ruta `prerender = false` en la app (la única que había, `/api/waitlist`, necesitaba servidor porque usaba una API key secreta de Brevo que no se puede exponer en el cliente).

---

## Setup local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con los valores reales

# 3. Iniciar servidor de desarrollo
pnpm run dev
# → http://localhost:4321
```

### Variables de entorno requeridas

Copiar `.env.example` y completar:

```env
PUBLIC_GA_ID=G-XXXXXXXXXX        # Google Analytics 4 (opcional; tracking desactivado si está vacío)
MAIN_CTA_URL=/#demo                      # URL destino de los botones CTA (default /#demo)
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co   # Form #demo (ContactForm.astro)
PUBLIC_SUPABASE_ANON_KEY=eyJ...                # Form #demo
```

`PUBLIC_*` quedan expuestas en el bundle del cliente.

---

## Comandos

```bash
pnpm run dev           # Servidor de desarrollo (localhost:4321)
pnpm run build         # Build de producción → dist/
pnpm run preview       # Servir dist/ localmente
pnpm run typecheck     # Astro check (TS + tipos de templates)
pnpm run lint          # ESLint
pnpm run lint:fix      # ESLint con auto-fix
pnpm run format        # Prettier (escribe)
pnpm run format:check  # Prettier (solo verifica, para CI)
pnpm run test           # Tests unitarios (Vitest)
pnpm run test:watch     # Vitest en modo watch
pnpm run test:coverage  # Vitest con reporte de cobertura
```

`typecheck` y los tests unitarios son los gates de corrección antes de hacer merge (ambos corren en CI, ver `.github/workflows/ci.yml`).

---

## Estructura de carpetas

```
src/
├── components/
│   ├── ContactForm.astro   # Form #demo (Supabase)
│   ├── atoms/          # Eyebrow
│   ├── molecules/      # Brand, FloatChip
│   ├── organisms/      # Secciones de página, incluye Header/Footer
│   └── templates/      # LandingTemplate (ensambla todos los organismos)
├── layouts/
│   ├── BaseLayout.astro    # Head, GA4, skip link, Header, Footer
│   └── LegalLayout.astro   # Envuelve BaseLayout para páginas legales
├── pages/
│   ├── index.astro         # Landing principal
│   ├── terminos.astro      # Términos y condiciones
│   ├── privacidad.astro    # Política de privacidad
│   └── habeas-data.astro   # Habeas Data
├── scripts/
│   ├── reveal.ts           # IntersectionObserver para la clase .reveal
│   └── reveal.test.ts
├── styles/
│   └── globals.css         # Tokens de diseño, reset, utilidades globales
└── utils/
    ├── constants.ts        # Datos estáticos: PLANS, PROBLEMS, FEATURES, FAQ
    ├── constants.test.ts
    ├── analytics.ts        # Wrapper tipado para window.trackEvent
    ├── analytics.test.ts
    ├── cn.ts               # Helper para concatenar clases
    └── cn.test.ts
public/
├── logo.ico
├── terracore.jpg           # OG image por defecto (1200×630)
├── robots.txt
├── llms.txt                # Resumen de producto/sitio para crawlers LLM
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

## Testing

- **Unit (Vitest)**: colocados como `*.test.ts` junto al archivo que prueban. Si algún día hay que testear algo bajo `src/pages/`, no lo coloques como `*.test.ts` hermano: Astro trata cualquier archivo suelto en `src/pages/` como una ruta y lo compilaría como página. Usa una carpeta `__tests__/` (empieza con `_`, que Astro ignora al enrutar).
- Los tests que tocan `window`/`document` necesitan el pragma `// @vitest-environment jsdom` al inicio del archivo (el entorno por defecto es `node`).
- CI corre los tests unitarios en `.github/workflows/ci.yml`, dentro del job `quality`.

---

## Deploy

El proyecto usa el adapter `@astrojs/netlify`. El build genera las páginas estáticas en `dist/`; el adapter igual empaqueta su propia función interna en `.netlify/` (router fallback/middleware), aunque la app ya no tiene ninguna ruta propia con `prerender = false`.

```bash
pnpm run build
```

Netlify ejecuta el build y despliega automáticamente. Las variables de entorno deben configurarse en el panel de Netlify (Site settings → Environment variables): `PUBLIC_GA_ID`, `MAIN_CTA_URL`, `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`.

El sitemap se genera automáticamente en `dist/sitemap-index.xml` durante `pnpm run build`.

---

## Notas de configuración

- `BaseLayout.astro` está excluido de Prettier (`.prettierignore`) porque Prettier 3 rompe la sintaxis `is:inline`. Editar manualmente.
- Existen `tailwind.config.mjs` y `tailwind.config.ts` — Astro usa el `.mjs`. No borrar el `.ts`.
- `src/utils/constants.ts` define `PLANS`, `PROBLEMS`, `FEATURES` y `FAQ` (en ese orden). Solo `FAQ` se consume hoy (en `index.astro`, para el JSON-LD de FAQPage); las secciones aún tienen su copy inline. `constants.ts` puede ser la fuente de verdad si se consolidan los datos.
- `MetricsBand`, `CaseStudies` y `Testimonials` están en `LandingTemplate` pero ocultos (`display:none`) hasta tener datos reales de validación.
