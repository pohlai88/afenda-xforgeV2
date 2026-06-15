# `@repo/webhooks` — canonical webhook control plane

Org-scoped **outbound** webhooks (CMS publish/delete, test events) and shared **inbound** verification/dispatch (Stripe on `apps/api`). Deliveries use a Postgres outbox, Vercel cron workers, and [Standard Webhooks v1](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md) signing.

First-party `apps/web` cache refresh is delivered through the same outbound pipeline to `POST /api/webhooks/cms-cache` (not a separate Bearer revalidate hook).

## Event catalog

Canonical strings live in `lib/registry/events.ts` and are re-exported from `@repo/webhooks`.

| Event | Direction | Trigger |
| ----- | --------- | ------- |
| `cms.document.published` | Outbound | CMS document saved with `status: published` |
| `cms.document.unpublished` | Outbound | Published document deleted |
| `webhook.test` | Outbound | Owner clicks **Test** on `/webhooks` |
| `stripe.checkout.session.completed` | Inbound | Stripe webhook on `apps/api` |
| `stripe.subscription_schedule.canceled` | Inbound | Stripe webhook on `apps/api` |

Payload schemas for CMS events live in `@repo/cms/events` (constants re-exported from this package).

## Producing outbound events

Apps should call `emitOrgEvent` in `apps/app/lib/emit-org-event.ts` — the sole producer — which delegates to `enqueueWebhookEvent`. Do not call `fetch` to subscriber URLs from app code.

## Payload shape

Event id is **not** in the JSON body — it is sent in the `webhook-id` header.

```json
{
  "type": "cms.document.published",
  "timestamp": "2026-06-15T08:00:00.000Z",
  "organizationId": "org_…",
  "data": {
    "collection": "blog",
    "locale": "en",
    "slug": "welcome",
    "title": "Welcome",
    "status": "published",
    "publishedAt": "2026-06-01"
  }
}
```

## Signing (Standard Webhooks v1)

Headers on every delivery:

| Header | Value |
| ------ | ----- |
| `webhook-id` | Event id (use for idempotency) |
| `webhook-timestamp` | Unix seconds |
| `webhook-signature` | Space-delimited `v1,{base64}` HMAC-SHA256 signatures |
| `User-Agent` | `afenda-webhooks/1.0` |

Signed content:

```
{webhook-id}.{webhook-timestamp}.{raw_body}
```

Signing secrets are shown once as `whsec_{base64}` when creating or rotating an endpoint. During a 24-hour rotation grace period, deliveries include **two** signatures (current + previous secret).

## Subscriber verification

```ts
import { verifyStandardWebhook } from "@repo/webhooks";

const rawBody = await request.text();
const result = verifyStandardWebhook({
  secret: process.env.WEBHOOK_SECRET!, // whsec_… from the UI
  rawBody,
  headers: request.headers,
  toleranceSeconds: 300, // optional; default 300
});

if (!result.ok) {
  return new Response(result.error, { status: 401 });
}

const payload = JSON.parse(rawBody);
```

## Server APIs (`@repo/webhooks/server`)

| Export | Purpose |
| ------ | ------- |
| `enqueueWebhookEvent(orgId, type, data)` | Fan-out to matching enabled endpoints |
| `processWebhookDeliveries({ deliveryIds?, limit? })` | Deliver claimed rows |
| `processPendingDeliveries(limit)` | Cron worker (global queue) |
| `createWebhookEndpoint` / `updateWebhookEndpoint` / `deleteWebhookEndpoint` | Endpoint CRUD |
| `rotateWebhookEndpointSecret(orgId, endpointId)` | Zero-downtime secret rotation |
| `replayWebhookDelivery(orgId, deliveryId)` | Reset failed delivery to pending for cron pickup |
| `resetWebhookEndpointHealth(orgId, endpointId)` | Clear auto-disable strikes / cooldown |
| `listWebhookEndpoints` / `listWebhookDeliveries` | Audit + UI — returns `{ deliveries, nextCursor }` with `endpointId`, `status`, `cursor` filters |
| `pruneOldWebhookDeliveries()` | Retention cleanup (cron) |

## Operations

- **Delivery worker:** `GET /cron/webhooks-deliver` (every minute) — requires `CRON_SECRET`
- **Retention:** `GET /cron/webhooks-retention` (daily) — deletes deliveries older than `WEBHOOK_DELIVERY_RETENTION_DAYS` (default 90)
- **UI:** `/webhooks` in `apps/app` (owners manage endpoints; members view history)

## Environment

| Variable | Default | Scope |
| -------- | ------- | ----- |
| `WEBHOOK_DELIVERY_TIMEOUT_MS` | `10000` | Outbound HTTP timeout |
| `WEBHOOK_SIGNATURE_TOLERANCE_SEC` | `300` | Verify helper skew window |
| `WEBHOOK_DELIVERY_RETENTION_DAYS` | `90` | Retention cron cutoff |
| `STRIPE_WEBHOOK_SECRET` | — | Inbound Stripe verify (`whsec_…`) on `apps/api` |
| `WEBHOOK_FIRST_PARTY_WEB_URL` | — | First-party subscriber URL (`apps/app` outbox) |
| `WEBHOOK_FIRST_PARTY_WEB_SECRET` | — | Signing secret for `apps/web` cms-cache receiver |

## Inbound (`@repo/webhooks/inbound`)

| Export | Purpose |
| ------ | ------- |
| `registerInboundHandler(provider, eventType, handler)` | Register Stripe (or other) handlers in `apps/api/lib/webhook-handlers.ts` |
| `handleInboundWebhook(provider, request, options?)` | Verify + dispatch; Stripe verify injected via `options.stripe` |

## Tests

```bash
pnpm --filter @repo/webhooks test              # unit (crypto, validation)
pnpm --filter @repo/webhooks test:integration  # DB smoke (requires DATABASE_URL)
```

Unit and integration are separate Vitest projects in [`vitest.config.mts`](vitest.config.mts). Integration runs serially (`maxWorkers: 1`) to avoid DB races.
