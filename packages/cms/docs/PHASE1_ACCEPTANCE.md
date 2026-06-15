# CMS Phase 1 — Acceptance Record

**Date:** 2026-06-15  
**Verifier:** Automated acceptance run (Cursor agent)  
**Scope:** Phase 1 only — git MDX reader + `apps/web` integration  
**Reference:** [ARCHITECTURE.md](./ARCHITECTURE.md) §9 (Phase roadmap)

---

## Checklist

| Check | Result | Evidence |
| ----- | ------ | -------- |
| `@repo/cms` typecheck | **Pass** | `pnpm --filter @repo/cms typecheck` — zero errors |
| `web` typecheck | **Pass** | `pnpm --filter web typecheck` — zero errors |
| `web` production build | **Pass** | `pnpm --filter web build` — no CMS env errors; SSG routes for blog/legal |
| Stale BaseHub artifacts | **Cleared** | Removed `apps/web/.next`; fresh build has zero `basehub`/`BASEHUB` references |
| Package boundary (NFR-05) | **Pass** | No `packages/cms/content`, `gray-matter`, or `@repo/cms/loader` imports in `apps/` |
| Consumer imports | **Pass** | Blog, legal, hero, footer, sitemap use `@repo/cms` and `@repo/cms/components/*` only |
| Runtime smoke | **Pass** | All routes return 200 on `:3001` (see below) |
| Env — no `BASEHUB_TOKEN` | **Pass** | Absent from `apps/web/.env.example`, `env.ts`, and repo `.env*` files |
| Dev without CMS secrets | **Pass** | `pnpm dev` in `apps/web` reaches Ready with no CMS token / env validation errors |
| Reader API contract (§8.2) | **Pass** | `blog.getPosts` / `getPost` / `getLatestPost`; `legal.getPostsMeta` / `getPost` / `getPosts` exported from `index.ts` |
| Sample content | **Pass** | `welcome-to-xforge`, `privacy`, `terms` MDX present and render |

---

## Runtime smoke (2026-06-15)

Server: `next start -p 3001` (production build) and `pnpm dev -p 3001`.

| Route | Status | Notes |
| ----- | ------ | ----- |
| `/` | 200 | Hero CTA links to `/blog/welcome-to-xforge` |
| `/blog` | 200 | Lists post with title and slug |
| `/blog/welcome-to-xforge` | 200 | MDX body, H2 sections, code block styling, TOC nav |
| `/legal/privacy` | 200 | Legal MDX renders |
| `/legal/terms` | 200 | Legal MDX renders |
| Footer (on `/`) | Pass | Links to `/legal/privacy` and `/legal/terms` |

---

## Requirements signed off

| ID | Requirement | Phase 1 status |
| -- | ----------- | -------------- |
| FR-01 | Blog collection | Accepted |
| FR-02 | Legal collection | Accepted |
| FR-03 | Zod frontmatter validation | Accepted |
| FR-04 | MDX compile + components | Accepted |
| FR-05 | Reader API for consumers | Accepted |
| FR-06 | `apps/web` pages render content | Accepted |
| NFR-01 | Git-only content (no BaseHub) | Accepted |
| NFR-02 | No CMS-specific env vars in `apps/web` | Accepted |
| NFR-05 | Only `@repo/cms` touches `content/` | Accepted |
| NFR-07 | MIT-compatible OSS dependencies | Accepted (gray-matter, mdx-bundler, zod, rehype-*) |

---

## Explicitly deferred (Phase 1.5+)

Per [ARCHITECTURE.md](./ARCHITECTURE.md) §9 — **not** in scope for this acceptance:

| ID | Item |
| -- | ---- |
| FR-07 | Draft vs published filtering |
| FR-08 | Generic collection registry |
| NFR-04 | CI `pnpm cms:validate` |
| NFR-06 | Admin auth for studio |
| NFR-03 | Formal performance budget |

---

## Notes

- Deleting `.next` while a Turbopack dev server was running caused a transient cache corruption; a fresh dev start after rebuild recovered cleanly.
- Orphan `basehub` packages may remain in `node_modules` from prior lockfile state; no workspace `package.json` declares `basehub` as a dependency.
- Optional Node one-liner Reader smoke (`node -e "import …"`) was not run; build + route SSG validate the same contract.

---

**Phase 1 verdict: Accepted**
