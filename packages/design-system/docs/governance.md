# Governance Gates

Audience: engineers, maintainers, and AI IDE agents.

Use these gates to prove that generated or hand-written changes still obey the
repo architecture and the Afenda design-system contract wall.

## Repo Governance

Run the full repo gate before merging broad or cross-package changes:

```bash
pnpm governance
```

This runs:

- `pnpm check:ci` for affected package typecheck and unit tests.
- `pnpm boundaries` for Turborepo package boundary rules.
- `pnpm enterprise:governance` for repo-wide import and test safety rules.
- `pnpm design-system:governance` for the full Afenda design-system gate.
- `pnpm env:doctor` for environment contract health.

## Design-System Governance

Run the focused design-system gate after changing contracts, tokens, recipes,
`afenda-ui` components, blocks, Storybook examples, or design-system docs:

```bash
pnpm design-system:governance
```

This runs drift checks, component API checks, docs audit, token diff, import
boundaries, primitive readiness, Storybook hygiene, UI-craft detection,
`@repo/design-system` typecheck/tests, and Storybook typecheck.

## Failure Meanings

- Drift failure: source code violated the 12-file `afenda-*` contract wall.
- Component API failure: a component exposed ungoverned props, missing slots, or
  non-recipe styling.
- Docs audit failure: required docs, contract references, or Storybook evidence
  are stale or missing.
- Token diff failure: token metadata and CSS variables no longer line up.
- Import boundary failure: code bypassed the public design-system surface.
- Primitive readiness failure: a primitive is not ready for governed reuse.
- Storybook hygiene failure: stories drifted from the approved taxonomy or
  example policy.
- UI-craft failure: UI code introduced unapproved craft, focus, hover, motion,
  modal, table, or layout issues.
- Typecheck or test failure: TypeScript contracts or runtime behavior regressed.
- Boundary failure: packages crossed Turborepo ownership rules.
- Enterprise governance failure: app/package imports or test isolation broke
  repo-wide safety rules.
- Env doctor failure: local environment keys, examples, or provider secrets are
  incomplete or inconsistent.

Fix the first failing category before rerunning the wider gate.
