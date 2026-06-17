# App Playwright E2E

Browser tests for `apps/app` (port **3000**). Specs live in this folder; config is `playwright.config.mjs`.

`@playwright/test` is a workspace devDependency of [`app-e2e`](package.json) (this folder), linked via the root lockfile.

## Prerequisites

1. Sync env: `pnpm env:sync` from repo root
2. Check keys: `pnpm test:e2e:env` (informational; use `E2E_CHECK_PROJECT=full` to fail when any tier is missing)
3. Install Chromium: `pnpm test:e2e:install`

Required for auth tests:

- `NEXT_PUBLIC_SUPABASE_URL` + anon/publishable key
- `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` (global setup + email integration)

Required for Orbit Case blob upload tests:

- `XFORGE_PUB_BLOB_READ_WRITE_TOKEN` + `XFORGE_PUB_STORE_ID` (public)
- `XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN` + `XFORGE_STORE_ID` (private)

Env load order (first wins per key): `.env.config` → `.env.secret` → `.env` → `.env.local` → `apps/app/.env.local`.

## Run tests

```bash
# From repo root
pnpm test:e2e                 # full suite (setup + auth-flows + authenticated)
pnpm test:e2e:auth            # sign-in / email flows only
pnpm test:e2e:orbit-case      # authenticated orbit-case specs (fast path)
pnpm test:e2e:env
pnpm test:e2e:ui
```

### Playwright projects

| Project | Specs | Auth |
|---------|-------|------|
| `setup` | `auth.setup.ts` | Signs in once, writes `output/playwright/.auth/e2e-user.json` |
| `auth-flows` | `auth*.spec.ts`, `email-auth.spec.ts` | Fresh session per test (sign-in UI) |
| `authenticated` | `orbit-case*.spec.ts` | Reuses `storageState` from setup |

The `authenticated` project runs in parallel locally (`workers: 50%`). Auth-flow specs stay serial.

### Flags

| Variable | Effect |
|----------|--------|
| `PLAYWRIGHT_SKIP_WEBSERVER=1` | Do not start `pnpm dev` (use an existing server) |
| `PLAYWRIGHT_FORCE_FRESH_SERVER=1` | Always start a new dev server |
| `PLAYWRIGHT_SKIP_GLOBAL_SETUP=1` | Skip `ensure-e2e-auth-user.mjs` |
| `PLAYWRIGHT_BASE_URL` | Override base URL (default `http://localhost:3000`) |
| `E2E_CHECK_PROJECT` | `report` (default), `auth-flows`, `authenticated`, or `full` for `test:e2e:env` exit code |

Reports: `apps/app/output/playwright/report`

## Cursor Playwright MCP

Project MCP entry in `.cursor/mcp.json`:

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest", "--config", "apps/app/e2e/playwright-mcp.config.json"]
}
```

Re-apply after edits: `pnpm mcp:configure:playwright`

### MCP → spec workflow

1. Start the app: `pnpm --filter app dev`
2. Reload MCP in **Cursor Settings → MCP**
3. Explore the flow with the Playwright MCP agent against `http://localhost:3000`
4. Codify the flow in a `*.spec.ts` using shared helpers:
   - [`helpers/sign-in.ts`](helpers/sign-in.ts) — password sign-in (auth-flow specs)
   - [`helpers/orbit-case.ts`](helpers/orbit-case.ts) — create case on detail page
   - [`helpers/fixtures.ts`](helpers/fixtures.ts) — `uniqueTitle` fixture (authenticated specs)
5. Validate: `pnpm test:e2e:orbit-case` or `pnpm test:e2e:auth`

MCP and the test runner share viewport **1280×800** (`playwright-mcp.config.json` + `playwright.config.mjs`).

## Specs

| File | Project | Coverage |
|------|---------|----------|
| `auth.setup.ts` | setup | Persist authenticated `storageState` |
| `auth.spec.ts` | auth-flows | Sign-in, sign-out, password flows |
| `auth-completion.spec.ts` | auth-flows | Post-auth onboarding |
| `email-auth.spec.ts` | auth-flows | Email magic-link flows |
| `orbit-case.spec.ts` | authenticated | Case lifecycle, calendar/timeline, blob uploads |
| `orbit-case-push.spec.ts` | authenticated | Push registry execution, budget origin link |

Tags: `@auth`, `@orbit-case` — use `test:e2e:auth` and `test:e2e:orbit-case` scripts.

Default credentials: `E2E_AUTH_EMAIL` / `E2E_AUTH_PASSWORD` (fallback `e2e-playwright@xforge.local`) via [`helpers/credentials.ts`](helpers/credentials.ts).

## Test pyramid (with Vitest)

| Layer | Command | Orbit Case |
|-------|---------|------------|
| Unit | `pnpm --filter @repo/orbit-case test` | Schema, push registry, link projection |
| Integration | `pnpm --filter @repo/orbit-case test:integration` | DB push idempotency (skips without `DATABASE_URL`) |
| Component | `pnpm --filter app test` | Page shells via happy-dom |
| E2E | `pnpm test:e2e:orbit-case` | Full UI + auth + blob upload |

Do not duplicate E2E flows in Vitest browser mode — keep Playwright for full-stack browser tests.
