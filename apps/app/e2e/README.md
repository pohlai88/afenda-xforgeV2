# App Playwright E2E

Browser tests for `apps/app` (port **3000**). Specs live in this folder; config is [`playwright.config.ts`](playwright.config.ts).

`@playwright/test` is a workspace devDependency of [`app-e2e`](package.json), linked via the root lockfile. Env helpers are TypeScript in [`helpers/load-env.ts`](helpers/load-env.ts).

## Prerequisites

1. Sync env: `pnpm env:sync` from repo root
2. Check keys: `pnpm test:e2e:env` (informational; set `E2E_CHECK_PROJECT` to enforce a tier)
3. Install Chromium: `pnpm test:e2e:install`

| Tier | Command | Requires |
|------|---------|----------|
| `auth-flows` | `pnpm test:e2e:auth` | Supabase URL + anon/publishable key (skips global setup) |
| `orbit-case` | `pnpm test:e2e:orbit-case` | Above + service role (global setup provisions user) |
| `orbit-case-blob` | `pnpm test:e2e:orbit-case:blob` | Orbit-case tier + Vercel Blob public and private keys |
| `full` | `pnpm test:e2e` | All tiers |

`pnpm test:e2e:preflight` runs `E2E_CHECK_PROJECT=orbit-case` and probes the live Supabase E2E user via the admin API (same checks Supabase MCP can confirm in SQL).

`E2E_CHECK_PROJECT` values: `report` (default), `auth-flows`, `authenticated`, `orbit-case`, `orbit-case-blob`, `full`.

Env load order (first wins per key): `.env.config` → `.env.secret` → `.env` → `.env.local` → `apps/app/.env.local`.

## Run tests

```bash
# From repo root
pnpm test:e2e                    # full suite
pnpm test:e2e:auth               # sign-in / email flows only
pnpm test:e2e:orbit-case         # core orbit-case (no blob uploads)
pnpm test:e2e:orbit-case:blob    # blob upload specs only
pnpm test:e2e:env
pnpm test:e2e:preflight          # orbit-case tier + live Supabase user probe
pnpm test:e2e:ui
```

Typecheck (app + E2E): `pnpm --filter app typecheck`

### Playwright projects

| Project | Specs | Auth |
|---------|-------|------|
| `setup` | `auth.setup.ts` | Signs in once, writes `output/playwright/.auth/e2e-user.json` |
| `auth-flows` | `auth*.spec.ts`, `email-auth.spec.ts` | Fresh session per test |
| `authenticated` | `orbit-case.spec.ts`, `orbit-case-push.spec.ts` | Reuses `storageState` from setup |
| `authenticated-blob` | `orbit-case-blob.spec.ts` | Reuses `storageState`; opt-in blob lane |

Global user provisioning: [`global-setup.ts`](global-setup.ts) (skipped when `PLAYWRIGHT_SKIP_GLOBAL_SETUP=1`).

### Flags

| Variable | Effect |
|----------|--------|
| `PLAYWRIGHT_SKIP_WEBSERVER=1` | Do not start `pnpm dev` |
| `PLAYWRIGHT_FORCE_FRESH_SERVER=1` | Always start a new dev server |
| `PLAYWRIGHT_SKIP_GLOBAL_SETUP=1` | Skip `global-setup.ts` (auth-flow-only without user provisioning) |
| `PLAYWRIGHT_BASE_URL` | Override base URL (default `http://localhost:3000`) |
| `E2E_CHECK_PROJECT` | Tier gate for `pnpm test:e2e:env` exit code |

Reports: `apps/app/output/playwright/report`

## Cursor Playwright MCP

Re-apply MCP config after edits: `pnpm mcp:configure:playwright`

### MCP → spec workflow

1. Preflight: `pnpm test:e2e:preflight` (env + live E2E user) or Supabase MCP `execute_sql` on `auth.users` / `next_forge.organization_members`
2. Start the app: `pnpm --filter app dev`
3. Explore flows via Playwright MCP against `http://localhost:3000`
4. Codify using [`helpers/sign-in.ts`](helpers/sign-in.ts), [`helpers/orbit-case.ts`](helpers/orbit-case.ts), [`helpers/fixtures.ts`](helpers/fixtures.ts)
5. Validate: `pnpm test:e2e:orbit-case` or `pnpm test:e2e:auth`

MCP and the test runner share viewport **1280×800**.

## Specs

| File | Project | Coverage |
|------|---------|----------|
| `global-setup.ts` | — | Provision E2E Supabase user |
| `auth.setup.ts` | setup | Persist authenticated `storageState` |
| `auth.spec.ts` | auth-flows | Sign-in, sign-out, password flows |
| `auth-completion.spec.ts` | auth-flows | Post-auth onboarding |
| `email-auth.spec.ts` | auth-flows | Email magic-link flows |
| `orbit-case.spec.ts` | authenticated | Case lifecycle, calendar/timeline |
| `orbit-case-push.spec.ts` | authenticated | Push to budget, origin link |
| `orbit-case-blob.spec.ts` | authenticated-blob | Public/private blob uploads (`@blob`) |

Tags: `@auth`, `@orbit-case`, `@blob`.

Credentials: [`helpers/credentials.ts`](helpers/credentials.ts).

## Test pyramid (with Vitest)

| Layer | Command | Orbit Case |
|-------|---------|------------|
| Unit | `pnpm --filter @repo/orbit-case test` | Schema, push registry, link projection |
| Integration | `pnpm --filter @repo/orbit-case test:integration` | DB push idempotency (skips without `DATABASE_URL`) |
| Component | `pnpm --filter app test` | Page shells via happy-dom |
| E2E | `pnpm test:e2e:orbit-case` | Full UI + auth (blob optional via separate script) |
