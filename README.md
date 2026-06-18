# Afenda XForge

**Governance-first ERP foundation — TypeScript, pnpm, Turborepo, Next.js 16+.**

## Overview

Afenda XForge is a production-grade monorepo for tenant-scoped business systems. It provides the authenticated app shell (`apps/app`), public web surface (`apps/web`), API/cron routes (`apps/api`), and shared `@repo/*` packages for auth, database, design system, CMS, and more.

Built for teams that need audit trails, permission finality, and governed module push (Orbit Case) without diluting tenant isolation.

## Local development

```bash
pnpm install
pnpm env:doctor   # validate env contract
pnpm dev          # Turbo dev — app :3000, web :3001, api :3002
```

See `AGENTS.md` and `skills/afenda-xforge/references/setup.md` for bootstrap and env details.

## Apps

| App | Port | Role |
|-----|------|------|
| `app` | 3000 | Main authenticated SaaS app |
| `web` | 3001 | Marketing / public web surface |
| `api` | 3002 | Webhooks, cron, API routes |
| `storybook` | 6006 | Design system workshop |
| `email` | 3003 | React Email preview |
| `docs` | 3004 | Documentation |

## Quality gates

```bash
pnpm --filter app typecheck
pnpm --filter web typecheck
pnpm check:ci
pnpm check
```

## Architecture

Monorepo layout, package ownership, and customization: `skills/afenda-xforge/references/`.

Agent guide: `AGENTS.md`.

## Upstream

Derived from the [Vercel Turborepo SaaS template](https://github.com/vercel/next-forge); Afenda XForge is the governed ERP fork for this product line.
