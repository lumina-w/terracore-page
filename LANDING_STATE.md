# Landing State — LP-TerraCore-App

Estado actual del proyecto en producción. Actualizar al hacer cambios relevantes.

---

## Páginas

| Ruta            | Archivo                       | Render                    | Estado    |
| --------------- | ----------------------------- | ------------------------- | --------- |
| `/`             | `src/pages/index.astro`       | Static (SSG)              | ✅ Activa |
| `/terminos`     | `src/pages/terminos.astro`    | Static (SSG)              | ✅ Activa |
| `/privacidad`   | `src/pages/privacidad.astro`  | Static (SSG)              | ✅ Activa |
| `/habeas-data`  | `src/pages/habeas-data.astro` | Static (SSG)              | ✅ Activa |
| `/api/waitlist` | `src/pages/api/waitlist.ts`   | SSR (`prerender = false`) | ✅ Activa |

### `/` — Landing principal

Secciones activas (en orden):

```
Hero → ProofStrip → Modules → Showcase → Benefits → Pricing → SecuritySection → FAQSection → CTAFooter
```

Modal global: `WaitlistModal` (activado por JS vía `id="wl-modal"`).

### `/api/waitlist` — Endpoint de lista de espera

- Acepta `POST` con body JSON `{ email: string }`
- Valida email básico (incluye `@` y dominio)
- Registra contacto en Brevo vía `POST https://api.brevo.com/v3/contacts`
- Requiere `BREVO_API_KEY` y `BREVO_LIST_ID` en el entorno del servidor

---

## Integraciones activas

### Google Analytics 4

- **Variable:** `PUBLIC_GA_ID`
- **Activación:** Solo si `PUBLIC_GA_ID` está definido en el build
- **Wiring:** Script `is:inline` en `BaseLayout.astro` (excluido de Prettier/ESLint)
- **API global:** `window.trackEvent(name, params)` disponible en todos los `<script>` blocks
- **Wrapper tipado:** `src/utils/analytics.ts` exporta `trackEvent(name, params)`
- **Eventos declarados en constantes:** `ctaEvent` en cada `Plan` (ej. `click_cta_plans_pro`)

### Brevo (email marketing)

- **Variables:** `BREVO_API_KEY`, `BREVO_LIST_ID` — solo server-side, nunca expuestas al cliente
- **Uso:** `/api/waitlist` suscribe emails a la lista especificada en `BREVO_LIST_ID`
- **Endpoint de Brevo:** `https://api.brevo.com/v3/contacts` con `updateEnabled: true`

### Calendly

- **Variable:** `MAIN_CTA_URL`
- **Uso:** Todos los botones CTA primarios de la landing (Header, Hero, CTAFooter, planes Profesional)
- **Tipo:** Link directo (no iframe embed)

### WhatsApp

- **Variable:** `CONTACT_WHATSAPP` — número sin `+` (ej. `573108283088`)
- **Uso:** Botón en CTAFooter → `https://wa.me/${CONTACT_WHATSAPP}`
- **Evento GA4:** `click_whatsapp_cta` (configurar en CTAFooter si no está)

---

## Variables de entorno requeridas

| Variable           | Lado               | Requerida | Descripción                                                        |
| ------------------ | ------------------ | --------- | ------------------------------------------------------------------ |
| `PUBLIC_GA_ID`     | Cliente            | No        | GA4 Measurement ID (tracking desactivado si ausente)               |
| `PUBLIC_SITE_URL`  | Cliente            | Sí        | URL base para canonical/OG (ej. `https://terracoreapp.co`)         |
| `MAIN_CTA_URL`     | Servidor (build)   | Sí        | URL del CTA principal (Calendly u otro)                            |
| `CONTACT_WHATSAPP` | Servidor (build)   | Sí        | Número WhatsApp sin `+`                                            |
| `BREVO_API_KEY`    | Servidor (runtime) | Sí\*      | API key de Brevo — solo necesaria en producción si se usa waitlist |
| `BREVO_LIST_ID`    | Servidor (runtime) | Sí\*      | ID numérico de lista en Brevo                                      |

`*` Requeridas solo si `/api/waitlist` está en uso. Sin ellas el endpoint retorna `503`.

### Variables PUBLIC\_\* vs sin prefijo

`PUBLIC_*` se incluyen en el bundle del cliente (visibles en el HTML final). Las variables sin prefijo (`BREVO_API_KEY`, `BREVO_LIST_ID`, `MAIN_CTA_URL`, `CONTACT_WHATSAPP`) solo están disponibles en tiempo de build o en el runtime del servidor Node.

---

## SEO / Metadatos

| Feature                                               | Estado                                      |
| ----------------------------------------------------- | ------------------------------------------- |
| `<title>` + `<meta description>`                      | ✅ Implementado por página                  |
| Open Graph (`og:title`, `og:description`, `og:image`) | ✅ BaseLayout                               |
| Twitter Card                                          | ✅ BaseLayout                               |
| `og:image:alt` + `twitter:image:alt`                  | ✅ BaseLayout                               |
| Imagen OG por defecto                                 | `/terracore.png`                            |
| JSON-LD (Organization + WebSite)                      | ✅ index.astro                              |
| `robots` meta tag                                     | ✅ `index, follow`                          |
| `sitemap-index.xml`                                   | ✅ Generado por `@astrojs/sitemap` en build |
| `robots.txt`                                          | ✅ `public/robots.txt`                      |

## Accesibilidad

| Feature                                     | Estado                           |
| ------------------------------------------- | -------------------------------- |
| Skip link ("Saltar al contenido principal") | ✅ BaseLayout, visible en foco   |
| `<main id="main-content">`                  | ✅ LandingTemplate + LegalLayout |
| `aria-label` en hamburger                   | ✅ Header                        |
| `aria-expanded` / `aria-controls` en nav    | ✅ Header                        |
| `aria-hidden` en drawer                     | ✅ Header                        |
| `aria-modal` + `role="dialog"` en modal     | ✅ WaitlistModal                 |
| `rel="noopener noreferrer"` en externos     | ✅ Header, Footer, CTAFooter     |
| `loading="lazy"` en imágenes no-LCP         | ✅ Showcase, Benefits            |
| Preload de imagen LCP (dashboard-2.webp)    | ✅ index.astro → BaseLayout      |
