# CMS Phase 3B — Acceptance Record

**Date:** 2026-06-15  
**Scope:** FR-14 — Publish webhooks via DIY org endpoints (Standard Webhooks v1)

## Static gates

| Gate | Result |
|------|--------|
| `pnpm --filter app typecheck` | Pass |
| `pnpm --filter @repo/webhooks test` | Pass (unit tests) |
| `pnpm --filter @repo/webhooks test:integration` | Pass (5 smoke tests, requires `DATABASE_URL`) |
| Event payload schema (`@repo/cms/events`) | Zod-validated |

## Database

| Step | Result |
|------|--------|
| `pnpm migrate` (`0007_webhook_outbox.sql`, `0009_webhook_ops.sql`) | Applied |
| `next_forge.webhook_endpoints` / `webhook_deliveries` | Present |

## Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-14 | Webhook on publish | Accepted |
| FR-14.1 | `cms.document.published` on published save | Accepted |
| FR-14.2 | `cms.document.unpublished` on published delete | Accepted |
| FR-14.3 | No-op when org has no matching endpoints | Accepted |
| FR-14.4 | Payload includes `collection`, `locale`, `slug`, `title` | Accepted |

## Event types

| Event | Trigger |
|-------|---------|
| `cms.document.published` | `saveDocument` with `status: published` |
| `cms.document.unpublished` | `deleteDocument` when document was published |
| `webhook.test` | Owner clicks Test on `/webhooks` |

## Manual smoke

1. As org owner: `/webhooks` → add HTTPS endpoint (e.g. webhook.site)
2. Copy `whsec_…` secret; verify sample payload with `verifyStandardWebhook`
3. Publish a document from `/cms` — subscriber receives signed `cms.document.published`
4. Rotate secret — old secret works during 24h grace; new secret works after
5. Force failure → replay from UI → succeeds
6. Cron `GET /cron/webhooks-deliver` retries pending deliveries (optional in dev)

## Automated smoke (`pnpm --filter @repo/webhooks test:integration`)

| Scenario | Result |
|----------|--------|
| Enqueue + deliver `cms.document.published` with Standard Webhooks signature | Pass |
| Enqueue + deliver `cms.document.unpublished` | Pass |
| Disabled endpoint → enqueue no-op | Pass |
| `processPendingDeliveries` cron path | Pass |
| Secret rotation dual-signature delivery | Pass |

**Phase 3B verdict: Accepted (Postgres outbox + Standard Webhooks v1 delivery)**
