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

## Storybook Example Policy

Storybook workshop tags such as `autodocs`, `afenda-ui`, `block`,
`foundations`, `primitive`, `interaction`, and `snapshot` do not automatically
create AI copy-paste example obligations. Only explicit `example`,
`ai-example`, `copy-paste-example`, `afendaExample: true`, or `aiExample: true`
markers require `afendaContractVersion`. If any story declares
`afendaContractVersion`, the drift gate requires it to match the current
contract version.

## Required Gates

```bash
pnpm design-system:docs-audit
pnpm design-system:governance
pnpm governance
```

Use narrower commands such as `pnpm --filter @repo/design-system typecheck`,
`pnpm --filter @repo/design-system test`, and `pnpm design-system:check-drift`
only for debugging a failed governance run.

## Decision

Docs are release-ready for the hard-migrated design-system wall. Any future
catalog or scorecard must be rebuilt under an `afenda-*` authority name and
added to the executable drift gate before use.
