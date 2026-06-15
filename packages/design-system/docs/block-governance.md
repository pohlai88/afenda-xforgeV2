# Afenda Block Governance

Afenda blocks are governed compositions of `afenda-ui` primitives. They are not new primitives, visual experiments, or domain workflows.

Production authoring guidance lives in [`block-authoring.md`](./block-authoring.md). The Phase 1-9 compatibility and migration policy lives in [`block-migration-guide.md`](./block-migration-guide.md).

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

Their anatomy, allowed primitive families, and implementation notes live in `components/blocks/layout-contracts.ts`.

## Prohibited Drift

- Do not redefine primitive focus rings inside blocks.
- Do not use raw hex colors.
- Do not use marketing gradients, glass effects, or oversized radii for ERP blocks.
- Do not place destructive actions in filter bars.
- Do not use toast as a substitute for audit evidence.
- Do not create block-local button, input, badge, or table styles.

## Storybook Requirement

Every production block must have a story under `apps/storybook/stories/blocks`.

The readiness story may demonstrate composition contracts before production blocks exist. Production block stories must show realistic ERP states, including empty, loading, selected, and constrained-width scenarios when applicable.
