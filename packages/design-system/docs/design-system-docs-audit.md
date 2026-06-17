# Design System Docs Audit

Audit date: 2026-06-17

Audience: design-system maintainers, app teams, and AI IDE agents.

## Summary Score

Overall docs health: 96 / 100.

The docs now match the hard migration: the only contract authority is the
12-file `afenda-*` wall. Legacy catalog contracts, identity wrappers,
scorecard contracts, and lifecycle contracts are intentionally removed.

## Current Source Of Truth

- Contracts: `packages/design-system/contracts/afenda-*.contract.ts`
- Tokens: `packages/design-system/tokens/tokens.json`
- Recipes: `packages/design-system/components/afenda-ui/recipes.ts`
- Block recipes: `packages/design-system/components/blocks/block-recipes.ts`
- Drift gate: `scripts/check-design-system-drift.mjs`
- AI drift scanner: `packages/design-system/governance/design-system-ai-drift.mjs`

## Required Gates

```bash
pnpm --filter @repo/design-system typecheck
pnpm --filter @repo/design-system test
pnpm design-system:check-drift
pnpm design-system:stabilize
```

## Decision

Docs are release-ready for the hard-migrated design-system wall. Any future
catalog or scorecard must be rebuilt under an `afenda-*` authority name and
added to the executable drift gate before use.
