# CMS Phase 2 — Acceptance Record

**Date:** 2026-06-15  
**Scope:** Phase 2 — Writer API + `apps/app/cms` studio + live propagation  
**Reference:** [ARCHITECTURE.md](./ARCHITECTURE.md) §9

---

## Checklist

| Check | Result | Evidence |
| ----- | ------ | -------- |
| `@repo/cms` typecheck | **Pass** | `pnpm --filter @repo/cms typecheck` |
| `@repo/cms` validate | **Pass** | `pnpm --filter @repo/cms validate` |
| `app` typecheck | **Pass** | `pnpm --filter app typecheck` |
| `web` typecheck | **Pass** | `pnpm --filter web typecheck` |
| Writer API (`@repo/cms/writer`) | **Pass** | `saveCmsDocument`, `deleteCmsDocument`, `readRawDocument` |
| Editor auth | **Pass** | `requireEditor` / `withEditor` — `owner` and `editor` roles |
| Admin UI | **Pass** | `/cms`, `/cms/blog`, `/cms/legal`, editor + preview routes |
| Draft filtering (public) | **Pass** | `blog.getPosts()` excludes drafts; studio uses `includeDrafts` |
| Media upload | **Pass** | `uploadCmsAsset` → Vercel Blob via `@repo/storage` |
| GitHub write mode | **Pass** | `CMS_WRITE_MODE=github` + `writer/github-commit.ts` |
| GitHub runtime read | **Pass** | `loader/github-source.ts` + `CMS_READ_MODE` |
| Tagged reader cache | **Pass** | `loader/cached-reads.ts` + `unstable_cache` tags |
| On-demand revalidation | **Pass** | `apps/web/app/api/webhooks/cms-cache` + `@repo/webhooks` outbox |
| Live publish (no redeploy) | **Pass** | Publish → webhook delivery → ISR tag/path revalidation |
| Signed public preview | **Pass** | Full `NEXT_PUBLIC_WEB_URL` preview links on `apps/web` |
| Package boundary | **Pass** | Apps import `@repo/cms` / `@repo/cms/writer` only |

---

## Requirements signed off

| ID | Requirement | Phase 2 status |
| -- | ----------- | -------------- |
| FR-09 | Admin UI | Accepted |
| FR-10 | Image upload | Accepted |
| FR-07 | Draft preview | Accepted |
| FR-11 | GitHub write mode | Accepted |
| FR-15 | Live publish without app redeploy | Accepted |
| NFR-06 | Editor auth | Accepted |
| NFR-05 | Package boundary | Accepted |
| NFR-04 | CI validation | Accepted |

---

## Env vars (Phase 2)

| Variable | Scope | Purpose |
| -------- | ----- | ------- |
| `CMS_WRITE_MODE` | server | `local` (dev) or `github` (Vercel) |
| `CMS_READ_MODE` | server | `local` or `github` (defaults to github when write mode is github) |
| `CMS_GITHUB_TOKEN` | server | GitHub PAT for content read/write |
| `CMS_GITHUB_REPO` | server | `owner/repo` |
| `CMS_GITHUB_BRANCH` | server | Target branch (default `main`) |
| `CMS_PREVIEW_SECRET` | server | HMAC secret for public draft preview tokens |
| `WEBHOOK_FIRST_PARTY_WEB_URL` | server | First-party subscriber URL (`apps/app`) |
| `WEBHOOK_FIRST_PARTY_WEB_SECRET` | server | Shared Standard Webhooks secret (`apps/app` + `apps/web`) |
| `BLOB_READ_WRITE_TOKEN` | server | Vercel Blob uploads |
| `NEXT_PUBLIC_WEB_URL` | client | `apps/app` — first-party URL target + preview links |

---

## Manual smoke

1. Set `WEBHOOK_FIRST_PARTY_WEB_URL` and `WEBHOOK_FIRST_PARTY_WEB_SECRET` (same secret in `apps/app` and `apps/web`) — or run `pnpm env:sync`
2. Sign in to `apps/app` as org **owner** or **editor**
3. Open `/cms` → create or edit a blog draft → save
4. Publish → refresh `localhost:3001/blog` — new/updated post appears **without** restarting dev servers
5. Copy public preview link → opens on `localhost:3001` with `?preview=draft&token=`
6. Upload image in blog frontmatter → Blob URL saved and renders on web

**Production:** `apps/web` needs `CMS_READ_MODE=github`, `CMS_GITHUB_*`, and `WEBHOOK_FIRST_PARTY_WEB_SECRET`. `apps/app` needs `CMS_WRITE_MODE=github`, same GitHub vars, `WEBHOOK_FIRST_PARTY_WEB_URL`, matching webhook secret, and `NEXT_PUBLIC_WEB_URL`.

---

**Phase 2 verdict: Accepted (static gates + live propagation)**
