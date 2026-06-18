---
name: afenda-xforge
description: Expert assistance for Afenda XForge — a governance-first Turborepo monorepo for Next.js SaaS apps. Triggers on questions about afenda-xforge setup, architecture, packages, customization, deployment, and development workflows.
---

# Afenda XForge

Afenda XForge is a production-grade Turborepo monorepo for building tenant-scoped SaaS applications. It provides multiple apps, shared `@repo/*` packages, and integrations for authentication, database, payments, email, CMS, analytics, observability, security, and governed operational modules (Orbit Case).

## Quick start

```bash
pnpm install
pnpm env:doctor
pnpm dev
```

See `references/setup.md` for env contract and bootstrap.

## References

- `references/architecture.md` — monorepo layout
- `references/packages.md` — package ownership
- `references/customization.md` — swapping providers
- `references/setup.md` — local dev and env

## Agent guide

Repo root `AGENTS.md` is the canonical agent entry point.
