# LP-TerraCore-App

Landing page de **TerraCore** — plataforma colombiana de gestión agroindustrial para fincas medianas. Construida con Astro 4, Tailwind v3, sin framework de UI.

---

## Stack

| Tecnología       | Versión | Uso                            |
| ---------------- | ------- | ------------------------------ |
| Astro            | 4.16    | Framework SSG/hybrid           |
| Tailwind CSS     | 3.4     | Utilidades de estilos          |
| astro-icon       | 1.x     | Íconos (Lucide + Simple Icons) |
| @astrojs/node    | 8.x     | Adapter para SSR del API       |
| @astrojs/sitemap | 3.x     | Genera `sitemap-index.xml`     |
| TypeScript       | 5.6     | Tipado estático                |

Output: `hybrid` — páginas estáticas + endpoint `/api/waitlist` server-side.

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
MAIN_CTA_URL=https://calendly.com/...   # URL destino de todos los botones CTA
CONTACT_WHATSAPP=573001234567           # Número WhatsApp sin +
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
│   ├── atoms/          # Eyebrow
│   ├── molecules/      # Brand, FloatChip
│   ├── organisms/      # Secciones de página y Header/Footer
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
├── styles/
│   └── globals.css         # Tokens de diseño, reset, utilidades globales
└── utils/
    ├── constants.ts        # Datos estáticos: PLANS, FAQ, PROBLEMS, FEATURES
    └── analytics.ts        # Wrapper tipado para window.trackEvent
public/
├── logo.ico
├── terracore.png           # OG image por defecto
├── robots.txt
├── screens/                # Capturas de pantalla del dashboard (.webp)
├── images/                 # Foto de finca (.webp)
└── video/
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

El proyecto usa el adapter `@astrojs/node` en modo `standalone`. El build genera un servidor Node en `dist/`.

```bash
npm run build
node dist/server/entry.mjs
```

Variables de entorno deben estar disponibles en el servidor en producción.

El sitemap se genera automáticamente en `dist/sitemap-index.xml` durante `npm run build`.

---

## Notas de configuración

- `BaseLayout.astro` está excluido de Prettier (`.prettierignore`) porque Prettier 3 rompe la sintaxis `is:inline`. Editar manualmente.
- Existen `tailwind.config.mjs` y `tailwind.config.ts` — Astro usa el `.mjs`. No borrar el `.ts`.
- `src/utils/constants.ts` existe pero actualmente los componentes tienen los datos inline. `constants.ts` puede ser la fuente de verdad si se consolidan los datos.
