# Guía de contribución — LP-TerraCore

Documento de referencia para quienes editan este repositorio. El repo es una
landing page estática (Astro) y varias personas trabajan en él de forma
simultánea, así que estas convenciones existen para mantener el historial
legible y reducir conflictos.

> Para la arquitectura del proyecto (capas atómicas, tokens de estilo, datos
> estáticos, testing) consulta `CLAUDE.md` y el `README.md` en la raíz.

## Puesta en marcha

```bash
pnpm install          # instalar dependencias (usa el lockfile)
pnpm run dev          # servidor de desarrollo en localhost:4321
```

La versión de Node es la que fija `.nvmrc` (Node 22). Si usas `nvm`, corre
`nvm use` en la raíz del repo. El campo `engines` de `package.json` documenta
el mismo rango, así que local, CI y Netlify no divergen.

## Comandos habituales

```bash
pnpm run typecheck     # astro check (TS + tipos de plantilla Astro)
pnpm run lint          # ESLint
pnpm run lint:fix      # ESLint con auto-fix
pnpm run format        # Prettier (escribe)
pnpm run format:check  # Prettier (solo verifica, como en CI)
pnpm run test          # Vitest (unit, una pasada)
pnpm run test:e2e      # Playwright (E2E; construye y sirve dist/ primero)
```

Antes de empujar, corre al menos `pnpm run format:check`, `pnpm run lint` y
`pnpm run typecheck`. CI ejecuta todo esto y además build y E2E; si fallan, el
PR no se puede mergear.

## Convención de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): descripción
```

- La **descripción** va en minúscula y en modo imperativo ("añade", "corrige",
  no "añadido" ni "añadiendo").
- El **scope** es opcional pero recomendado: el área tocada, en kebab-case.
- No uses el carácter guion largo (`—`) en mensajes de UI; en commits y docs es
  irrelevante, pero mantén la línea de asunto corta (≤ 72 caracteres).

### Tipos permitidos

| Tipo       | Cuándo usarlo                                   |
| ---------- | ----------------------------------------------- |
| `feat`     | nueva funcionalidad o sección visible           |
| `fix`      | corrección de un bug                            |
| `refactor` | cambio de código sin alterar comportamiento     |
| `chore`    | tareas de mantenimiento, dependencias, config   |
| `docs`     | solo documentación                              |
| `ci`       | workflows de CI/CD, GitHub Actions              |
| `style`    | formato, espacios, comas (sin cambio de lógica) |
| `perf`     | mejoras de rendimiento                          |
| `test`     | añadir o ajustar tests                          |
| `build`    | sistema de build, empaquetado                   |
| `seo`      | metadatos, structured data, sitemap             |
| `a11y`     | accesibilidad                                   |

### Scopes comunes

El área tocada, en kebab-case: `pricing`, `data`, `env`, `deps`, `hero`,
`contact`, `faq`, etc.

### Ejemplos

```
feat(pricing): actualizar precios y planes
fix(contact): validar email antes de enviar a supabase
chore(deps): subir astro a 7.0.9
ci: añadir permissions y timeouts a los workflows
docs: documentar convención de commits
```

> La convención es manual: no hay commitlint ni hooks que la fuercen. Respétala
> a mano. Si el equipo crece y se vuelve difícil de sostener, el siguiente paso
> natural es añadir `commitlint` + un hook de pre-commit (husky o lefthook).

## Ramas y flujo de trabajo

- Nombra las ramas `type/kebab-description`, p. ej. `feat/case-studies`,
  `chore/pnpm-migration`, `fix/mobile-nav-overlap`.
- Los Pull Requests apuntan a `main`.
- Un PR debería tener los checks de CI en verde antes de mergear
  (Format & Lint, Build, E2E, Lighthouse).

### Trabajando en simultáneo

Con varias personas editando a la vez, para minimizar conflictos:

1. Parte siempre de `main` actualizado: `git fetch origin && git rebase origin/main`.
2. Haz commits pequeños y enfocados en un solo tema.
3. Antes de empujar, vuelve a sincronizar con `main` (`git pull --rebase origin main`).
4. Si dos personas van a tocar el mismo archivo grande (`constants.ts`,
   `globals.css`), coordínenlo antes para no pisarse.
5. Mantén la documentación al día en el **mismo PR** que el cambio de código.
   El drift doc↔código es un riesgo real en este repo (p. ej. `FAQ` en
   `constants.ts` debe seguir sincronizado con el texto inline de
   `FAQSection.astro`).

## Dependencias

- El gestor de paquetes es **pnpm** (fijado en `packageManager`). No uses npm ni
  yarn: romperías el lockfile.
- Dependabot abre PRs semanales agrupados para npm y GitHub Actions
  (`.github/dependabot.yml`). Revísalos y mergéalos con los checks en verde.
- CI corre `pnpm audit --audit-level=high`; un fallo de nivel alto o crítico
  bloquea el pipeline.

## Licencia

El código es propiedad de Lumina W (propietario, "todos los derechos
reservados"). Ver `LICENSE`. No lo redistribuyas fuera de la organización sin
permiso.
