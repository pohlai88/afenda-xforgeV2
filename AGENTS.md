# afenda-Xforge Agent Guide

afenda-Xforge is a **next-forge** Turborepo — TypeScript, pnpm, Next.js 16+ (`apps/app`), Prisma/PostgreSQL, and shared `@repo/*` packages. When instructions conflict with drift in the tree, fix the implementation to match the architecture docs — not the other way around.

Scoped detail lives in `.cursor/rules/*.mdc` (index in `project-general.mdc`). Deterministic policies are enforced by `.cursor/hooks.json`.

**Stack:** TypeScript · pnpm · Turborepo · Next.js 16+ · Prisma · `@repo/*` packages.

---

## Read order

1. User instruction in the current message
2. This file + `skills/next-forge/references/*.md`
3. `.cursor/rules/*.mdc` for the paths you touch
4. Next.js APIs → MCP `nextjs_docs` from `nextjs-docs://llms-index` — **do not guess** from training data

---

## Agent behavior

### Answer before you build

- Yes/no and advice → direct answer in prose **first**, then code if needed
- Smallest correct diff; do not refactor unrelated files while "helping"

### UI layer order (visual / UX work)

| Order | Layer | Path |
|-------|-------|------|
| 1 | App wiring | `apps/app/` — `frontend-app.mdc` |
| 2 | Design system | `packages/design-system/` — shadcn/ui primitives |
| 3 | Storybook | `apps/storybook/` — `frontend-storybook.mdc` |

Prefer fixing at the app or preview layer before changing shared design-system defaults. Ask before large design-system refactors.

### Enforced by hooks (`.cursor/hooks.json`)

| Policy | Hook | Event |
|--------|------|-------|
| No destructive git on WIP | `block-destructive-git.mjs` | `beforeShellExecution` |
| No dev/start unless asked | `block-dev-servers.mjs` | `beforeShellExecution` |
| pnpm monorepo | `warn-wrong-package-manager.mjs` | `beforeShellExecution` |
| Workspace compose protected | `guard-workspace-compose.mjs` | `preToolUse` |
| NEXT_PUBLIC_ secrets | `guard-next-public-env.mjs` | `preToolUse` |
| Synced env outputs (no direct edit) | `guard-synced-env.mjs` | `preToolUse`, `beforeShellExecution` |
| Vercel prod deploy / MCP deploy / env pull | `ask-vercel-*`, `guard-vercel-deploy-mcp` | shell / MCP |
| Scoped quality gates | `stop-quality-gates.mjs` | `stop` (self-heal ×3) |

Everything else — execution, security, UI patterns, performance — stays in rules.

---

## Source of truth

| Doc | Scope |
|-----|-------|
| `skills/next-forge/references/architecture.md` | Monorepo layout, apps, packages, Turborepo |
| `skills/next-forge/references/packages.md` | Package ownership and integrations |
| `skills/next-forge/references/customization.md` | Swapping providers, deployment defaults |
| `skills/next-forge/references/setup.md` | Bootstrap, env contract, local dev |

Skill entry point: `skills/next-forge/SKILL.md`.

---

## Architecture (summary)

**Apps** (deployable):

| App | Port | Role |
|-----|------|------|
| `app` | 3000 | Main authenticated SaaS app |
| `web` | 3001 | Marketing site |
| `api` | 3002 | Webhooks, cron, API routes |
| `storybook` | 6006 | Design system workshop |
| `email` | 3003 | React Email preview |
| `docs` | 3004 | Documentation |
| `studio` | 3005 | Prisma Studio |

**Packages:** import as `@repo/<name>` (e.g. `@repo/auth`, `@repo/database`, `@repo/design-system`). Each integration package validates env vars via Zod in `keys.ts`. Integrations beyond the database are optional — missing keys disable features gracefully.

**Server components first:** `page.tsx` / `layout.tsx` stay server components; client interactivity in separate `'use client'` files.

Full detail: `skills/next-forge/references/architecture.md`, `backend-execution.mdc`, `backend-security.mdc`.

---

## Next.js & MCP (`apps/app`)

Training data for Next.js App Router and Cache Components is stale. **Docs before code.**

### MCP setup (`.cursor/mcp.json`)

Key servers: `next-devtools`, `shadcn`, `fetch`, `supabase`, `github`, `context7`.

Requires Next.js 16+ and a running dev server (`/_next/mcp` on port **3000**) for runtime tools.

1. MCP `init` with `project_path` → absolute path of **`apps/app`** (not repo root)
2. API / routing / cache questions → `nextjs_docs` — never answer from memory
3. With dev server up:
   - `nextjs_index` (pass `port: "3000"` if auto-discovery fails)
   - `nextjs_call` → `get_errors`, `get_routes`, `get_project_metadata`
4. Resolve reported errors before claiming UI/API work complete

Skill: `.cursor/skills/xforge-nextjs-vercel/`. Checklist: `nextjs-mcp-quality.mdc`.

### Static gates (no dev server)

```bash
pnpm --filter app typecheck
pnpm --filter app test
pnpm check
```

Stop hook runs scoped gates when `apps/app` or `apps/storybook` change. Full checklist: `nextjs-mcp-quality.mdc`, `vercel-deployment.mdc`.

**Do not** start `dev` / `build` / long-running servers unless the user asks — hook-enforced; avoids port conflicts.

---

## Vercel deployment

Primary deployables: **`apps/app`**, **`apps/web`**, **`apps/api`** — each as a separate Vercel project pointing at its app root.

### Environment variables

- Separate **development**, **preview**, and **production** values — never share production DB credentials with preview
- **`NEXT_PUBLIC_*` is browser-visible** — secrets belong in server-only env vars
- Env vars are **package-owned** — validated in each package's `keys.ts`; fail fast on missing required vars
- Sync local: `vercel env pull` (after linking); repo helpers: `pnpm env:sync`, `pnpm env:doctor`

### Runtime & build

- Default to **Node.js runtime** for routes needing full Node APIs; use **Edge** only when APIs are compatible
- Preview deployments for PR testing before production promotion
- Run narrow package gates locally before push

### Anti-patterns

| Issue | Fix |
|-------|-----|
| Secrets in `NEXT_PUBLIC_` | Server-only env vars |
| Preview hitting production DB | Separate preview database / branch |
| Stale pages after deploy | Review cache tags, `revalidate`, Cache Components invalidation |
| Env missing at runtime but present at build | Confirm Vercel env scope (Production / Preview / Development) |

See `vercel-deployment.mdc`, `skills/next-forge/references/customization.md`.

---

## Tooling gates

Run the **narrowest** relevant command first, then widen:

```bash
pnpm --filter <package> typecheck
pnpm --filter <package> test          # unit tests only (fast PR gate)
pnpm typecheck                        # all packages via Turbo (^typecheck graph)
pnpm typecheck:affected               # affected packages vs origin/main
pnpm check:ci                         # parallel typecheck + test (affected); no build
pnpm test                             # all package unit tests via Turbo
pnpm test:affected                    # affected unit tests vs origin/main
pnpm test:integration                 # DB smoke tests (opt-in, not in default test)
pnpm test:integration:affected       # affected integration tests vs origin/main
pnpm check                            # Ultracite (Biome) — repo-wide lint/format
pnpm boundaries                       # Turborepo boundary tag checks
pnpm env:doctor                       # Env contract validation
```

### Turbo task graph (PR vs deploy)

Three layers stay **parallel**, not chained:

| Layer | Turbo task | Role |
|-------|------------|------|
| Types | `typecheck` | `tsc --noEmit` via `@repo/typescript-config`; `dependsOn: ["^typecheck"]` |
| Runtime UI | `test` | Vitest unit tests; `dependsOn: []` — **not** `^build`, `^test`, or `^typecheck` (types gated by parallel `typecheck` in `check:ci`) |
| Ship | `build` | `next build` / Storybook static; `dependsOn: ["^build"]` only |

**Do not** add `build dependsOn typecheck` or `build dependsOn test` — that serializes deploy and duplicates CI. PR gate: `pnpm check:ci` runs `typecheck` and `test` in one Turbo invocation (parallel scheduling).

`@repo/database` `build` is a noop stub; **`typecheck` owns all `tsc --noEmit`**. Library packages tag `library`, apps tag `deployable`, `@repo/typescript-config` tags `tooling`. Root `turbo.json` boundaries deny libraries from depending on deployables.

### Storybook TypeScript (`apps/storybook`)

- Storybook is Vite/bundler-owned for runtime output. Keep `apps/storybook/package.json` `typecheck` as `tsc --noEmit`.
- Do **not** add `--emitDeclarationOnly false`; it is redundant when `--noEmit` is present and creates noisy drift.
- Do **not** enable declaration emit in Storybook. `.d.ts` generation belongs only in explicit library declaration build scripts, not Storybook preview/typecheck.
- Keep `apps/storybook/tsconfig.json` on `moduleResolution: "Bundler"` and `allowImportingTsExtensions: true`; this matches Storybook/Vite resolution and TypeScript's bundler guidance.

**Vitest `isolate` ≠ Turbo isolation** — Vitest per-package `isolate: false` (e.g. design-system) is a test-runtime optimization; Turbo task cache boundaries are unrelated.

**Test pyramid (mandatory):**

| Lane | Pattern | Turbo task | Rules |
|------|---------|------------|-------|
| Unit | `test/**/*.test.{ts,tsx}` | `test` | Mock `@repo/database`, env, and HTTP; no dotenv; no real DB/network |
| Integration | `*.integration.test.ts` | `test:integration` | Real DB/network only here; `maxWorkers: 1`, `pool: forks` |
| E2E | Playwright (`apps/app/e2e`) | *(not in Turbo `test`)* | Full browser flows only |

**Head-to-toe prohibition:** unit tests must not import live database clients, load `.env` for persistence, or exercise multi-package outbound flows. Put those in `test:integration` or Playwright.

**Shared config:** [`vitest.shared.mts`](vitest.shared.mts) exports `sharedUnitTestOptions` and `sharedIntegrationTestOptions` (CI: `github-actions` reporter + `bail: 1`). Repo bootstrap: [`test-support/setup-unit-env.ts`](test-support/setup-unit-env.ts) (unit) and [`test-support/load-integration-env.ts`](test-support/load-integration-env.ts) / [`test-support/setup-integration-env.ts`](test-support/setup-integration-env.ts) (integration). Package `test-support/` holds package-specific integration hooks only.

**Vitest config conventions:**
- Unit package configs use `defineProject` only — do not `mergeConfig` with a shared default export (avoids duplicate workspace banners).
- Integration schema migrations run once via per-package `globalSetup` (e.g. `test-support/global-setup-integration.ts`), not per-file `beforeAll`.
- Unit DB stubs: use [`test-support/mock-database.ts`](test-support/mock-database.ts) with `vi.hoisted()` — do not import live `@repo/database` in unit tests.

**Test layout:** specs live in each package's `test/` folder. Integration files live under `test/integration/` or use the `*.integration.test.ts` suffix. Turbo `test:integration` has `dependsOn: []` — no upstream unit re-run.

### Remote cache and env mode

- **Remote cache:** link with `npx turbo link` (Vercel) or set `TURBO_TOKEN` + `TURBO_TEAM` in CI (see `.github/workflows/monorepo-check.yml`). Shares `typecheck` / `test` / `build` artifacts across machines.
- **Env-aware build cache:** `app#build`, `web#build`, `api#build`, and `storybook#build` declare build-relevant env vars. Next.js app builds exclude `*.stories.*` from inputs.
- **`typecheck` inputs** exclude `test/`, `test-support/`, spec files, and Vitest configs — tests are gated by `test`, not `tsc`.
- **`envMode`:** currently `loose`. Switch to `strict` only after env lists are verified and CI stays green with explicit per-task `env` arrays.

Add shadcn components: `npx shadcn@latest add [component] -c packages/design-system`

Database migrations after schema changes: `pnpm migrate`

### TypeScript presets (`@repo/typescript-config`)

Shared presets in [`packages/typescript-config/`](packages/typescript-config/):

| Preset | Use for |
|--------|---------|
| `nextjs.json` | Next.js apps (`apps/app`, `apps/web`, `apps/api`, `apps/docs`, `apps/email`) — Next TS plugin + `.next/types` |
| `react-library.json` | TSX workspace packages (`design-system`, `auth`, `cms`, …) — no Next plugin |
| `library.json` | Server-only packages (`database`, `webhooks`, `payments`, …) — no Next plugin |
| `base.json` | Root IDE tsconfig + preset spine (`incremental: true`, `strict`) |

**Per-package tsconfig rules:**

- Set `"tsBuildInfoFile": "node_modules/.cache/tsbuildinfo.json"` in each package `compilerOptions` (paths in extended presets resolve relative to the preset file, not the consumer).
- Library/app `exclude` must be package-local: `test/`, `test-support/`, `**/*.test.ts(x)`, `**/*.integration.test.ts` — inherited preset `exclude` paths do not apply across packages.
- Workspace path alias: `@repo/*` → `../../packages/*` is defined in `library.json` / `react-library.json` / `nextjs.json`.

**Incremental typecheck:** `base.json` sets `incremental: true`; each package writes `node_modules/.cache/tsbuildinfo.json` (gitignored via `*.tsbuildinfo`). Delete that file locally if `tsc` behaves oddly.

**Vercel conformance (staged):** `noUncheckedIndexedAccess: true` is a governance target — not enabled repo-wide in `base.json` yet. Rollout: opt in on new/touched packages first → per-package audit (`database`, `webhooks`, `design-system`) → enable in `base.json` in a follow-up PR after error count is known.

**Deferred:** TS project references + `composite: true` until libraries emit `dist/`.

---

## Change discipline

- Prefer existing `@repo/*` patterns over new abstractions
- Keep package exports explicit; use `keys.ts` for env validation
- Do not add UI for a domain package unless the pattern requires it
- Do not weaken security to make tests pass
- Scaffold-only features: state that clearly; keep boundaries ready for real persistence and auth
