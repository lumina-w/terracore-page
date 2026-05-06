# Componentes — LP-TerraCore-App

Arquitectura Atomic Design. Los aliases de importación (`@atoms/*`, `@molecules/*`, etc.) están definidos en `tsconfig.json`.

---

## Layouts

### `BaseLayout.astro`

Layout raíz. Incluye `<head>` completo, skip link, Header, Footer, page loader, y GA4.

**Props:**

| Prop           | Tipo     | Default                           | Descripción                                                                |
| -------------- | -------- | --------------------------------- | -------------------------------------------------------------------------- |
| `title`        | `string` | —                                 | `<title>` + og:title + twitter:title                                       |
| `description`  | `string` | `'TerraCore \| Control total...'` | meta description + OG/Twitter                                              |
| `ogImage`      | `string` | `'/terracore.png'`                | Ruta de la imagen OG                                                       |
| `ogImageAlt`   | `string` | `'TerraCore — plataforma...'`     | Alt de la imagen OG                                                        |
| `preloadImage` | `string` | —                                 | URL para `<link rel="preload" as="image">` (usar en página con imagen LCP) |

**Slots:**

| Slot    | Uso                                               |
| ------- | ------------------------------------------------- |
| default | Contenido de la página                            |
| `head`  | Inyección en `<head>` (JSON-LD, meta adicionales) |

**Notas:**

- Excluido de Prettier y ESLint auto-fix (ver `.prettierignore`).
- GA4 se activa solo si `PUBLIC_GA_ID` está definido.
- `window.trackEvent(name, params)` disponible globalmente.

---

### `LegalLayout.astro`

Extiende `BaseLayout`. Agrega `<main id="main-content">` alrededor del slot. Incluye estilos globales para páginas legales (`.terms-hero`, headings, etc.).

**Props:**

| Prop          | Tipo     | Default | Descripción         |
| ------------- | -------- | ------- | ------------------- |
| `title`       | `string` | —       | Pasa a `BaseLayout` |
| `description` | `string` | —       | Pasa a `BaseLayout` |

---

## Templates

### `LandingTemplate.astro`

Ensambla todas las secciones de la landing en orden. No tiene props.

**Orden de secciones:**

```
Hero → ProofStrip → Modules → Showcase → Benefits → Pricing → SecuritySection → FAQSection → CTAFooter
```

También incluye `WaitlistModal` (modal global, activado por JS).

---

## Atoms

### `Eyebrow.astro`

Etiqueta de sección pequeña con número opcional y punto decorativo.

**Props:**

| Prop     | Tipo      | Default | Descripción                    |
| -------- | --------- | ------- | ------------------------------ |
| `num`    | `string`  | —       | Número de sección (ej. `"01"`) |
| `onDark` | `boolean` | `false` | Variante para fondos oscuros   |
| `class`  | `string`  | —       | Clases adicionales             |

**Slot:** texto de la etiqueta.

**Uso:**

```astro
<Eyebrow num="01">Módulos</Eyebrow>
<Eyebrow onDark>Módulos</Eyebrow>
```

---

## Molecules

### `Brand.astro`

Logo + nombre de marca en fila. Usado en Header y Footer.

**Props:**

| Prop          | Tipo      | Default | Descripción                                   |
| ------------- | --------- | ------- | --------------------------------------------- |
| `mono`        | `boolean` | `false` | Texto blanco para fondos oscuros              |
| `size`        | `number`  | `28`    | Tamaño del logo en px                         |
| `showCaption` | `boolean` | `true`  | Muestra "Campo Inteligente" debajo del nombre |

**Uso:**

```astro
<Brand size={40} />
<!-- Header: colores normales -->
<Brand mono size={44} />
<!-- Footer: texto blanco -->
<Brand mono size={28} showCaption={false} />
```

---

### `FloatChip.astro`

Chip flotante con ícono, título y subtítulo. Usado en Hero para mostrar métricas o alertas flotantes.

**Props:**

| Prop      | Tipo                               | Default     | Descripción                                           |
| --------- | ---------------------------------- | ----------- | ----------------------------------------------------- |
| `icon`    | `string`                           | —           | Nombre del ícono Lucide (ej. `"lucide:check-circle"`) |
| `title`   | `string`                           | —           | Texto principal del chip                              |
| `sub`     | `string`                           | —           | Texto secundario                                      |
| `variant` | `'success' \| 'warning' \| 'info'` | `'success'` | Color del ícono                                       |
| `class`   | `string`                           | —           | Clases adicionales (posicionamiento)                  |

**Uso:**

```astro
<FloatChip
  icon="lucide:check-circle"
  title="Vacuna registrada"
  sub="Lote #47 — hace 2 min"
  variant="success"
  class="chip-a"
/>
```

---

## Organisms

Todos los organismos son secciones de página. No reciben props — leen datos desde `src/utils/constants.ts` o variables de entorno directamente.

### `Header.astro`

Barra de navegación sticky. Desktop: links + CTA. Mobile (<1000px): hamburger + drawer animado.

- Links internos: anclajes `/#seccion`
- CTA "Solicita demo": usa `MAIN_CTA_URL`
- CTA "Iniciar sesión": enlace externo a `https://terracoreapp.co/login`
- Accesibilidad: `aria-label`, `aria-expanded`, `aria-controls` en hamburger; `aria-hidden` en drawer

---

### `Footer.astro`

Footer de 4 columnas: Brand, Producto, Compañía, Contacto. Grid responsivo (4 cols → 2 → 1).

---

### `Hero.astro`

Sección hero con heading, métricas animadas (count-up via `IntersectionObserver`), FloatChips, imagen de dashboard y lightbox de video.

- Imagen LCP: `/screens/dashboard-2.webp` — precargar con `preloadImage` en `BaseLayout`
- Video: `/video/demo.mp4`
- CTA: usa `MAIN_CTA_URL`

---

### `ProofStrip.astro`

Banda horizontal de logos o métricas de prueba social.

---

### `Modules.astro`

Grid bento de los 6 módulos del producto. Datos de módulos inline en el componente (no importa de `constants.ts`).

---

### `Showcase.astro`

Visor interactivo de capturas de pantalla con tabs. Imágenes en `/public/screens/`. Usa `data-img` para cambiar src dinámicamente.

---

### `Benefits.astro`

Sección de beneficios con lista de items y foto de finca. Datos inline en el componente (no importa de `constants.ts`).

---

### `Pricing.astro`

Sección de planes con slider infinito en tablet/mobile y grid de 3 columnas en desktop.

- Desktop (≥1200px): CSS grid, `minmax(320px, 1fr)`, máximo 3×500px + gaps
- Slider (640px–1199px): loop infinito con clones, flechas
- Mobile (<640px): columna apilada
- Planes con `waitlist: true` muestran formulario → `POST /api/waitlist`
- Planes con `waitlist: false` muestran link CTA directo

---

### `SecuritySection.astro`

Sección de seguridad y confianza (certificaciones, infraestructura, etc.).

---

### `FAQSection.astro`

Acordeón de preguntas frecuentes. Datos desde `FAQ` en `constants.ts`. Toggle con `data-faq` y JS vanilla.

---

### `CTAFooter.astro`

Sección CTA final antes del footer. Dos botones: demo (Calendly) y WhatsApp.

---

### `WaitlistModal.astro`

Modal global de lista de espera. Sin props. Se activa/desactiva por JS mediante `id="wl-modal"`. `aria-modal`, `role="dialog"`, `aria-labelledby`.

---

## Íconos

Todos los íconos usan `astro-icon` con el set `@iconify-json/lucide` y `@iconify-json/simple-icons`.

```astro
import {Icon} from 'astro-icon/components';

<Icon name="lucide:check" width={16} height={16} />
<Icon name="simple-icons:whatsapp" width={18} height={18} />
```

No hay otros sets de íconos instalados.

---

## Datos estáticos (`src/utils/constants.ts`)

| Export     | Tipo         | Usado en                          |
| ---------- | ------------ | --------------------------------- |
| `PLANS`    | `Plan[]`     | ⚠️ Declarado, Pricing no lo importa (datos inline) |
| `FAQ`      | `FaqItem[]`  | ⚠️ Declarado, FAQSection no lo importa (datos inline) |
| `PROBLEMS` | `string[]`   | ⚠️ Declarado, Benefits no lo importa (datos inline) |
| `FEATURES` | array        | ⚠️ Declarado, Modules no lo importa (datos inline) |

`constants.ts` existe pero ningún componente actual lo importa. Los datos están inline en cada componente. Oportunidad de consolidar si se quiere una fuente de verdad centralizada.
