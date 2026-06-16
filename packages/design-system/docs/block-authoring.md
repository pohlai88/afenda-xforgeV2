# Afenda Block Authoring Guide

Afenda blocks are production ERP compositions built from `afenda-ui` primitives. Blocks give app teams stable layout, density, metadata, diagnostics, and governance contracts without moving domain routing, persistence, or business policy into the design system.

## Choose the Right Block Layer

| Need | Use |
|------|-----|
| Page orientation, filters, metrics, empty states, form grouping | Foundation blocks |
| Tables, bulk action bars, entity summaries, timelines, audit panels | Operator blocks |
| Dense queues, command search, evidence panels, dashboards, record editors | Advanced blocks |
| Full ERP workspace compositions | Workflow blocks |
| Metadata-driven rendering from schema v1 | `MetadataPageRenderer` and metadata schemas |
| Release evidence and quality status | `QualityGatesBlock` |
| ERP workflow composition rules without new UI | Afenda Pattern Library |

Do not create a new block when a foundation/operator/advanced block can be composed with app-owned data and copy.

Classify proposed contributions with the contribution lifecycle before adding a shared surface:

- Core: primitives, tokens, recipes, stable blocks, and metadata contracts.
- Extended: reusable ERP patterns that are production-ready but still proving cross-domain adoption.
- App-local: route-owned workflows, domain copy, tenant policy, and persisted behavior.
- Out-of-scope: business logic, persistence, routing, authorization engines, and backend orchestration.

## Stable Public API

Import app-facing blocks and contracts from `@repo/design-system/components/blocks`.

This barrel is the documented stable API. Keep exports explicit; do not add wildcard barrels. Additions are allowed, but removals or behavior breaks require a migration-guide entry and compatibility coverage.

Stable component families:

- Foundation: `PageHeader`, `FilterBar`, `StatsStrip`, `EmptyPanel`, `FormSection`
- Operator: `DataTableShell`, `BulkActionBar`, `EntitySummaryPanel`, `StatusTimeline`, `AuditTrailPanel`
- Advanced: `AdvancedDataTable`, `CommandSearchBlock`, `ApprovalQueueBlock`, `RiskEvidencePanel`, `RecordEditorBlock`, `OperationalDashboardShell`
- Workflow: `ApprovalControlCenter`, `TenantOperationsWorkspace`, `AuditEvidenceWorkspace`, `PolicyLockManager`, `BatchPostingReview`
- State, permission, and quality: `RuntimeStateBlock`, `SaveStateStrip`, `ReversibleBulkActionBar`, `SlaRiskEscalationPanel`, `PermissionActionToolbar`, `AuditSafeCriticalAction`, `QualityGatesBlock`
- Metadata: `MetadataPageRenderer`, `metadataPageSchema`, `metadataBlockSchema`, `resolveMetadataBinding`
- Diagnostics: `createMetadataDiagnosticsCollector`, `createMetadataDiagnosticsDispatcher`

Internal implementation modules such as `metadata-binding.ts`, `metadata-diagnostics.ts`, `metadata-renderer-core.ts`, and `state-orchestration.ts` may be imported by the block barrel, but app teams should depend on the barrel exports.

## Block Recipe Rules

Every production block must compose from `blockRecipe(...)`.

Use the existing recipe groups before local utility classes:

- `blockShell` and `blockStack` for root rhythm
- `blockHeader`, `blockHeaderContent`, `blockTitle`, `blockDescription` for identity
- `blockToolbar` for actions and filter controls
- `blockPanel`, `blockPanelPadding`, `blockSection`, `blockSectionDivider` for evidence surfaces
- `blockMetric`, `blockMetricLabel` for counts, SLA, and variance
- `blockEmpty` for no-data states

Blocks must not redefine primitive focus rings, button styles, input styles, table styles, raw hex colors, marketing gradients, or oversized radii.

## Pattern Library Rules

Use the Afenda Pattern Library when a page needs workflow guidance rather than a new component. The catalog covers approval review, batch posting, primary-detail, audit log viewer, exception handling, bulk selection, data reconciliation, policy lock/unlock, and long-running job state.

Import the typed catalog from `@repo/design-system/contracts/pattern-library` when app tooling or Storybook needs a stable list of pattern ids, required blocks, states, evidence rules, and audit rules.

## Metadata Schema v1 Rules

Metadata pages use `version: 1` and are validated with `metadataPageSchema`.

Authoring rules:

- Every block needs a stable `blockId`.
- Only supported block types from `supportedBlockTypes` are accepted by metadata rendering.
- Bindings use `{ source, path }` with optional `expectedType`, `required`, `fallback`, and `emptyFallback`.
- Required bindings must not declare `fallback`.
- Data source envelopes support `ready`, `stale`, `loading`, `idle`, `empty`, `error`, and `forbidden` states.
- Governed actions should provide explicit `permission`, `capability`, `auditEvent`, `auditScope`, and `reason`; missing values are normalized and reported as diagnostics.
- Critical actions must be reversible or confirmation-gated and should provide `confirmationLabel`.

## Diagnostics, Telemetry, And Audit

Metadata rendering can receive a `diagnostics` sink. The renderer emits:

- Diagnostics for invalid pages, missing bindings, denied/hidden blocks, normalized actions, disabled actions, and resolved runtime state.
- Telemetry for rendered blocks, normalized actions, binding issues, denied/hidden blocks, invalid pages, and state changes.
- Audit payloads for normalized/disabled actions, denied blocks, and state changes.

Use `createMetadataDiagnosticsCollector()` in tests and Storybook/dev diagnostics. App-owned telemetry pipelines should provide a sink that forwards the typed payloads.

## Storybook Requirements

Every production block story lives under `apps/storybook/stories/blocks`.

Required story coverage:

- Happy path with realistic ERP data
- Dense data path when the block renders tables, queues, metrics, or dashboards
- Empty/loading/error/forbidden or readonly states when applicable
- Narrow viewport path for blocks that wrap toolbars or tables
- Interaction story for filtering, command search, selection, confirmation, undo, or editor behavior

Production block stories use `tags: ["autodocs", "block"]`. Interaction stories add `tags: ["interaction"]`. Snapshot-critical quality stories add `tags: ["snapshot"]`.

## Quality Gates

Run the narrow gate first, then widen:

```bash
pnpm --filter @repo/design-system typecheck
pnpm --filter @repo/design-system test -- metadata-renderer.test.tsx
pnpm --filter storybook typecheck
pnpm design-system:stabilize
```

With Storybook already running on `http://127.0.0.1:6006`, run:

```bash
pnpm blocks:quality
```

`blocks:quality` covers Storybook interaction tests, axe accessibility reports, Chromatic visual baselines, and overflow checks at 740px, 1024px, and wide desktop.

Do not start Storybook automatically as part of release-freeze validation. The gate assumes an already running Storybook server so local ports and developer sessions are not disrupted.
