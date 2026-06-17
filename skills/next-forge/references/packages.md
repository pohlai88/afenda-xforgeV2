# Packages

All packages live in `/packages/` and are imported as `@repo/<name>`.

## Authentication (`@repo/auth`)

**Provider**: Supabase Auth

Handles user authentication, organization membership, and session handling.

**Key exports**:
- `AuthProvider` — wrapped inside `DesignSystemProvider`
- Server guards: `withEditor`, `withOwner`, `withOrg`

**Inbound webhooks**: No HTTP auth webhook is active. `POST /webhooks/auth` on `apps/api` (port 3002) returns **501** — organization bootstrap runs on first authenticated app load.

**Swappable to**: Auth.js, Better Auth, or other providers via `@repo/auth` adapters.

## Database (`@repo/database`)

**ORM**: Prisma
**Default provider**: Neon PostgreSQL

**Key exports**:
- `database` — Prisma client instance

**Usage**:
```typescript
import { database } from '@repo/database';
const users = await database.user.findMany();
```

**Schema**: `packages/database/prisma/schema.prisma`
**Migrations**: `bun run migrate` (format → generate → db push)

**Swappable to**: Drizzle, PlanetScale, Supabase, Turso, EdgeDB, Prisma Postgres.

## Payments (`@repo/payments`)

**Provider**: Stripe

**Key exports**:
- `stripe` — Stripe client instance (optional chaining: `stripe?.prices.list()`)

**Features**: Subscriptions, one-time payments, Stripe Radar fraud prevention.

**Webhooks**: `POST /api/webhooks/payments` handles Stripe events (payment success, subscription changes, etc.).

**Swappable to**: Paddle, Lemon Squeezy.

## Email (`@repo/email`)

**Provider**: Resend + React Email

**Key exports**:
- `resend` — Resend client instance

**Usage**:
```typescript
import { resend } from '@repo/email';
import { WelcomeEmail } from '@repo/email/templates/welcome';

await resend?.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome',
  react: <WelcomeEmail />,
});
```

**Templates**: React components in the email package. Preview at `http://localhost:3003`.

## CMS (`@repo/cms`)

**Provider**: BaseHub

**Key exports**:
- `Feed`, `Body`, `TableOfContents`, `Image`, `Toolbar` — content rendering components

**Setup**: Fork the `basehub/next-forge` template, generate a Read Token, set `BASEHUB_TOKEN`.

**Features**: Type-safe content queries, Draft Mode preview, on-demand revalidation via webhooks.

**Swappable to**: Content Collections.

## Design System (`@repo/design-system`)

**Library**: shadcn/ui (New York style, neutral colors)

**Key exports**:
- `DesignSystemProvider` — wraps tooltip, toast, analytics, auth, and theme providers
- Full component library (Button, Dialog, Form, Table, etc.)
- Font configuration
- Utility hooks

**Add components**:
```bash
npx shadcn@latest add [component] -c packages/design-system
```

**Update components**:
```bash
bun run bump-ui
```

**Dark mode**: Integrated via `next-themes`. The provider handles theme switching.

## Analytics (`@repo/analytics`)

**Web analytics**: Vercel Web Analytics (enable in dashboard), Google Analytics (via `NEXT_PUBLIC_GA_MEASUREMENT_ID`).

**Product analytics**: PostHog (default).

**Key exports**:
- `analytics` from `@repo/analytics/server` — server-side tracking
- `analytics` from `@repo/analytics/posthog/client` — client-side tracking

**Usage**:
```typescript
import { analytics } from '@repo/analytics/server';
analytics?.capture({ event: 'user_signed_up', distinctId: userId });
```

**Ad-blocker bypass**: PostHog requests are reverse-proxied through Next.js rewrites (`/ingest/*`).

## Observability (`@repo/observability`)

**Error tracking**: Sentry — captures exceptions and performance data.

**Logging**: BetterStack Logs in production, console in development.

**Key exports**:
- `log` from `@repo/observability/log` — logging interface (`log.info()`, `log.error()`, etc.)
- Sentry configuration via `instrumentation.ts` and `sentry.client.config.ts`

**Uptime monitoring**: BetterStack integration.

**Sentry tunneling**: Requests proxied through rewrites to bypass ad-blockers.

## Storage (`@repo/storage`)

**Provider**: Vercel Blob (multi-store)

| Env | Store | Access | Use |
|-----|-------|--------|-----|
| `XFORGE_PUB_BLOB_READ_WRITE_TOKEN` + `XFORGE_PUB_STORE_ID` | `afenda-xfroge-public` | public | CMS images, Orbit Case attachments |
| `XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN` + `XFORGE_STORE_ID` | `afenda-xfroge-sensitive` | private | Server-only blobs via `readPrivateBlob()` |
| `BLOB_READ_WRITE_TOKEN` + `BLOB_STORE_ID` | `afenda-erp-documents` | private | Legacy default store (optional) |

Each store requires its **own** read-write token — a single `BLOB_READ_WRITE_TOKEN` cannot authenticate all stores.

**Key exports**:
- `put` + `getPublicBlobPutOptions()` — public server-side upload
- `uploadPrivateBlob` / `readPrivateBlob` / `deletePrivateBlob` — private store helpers
- `upload` from `@repo/storage/client` — client-side upload

**Diagnostics**: `pnpm blob:check`, `pnpm blob:probe`, `pnpm blob:probe:private`, `pnpm blob:stores`

**Note**: Server uploads are limited to 4.5MB. Use client uploads for larger files. Private blobs must be read with `get()` / `readPrivateBlob()` — do not expose URLs directly to browsers.

## Security (`@repo/security`)

**Provider**: Arcjet

**Features**: Bot detection, Shield WAF (SQL injection, XSS, OWASP Top 10 prevention), rate limiting, IP geolocation.

**Configuration**: Central client at `@repo/security`, extended per app with specific rules.

**Bot policy**: Allows search engines and preview generators; blocks scrapers and AI crawlers.

**Web app**: Security middleware runs on all non-static routes.
**Main app**: Security checks in the authenticated layout.

**Usage**:
```typescript
const decision = await aj.protect(request);
if (decision.isDenied()) {
  // handle denial
}
```

## SEO (`@repo/seo`)

**Key exports**:
- `createMetadata` from `@repo/seo/metadata` — generates Next.js metadata with deep merge

**Usage**:
```typescript
import { createMetadata } from '@repo/seo/metadata';
export const metadata = createMetadata({
  title: 'Page Title',
  description: 'Page description',
});
```

**Sitemap**: Auto-generated at build time. Scans `/app`, `/content/blog`, `/content/legal`. Filters `_` and `()` directories.

**JSON-LD**: Structured data support for search engines.

**Security headers**: Nosecone integration via `@repo/security/middleware`.

## Feature Flags (`@repo/feature-flags`)

**System**: Vercel Flags SDK + PostHog

**Define flags** in `packages/feature-flags/index.ts`:
```typescript
export const myFlag = createFlag('myFlagKey');
```

**Usage**:
```typescript
const isEnabled = await myFlag();
```

Flags require an authenticated user context. Override flags in development via the Vercel Toolbar.

## Internationalization (`@repo/internationalization`)

**Provider**: Languine

**Configuration**: `languine.json` defines source and target locales.

**Dictionaries**: TypeScript files per locale. Non-source locales are auto-translated.

**Usage**:
```typescript
const dict = await getDictionary(locale);
```

**Routing**: Language-specific paths (`/en/about`, `/fr/about`) with automatic language detection.

**Middleware**: `internationalizationMiddleware` configured for the `web` app.

**Translate**: `bun run translate`

## Webhooks (`@repo/webhooks`)

Canonical webhook control plane — Postgres outbox outbound + inbound gateway.

### Inbound (`apps/api`, port 3002)

| Route | Status | Notes |
| ----- | ------ | ----- |
| `POST /webhooks/payments` | Active | Stripe — `@repo/webhooks/inbound` + `@repo/payments/stripe-webhooks` |
| `POST /webhooks/auth` | **501 stub** | Not configured; org bootstrap on first app load |

**Local Stripe testing:** `stripe listen --forward-to localhost:3002/webhooks/payments`

### Outbound

**Provider:** Internal outbox (`webhook_endpoints` + `webhook_deliveries`)

**Key exports:**
- `@repo/webhooks` — `verifyStandardWebhook`, types, signing helpers (isomorphic)
- `@repo/webhooks/inbound` — `handleInboundWebhook`, `registerInboundHandler`
- `@repo/webhooks/server` — enqueue, dispatch, endpoint CRUD, rotation, replay, retention

| Server export | Purpose |
| ------------- | ------- |
| `enqueueWebhookEvent(orgId, eventType, data)` | Fan-out to matching endpoints + first-party web |
| `processPendingDeliveries(limit)` | Cron worker delivery + retries |
| `createWebhookEndpoint` / `listWebhookEndpoints` / `updateWebhookEndpoint` / `deleteWebhookEndpoint` | Endpoint management |
| `resetWebhookEndpointHealth` | Clear auto-disable strikes / cooldown |
| `rotateWebhookEndpointSecret` | 24h grace dual-signature rotation |
| `replayWebhookDelivery` | Re-queue failed deliveries |
| `listWebhookDeliveries` | Audit history — `{ deliveries, nextCursor }` with endpoint, status, cursor filters |
| `pruneOldWebhookDeliveries` | Retention cron cleanup |

CMS publish calls `emitOrgEvent` in `apps/app`; `apps/api/cron/webhooks-deliver` delivers with Standard Webhooks v1 signing. First-party marketing cache: `WEBHOOK_FIRST_PARTY_WEB_URL` → `apps/web` `POST /api/webhooks/cms-cache`. Subscriber guide: `packages/webhooks/README.md`.

## Cron Jobs (`@repo/cron`)

**Platform**: Vercel Cron

**Location**: `apps/api/app/cron/[job-name]/route.ts`

**Configuration**: `apps/api/vercel.json`

```json
{ "path": "/cron/keep-alive", "schedule": "0 1 * * *" }
```

Cron routes must use the `GET` HTTP method. Test locally via direct HTTP GET.

## Collaboration (`@repo/collaboration`)

**Provider**: Liveblocks

**Features**: Real-time presence indicators, multiplayer document editing, threaded comments.

**Hooks**: `useOthers()`, `useStorage()`, `useMutation()`, `useThreads()`

**Components**: `<Thread>`, `<Composer>`, `<InboxNotification>`

**Editor integration**: Tiptap or Lexical for collaborative rich text editing.

Requires `LIVEBLOCKS_SECRET` environment variable.

## AI (`@repo/ai`)

AI/LLM integration package for adding AI-powered features to the application.

## Rate Limit (`@repo/rate-limit`)

Rate limiting utilities used in conjunction with `@repo/security` for request throttling.

## Next Config (`@repo/next-config`)

Shared Next.js configuration applied across apps:
- Image optimization (AVIF, WebP)
- Clerk image domain patterns
- Prisma webpack plugin for monorepo builds
- PostHog reverse proxy rewrites (`/ingest/*`)
- OpenTelemetry webpack compatibility fix
- Bundle analyzer support

## TypeScript Config (`@repo/typescript-config`)

Shared TypeScript configurations extended by all apps and packages.
