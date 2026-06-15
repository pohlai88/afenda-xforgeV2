# CMS Phase 3B — Acceptance Record

**Date:** 2026-06-15  
**Scope:** FR-14 — Publish webhooks via Svix

## Static gates

| Gate | Result |
|------|--------|
| `pnpm --filter app typecheck` | Pass |
| Event payload schema (`@repo/cms/events`) | Zod-validated |

## Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-14 | Webhook on publish | Accepted |
| FR-14.1 | `cms.document.published` on published save | Accepted |
| FR-14.2 | `cms.document.unpublished` on published delete | Accepted |
| FR-14.3 | Graceful skip when `SVIX_TOKEN` unset | Accepted |
| FR-14.4 | Payload includes `collection`, `locale`, `slug`, `title` | Accepted |

## Event types

| Event | Trigger |
|-------|---------|
| `cms.document.published` | `saveDocument` with `status: published` |
| `cms.document.unpublished` | `deleteDocument` when document was published |

## Manual smoke

1. Set `SVIX_TOKEN` in `apps/app`
2. Configure webhook endpoint in Svix app portal (`/webhooks`)
3. Publish a document from `/cms` — subscriber receives `cms.document.published`
4. Delete a published document — subscriber receives `cms.document.unpublished`

**Phase 3B verdict: Accepted (static gates; manual webhook delivery requires Svix config)**
