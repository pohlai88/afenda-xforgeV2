# Afenda Block Governance

Afenda blocks are governed compositions of `afenda-ui` primitives. They are not new primitives, visual experiments, or domain workflows.

The design-system docs entry point lives in [`README.md`](./README.md).

Production authoring guidance lives in [`block-authoring.md`](./block-authoring.md). The Phase 1-9 compatibility and migration policy lives in [`block-migration-guide.md`](./block-migration-guide.md).

Workflow composition guidance lives in [`pattern-library.md`](./pattern-library.md). Pattern contracts are typed in `contracts/pattern-library.contract.ts`.

Enterprise screen guidance lives in [`enterprise-screen-patterns.md`](./enterprise-screen-patterns.md). Screen contracts are typed in `contracts/enterprise-screen-patterns.contract.ts`.

Component readiness guidance lives in [`component-scorecards.md`](./component-scorecards.md). Scorecards are typed in `contracts/component-scorecards.contract.ts` and are the release-readiness record for primitives and blocks.

Contribution lifecycle guidance lives in [`contribution-lifecycle.md`](./contribution-lifecycle.md). Layer contracts are typed in `contracts/contribution-lifecycle.contract.ts`.

Documentation health is scored in [`design-system-docs-audit.md`](./design-system-docs-audit.md).

## Release-Freeze Contract

The current block platform is in release-freeze hardening. App-facing imports from `@repo/design-system/components/blocks`, metadata schema `version: 1`, diagnostics payload families, governed action normalization, and fixture metadata are stable.

Future changes must be additive unless the migration guide documents the break and compatibility tests cover both the old and new path.

## Layer Rule

- Primitive owns control anatomy, state, focus, invalid, disabled, and aria wiring.
- Block owns layout, hierarchy, density, and local evidence structure.
- App owns routing, permissions, persistence, business copy, and domain state.

## Required Recipe Use

Every block must compose from `packages/design-system/components/blocks/block-recipes.ts`.

Use these recipe groups before adding local utility classes:

- `blockShell` and `blockStack` for root rhythm.
- `blockHeader`, `blockHeaderContent`, `blockTitle`, and `blockDescription` for section identity.
- `blockToolbar` for actions, filters, and reversible controls.
- `blockPanel` and `blockPanelPadding` for evidence and metadata surfaces.
- `blockSection` and `blockSectionDivider` for internal grouping.
- `blockMetric` and `blockMetricLabel` for counts, SLA, variance, and pressure.
- `blockEmpty` for absence-of-data states.
- `blockChrome`, `blockRail`, and `blockStage` for app-shell topology (chrome strips, rails, and canvas).

Layout dimensions for app-shell use `--xforge-layout-*` tokens in `styles/globals.css` (topbar heights, sidebar widths, site insets, drawer bounds). Blocks reference these tokens — do not hardcode pixel or hex values.

## Density Defaults

- Default block gap is `gap-4`.
- Default panel padding is `var(--card-padding)`.
- Default block title is `15px`, not page-title scale.
- Supporting block copy uses the caption token.
- Metrics must use tabular numbers.

## Block Family Contracts

The first governed block families are:

- `page-header`
- `filter-bar`
- `data-table-shell`
- `entity-summary-panel`
- `audit-trail-panel`
- `stats-strip`
- `empty-panel`
- `form-section`
- `app-shell`

Their anatomy, allowed primitive families, and implementation notes live in `components/blocks/layout-contracts.ts`.

## Prohibited Drift

- Do not redefine primitive focus rings inside blocks.
- Do not use raw hex colors.
- Do not use marketing gradients, glass effects, or oversized radii for ERP blocks.
- Do not place critical actions in filter bars.
- Do not use toast as a substitute for audit evidence.
- Do not create block-local button, input, badge, or table styles.

## Storybook Requirement

Every production block must have a story under `apps/storybook/stories/blocks`.

The readiness story may demonstrate composition contracts before production blocks exist. Production block stories must show realistic ERP states, including empty, loading, selected, and constrained-width scenarios when applicable.

Production stories must remain inside the release taxonomy documented in the migration guide. `pnpm blocks:quality` is the full Storybook quality gate and requires Storybook to already be running at `http://127.0.0.1:6006`.

Pattern guidance must have a governance story under `Blocks/Quality Gates` so app teams can inspect the catalog in Storybook.
