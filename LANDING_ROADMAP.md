# Landing Roadmap — LP-TerraCore-App

Trabajo pendiente priorizado. Actualizar al completar ítems o agregar nuevos.

Prioridades: **P0** bloqueante para producción · **P1** importante · **P2** mejora

---

## Páginas pendientes

| Página          | Prioridad | Descripción                                                                                               |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `/casos-de-uso` | P2        | Casos de uso por tipo de finca (ganadera, agrícola, mixta). Reutilizar `LegalLayout` o nuevo template.    |
| `/blog`         | P2        | Blog de contenido agroindustrial para SEO long-tail. Requiere decisión de CMS o archivos MD.              |
| `404.astro`     | P1        | Página de error 404 con marca y link al inicio. Astro la sirve automáticamente si existe en `src/pages/`. |

---

## Features técnicos pendientes

### P0 — Antes de producción

- **Verificar variables de entorno en servidor de producción**
  - `BREVO_API_KEY` y `BREVO_LIST_ID` deben estar disponibles en el runtime (no solo en build).
  - `MAIN_CTA_URL` y `CONTACT_WHATSAPP` se consumen en build time — verificar que el pipeline los inyecta.

### P1 — Importante

- **WaitlistModal — integración con planes**
  - `WaitlistModal` existe y está montado en `LandingTemplate`.
  - `PLANS` en `constants.ts` tiene `ctaText`/`ctaEvent` pero no campo `waitlist: boolean`.
  - Decisión pendiente: ¿algún plan debe abrir el modal en lugar de ir al CTA externo? Si sí, agregar `waitlist: boolean` a la interfaz `Plan` y actualizar `Pricing.astro`.

- **Eventos GA4 — verificar cobertura**
  - `ctaEvent` declarado en cada plan pero el tracking puede no estar disparado en `Pricing.astro`.
  - Auditar todos los CTAs (Header, Hero, CTAFooter, Pricing) y confirmar que cada click llama `window.trackEvent`.

- **`PUBLIC_SITE_URL` en metadatos**
  - `BaseLayout.astro` usa `PUBLIC_SITE_URL` en canonical/OG pero el valor debe coincidir exactamente con `site` en `astro.config.mjs` (`https://terracoreapp.co`).
  - Verificar que no haya trailing slash discrepancy entre ambos.

### P2 — Mejora

- **Imágenes: formatos y tamaños**
  - `/screens/*.png` → convertir a `.webp` (ya se usa `dashboard-2.webp` en Hero; el resto sigue en `.png`).
  - Agregar dimensiones explícitas (`width`/`height`) en todos los `<img>` para eliminar CLS.
  - Considerar `<picture>` con fallback PNG para Safari si hay incompatibilidades.

- **Font preload**
  - Inter y Poppins se cargan desde Google Fonts. Agregar `<link rel="preconnect" href="https://fonts.googleapis.com">` si no existe ya en `BaseLayout.astro`.
  - Evaluar self-hosting de fuentes para eliminar dependencia externa y mejorar LCP.

- **`SecuritySection.astro` — contenido real**
  - Sección existe pero puede estar con contenido placeholder.
  - Completar con certificaciones reales, descripciones de infraestructura, logos de proveedores (AWS/GCP).

- **`ProofStrip.astro` — logos reales de clientes**
  - Si la tira de prueba social usa placeholders o íconos genéricos, reemplazar con logos reales de clientes/partners cuando estén disponibles.

---

## Optimizaciones futuras

| Área                      | Descripción                                                                    | Impacto |
| ------------------------- | ------------------------------------------------------------------------------ | ------- |
| Core Web Vitals           | Medir LCP, CLS, INP en Lighthouse/PageSpeed. LCP objetivo: < 2.5s              | Alto    |
| Self-hosted fonts         | Mover Inter/Poppins a `/public/fonts/` para eliminar RTT a Google Fonts        | Medio   |
| Imágenes responsive       | `srcset` + `sizes` en imagen Hero para servir resoluciones apropiadas          | Medio   |
| CSP headers               | Content-Security-Policy en el servidor Node standalone                         | Medio   |
| Structured data adicional | JSON-LD `SoftwareApplication` o `Product` en la landing para rich results      | Bajo    |
| OG image dinámica         | Generar OG images por página con `@vercel/og` o similar si se expanden páginas | Bajo    |
| i18n                      | Versión en inglés si se expande a mercados fuera de Colombia                   | Bajo    |

---

## Deuda técnica conocida

| Archivo                        | Problema                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `src/layouts/BaseLayout.astro` | Excluido de Prettier/ESLint auto-fix. Editar siempre manualmente.                                      |
| `tailwind.config.ts`           | Duplicado de `tailwind.config.mjs`. Astro usa `.mjs`. No borrar `.ts` (puede usarse en otro contexto). |
| `@astrojs/sitemap`             | Error `Cannot read properties of undefined (reading 'reduce')` en `npm run build`. Pre-existente, no bloquea el deploy de la landing (páginas estáticas se generan correctamente). Investigar en update de dependencias. |
