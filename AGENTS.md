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
pnpm --filter <package> test
pnpm check                    # Ultracite (Biome) — repo-wide lint/format
pnpm boundaries               # Turborepo boundary checks
pnpm env:doctor               # Env contract validation
```

Add shadcn components: `npx shadcn@latest add [component] -c packages/design-system`

Database migrations after schema changes: `pnpm migrate`

---

## Change discipline

- Prefer existing `@repo/*` patterns over new abstractions
- Keep package exports explicit; use `keys.ts` for env validation
- Do not add UI for a domain package unless the pattern requires it
- Do not weaken security to make tests pass
- Scaffold-only features: state that clearly; keep boundaries ready for real persistence and auth
