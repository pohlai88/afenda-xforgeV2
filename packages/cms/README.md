# @repo/cms — XForge Lightweight CMS

Git-backed, schema-validated MDX content for the XForge monorepo.

- **Architecture & requirements:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Phase 2 acceptance:** [docs/PHASE2_ACCEPTANCE.md](./docs/PHASE2_ACCEPTANCE.md)
- **Phase 3A acceptance:** [docs/PHASE3A_ACCEPTANCE.md](./docs/PHASE3A_ACCEPTANCE.md)
- **Phase 3B acceptance:** [docs/PHASE3B_ACCEPTANCE.md](./docs/PHASE3B_ACCEPTANCE.md)
- **Content:** `content/blog/`, `content/legal/`
- **Public API:** `blog.getPost()`, `legal.getPostsMeta()`, etc. via `index.ts`
- **Writer API:** `saveCmsDocument()`, `readRawDocument()` via `@repo/cms/writer`
- **Revalidation:** `getCmsCacheTags()`, `getCmsRevalidationPaths()` via `@repo/cms/revalidate`
- **Admin UI:** `apps/app` → `/cms` (requires `owner` or `editor` org role)

## Read / write / publish modes

| Mode | Env | Behavior |
| ---- | --- | -------- |
| Local read | `CMS_READ_MODE=local` (default) | Filesystem under `packages/cms/content/` |
| GitHub read | `CMS_READ_MODE=github` or `CMS_WRITE_MODE=github` | GitHub Contents API at request time |
| Local write | `CMS_WRITE_MODE=local` (default) | Write MDX to repo filesystem |
| GitHub write | `CMS_WRITE_MODE=github` | Commit MDX via GitHub Contents API |
| Live publish | `CMS_REVALIDATE_SECRET` on `apps/app` + `apps/web` | Studio publish → `POST /api/revalidate` → ISR refresh |

Production `apps/web` should set `CMS_READ_MODE=github` (or rely on auto when write mode is `github`) so published content appears without redeploying the app.

## Env vars (server)

| Variable | Purpose |
| -------- | ------- |
| `CMS_WRITE_MODE` | `local` \| `github` |
| `CMS_READ_MODE` | `local` \| `github` (optional override) |
| `CMS_GITHUB_TOKEN` | PAT with repo contents read/write |
| `CMS_GITHUB_REPO` | `owner/repo` |
| `CMS_GITHUB_BRANCH` | Branch (default `main`) |
| `CMS_PREVIEW_SECRET` | HMAC for signed draft preview URLs |
| `CMS_REVALIDATE_SECRET` | Bearer token for `/api/revalidate` |
