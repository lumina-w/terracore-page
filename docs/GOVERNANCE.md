# Estándar de gobernanza de repositorios — Lumina W

Documento canónico de gobernanza para los repositorios de la organización
`lumina-w` (terracore, okroot, saas, frontend, backend, landing, y futuros).

> **Dónde vive este documento.** Este archivo es el estándar de la organización,
> no de un producto concreto. La copia canónica debería residir en el repo
> especial `lumina-w/.github` (GitHub lo aplica como default a todos los repos
> de la org). Mientras eso no exista, esta copia en `LP-TerraCore/docs/` sirve
> de referencia. Cada producto puede enlazarlo desde su propio `CLAUDE.md` /
> `README.md` para que tanto las personas como Claude Code apliquen el mismo
> criterio.

---

## 1. Modelo de protección de ramas (branch protection)

GitHub tiene dos sistemas: **Classic branch protection** (legado) y **Rulesets**
(actual). Usamos **Rulesets**. No mezclar ambos sobre la misma rama.

> **Requisito de plan.** Los **rulesets de organización** y el enforcement en
> **repos privados** requieren **GitHub Team** (o superior). En el plan Free un
> ruleset de org se puede crear pero **no se aplica**, y en privados no hay
> enforcement. Como los productos son privados, Team es prerequisito para que
> esta gobernanza sea real, no decorativa.

Arquitectura en dos capas que se apilan sobre la rama por defecto:

### Capa A — Ruleset de organización "baseline" (una vez, todos los repos)

Target: `All repositories` · `Default branch`. Reglas universales,
independientes del CI de cada producto:

| Regla                                                  | Por qué es baseline (org)                          |
| ------------------------------------------------------ | -------------------------------------------------- |
| Restrict deletions                                     | Nunca se borra la rama por defecto en ningún repo. |
| Block force pushes                                     | No reescribir historia de la rama protegida.       |
| Require a pull request before merging (**1 approval**) | Bloquea push directo; aplica igual a todos.        |
| Dismiss stale approvals on new commits                 | Un approval no sobrevive a cambios nuevos.         |
| Require approval of the most recent reviewable push    | Quien empuja no auto-aprueba su último push.       |
| Require conversation resolution before merging         | No mergear con hilos de review abiertos.           |

Opcionales de política (activar en org **solo si todos los productos aceptan**
la misma regla; si un repo discrepa, sácalo del baseline):

| Regla                          | Matiz                                                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Require linear history         | Prohíbe merge commits (obliga squash/rebase). Coherente con Conventional Commits. Es opinión de workflow, no seguridad. |
| Allowed merge methods = squash | Un commit limpio por PR. Va de la mano con linear history.                                                              |

Bypass list: incluir **Organization admin** solo para emergencias (hotfix con
CI caído). Vacío = ni los owners pueden saltarse la regla.

### Capa B — Ruleset por repo (checks específicos del CI de cada producto)

Target: la rama por defecto de ese repo. Regla: **Require status checks to
pass** + **Require branches to be up to date before merging**, listando los
**nombres de job** propios de ese repo.

> **Por qué los status checks NO van en el ruleset de org:** un check requerido
> se identifica por el nombre del job, y difiere por producto. Un check que un
> repo no reporta queda `pending` para siempre y **bloquea el merge**. Por eso
> viven en cada repo. Truco: deja correr CI una vez en un PR y selecciona los
> nombres desde el autocompletado de "Add checks" para no escribirlos a mano.

Reglas que también son **por repo** (dependen de CI, lenguaje o herramientas):

- Require workflows to pass (apunta a workflows concretos; no aparece a nivel
  de repo en todos los planes, usar status checks en su lugar).
- Require code scanning results (CodeQL; depende de GHAS y del lenguaje).
- Require code quality / Restrict code coverage (preview; umbrales por stack).
- Require review from Code Owners (solo donde exista `CODEOWNERS`).

### Reglas que NO usamos (o todavía no)

| Regla                                   | Motivo                                                                                                                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Restrict creations / Restrict updates   | Congelan la rama; estorban el desarrollo normal.                                                                                                                                       |
| Require signed commits                  | Potente para supply-chain, pero obliga a cada dev a configurar firma GPG/SSH o sus pushes se rechazan. Madurez P2: activar en org **después** de que todo el equipo tenga firma lista. |
| Automatically request Copilot review    | Conveniencia, no protección; depende de licencias. Opcional.                                                                                                                           |
| Restrict commit metadata / branch names | Solo Enterprise. N/A.                                                                                                                                                                  |

### Verificación complementaria (Settings, no archivos)

- **Secret Scanning** ON en cada repo (detecta secretos ya commiteados).
- **Push Protection** ON (bloquea el secreto _antes_ de entrar al historial;
  trufflehog en CI reacciona después del push, son complementarios).

---

## 2. Convención de commits

[Conventional Commits](https://www.conventionalcommits.org/): `type(scope): descripción`
en minúscula e imperativo. Tipos: `feat`, `fix`, `refactor`, `chore`, `docs`,
`ci`, `style`, `perf`, `test`, `build` (y en front: `seo`, `a11y`). Scope
opcional en kebab-case.

Ramas: `type/kebab-description` (p. ej. `feat/case-studies`).

La convención es manual salvo que el repo instale `commitlint` + hook de
pre-commit (husky/lefthook). Recomendado cuando el equipo crece o edita en
simultáneo.

---

## 3. Estándar de CI/CD

Todo workflow de GitHub Actions debe declarar:

- `permissions:` explícito y mínimo (por defecto `contents: read`). Sin esto el
  token hereda permisos amplios y aumenta el blast-radius.
- `concurrency:` con `cancel-in-progress: true` por ref, para no gastar minutos
  en commits obsoletos del mismo PR.
- `timeout-minutes:` por job, para que un runner colgado no consuma tiempo.
- Versión de Node desde una fuente única (`node-version-file: .nvmrc`), no
  hardcodeada por job.
- Separación fail-fast: lint/type/test antes de build antes de deploy.

Supply-chain:

- `.github/dependabot.yml` con ecosistemas `npm` (o el del stack) y
  `github-actions`, PRs semanales agrupados.
- Gate de auditoría que falle en severidad alta/crítica.
- Nivel siguiente (opcional): SHA-pin de actions de terceros; Dependabot ya
  cubre el 80% del riesgo manteniéndolas al día.

---

## 4. Versión de runtime, fuente única

La versión de Node (u otro runtime) se declara una sola vez y todo lo demás la
referencia: `.nvmrc` + `engines` en `package.json`, y el mismo valor en el
deploy (Netlify/…). Evita que local, CI y producción diverjan.

---

## 5. Licencia

Los productos de Lumina W son **propietarios** por defecto: `LICENSE` con
"todos los derechos reservados" y `"private": true` + `"license": "UNLICENSED"`
en `package.json`. Sin archivo de licencia, el default legal es igualmente
"todos los derechos reservados" pero ambiguo; el archivo lo hace explícito. Es
reversible: abrir código (MIT/Apache-2.0) es una decisión deliberada posterior.

---

## 6. Archivos de gobernanza por repo

Mínimos recomendados (los comunes pueden centralizarse en `lumina-w/.github`):

- `CONTRIBUTING.md` — setup, comandos, convenciones (puede ser específico del repo).
- `SECURITY.md` — canal de reporte de vulnerabilidades.
- `CODEOWNERS` — auto-asigna reviewers por área.
- `.github/pull_request_template.md` — checklist de PR.
- `LICENSE` — ver sección 5.

---

## 7. Regla anti-drift

Cada cambio estructural (arquitectura, scripts, config, datos) toca la
documentación en el **mismo PR**. La doc que describe código borrado o duplica
una fuente de verdad (p. ej. copia inline vs. constante) es un riesgo real y
recurrente.
