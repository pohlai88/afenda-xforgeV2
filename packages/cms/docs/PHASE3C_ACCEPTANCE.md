# CMS Phase 3C — Acceptance Record

**Date:** 2026-06-15  
**Scope:** FR-13 — Postgres CMS mirror + FTS search + audit revisions

## Static gates

| Gate | Result |
|------|--------|
| `pnpm migrate` (`0008_cms_mirror.sql`) | Applied |
| `pnpm --filter @repo/cms typecheck` | Pass |
| `pnpm --filter app typecheck` | Pass |
| `pnpm --filter api typecheck` | Pass |
| `pnpm cms:validate` | Pass |
| `pnpm --filter @repo/cms test:integration` | Pass (when `DATABASE_URL` set) |

## Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-13 | Postgres mirror for published CMS content | Accepted |
| FR-13.1 | `cms_documents` unique on `(collection, slug, locale)` | Accepted |
| FR-13.2 | Full-text search via `search_vector` GIN index | Accepted |
| FR-13.3 | Sync on studio save/delete (git remains source of truth) | Accepted |
| FR-13.4 | Append-only `cms_document_revisions` audit trail | Accepted |
| FR-13.5 | Backfill via `pnpm cms:sync` | Accepted |
| FR-13.6 | Search API `GET /search/cms?q=` | Accepted |

## Architecture

```
Git MDX (source of truth)
  → saveDocument / deleteDocument
  → upsertDocumentMirror / deleteDocumentMirror
  → next_forge.cms_documents (+ revisions)
  → GET apps/api/search/cms
  → searchDocuments (studio)
```

## Manual smoke

1. `pnpm migrate` then `pnpm cms:sync` — mirror rows for published MDX
2. Publish from `/cms` — row upserts with `status: published`
3. `GET http://localhost:3002/search/cms?q=welcome` — JSON hits
4. Studio search box on `/cms/{collection}/{locale}` — ranked Postgres mirror hits
5. `pnpm --filter @repo/cms test:integration` — upsert, FTS, delete revision smoke

**Phase 3C verdict: Accepted (Postgres mirror + FTS; git primary)**
