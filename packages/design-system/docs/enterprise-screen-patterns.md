# Enterprise Screen Patterns

Afenda screen patterns explain how to build complete ERP screens from stable
blocks, pattern guidance, metadata contracts, and app-owned behavior. They are
not new components. They are product assembly rules for dense operational
surfaces.

Audience: app engineers, domain teams, and design-system maintainers building
approval, posting, audit, policy, reconciliation, and tenant operations screens.

## What This System Does

Screen patterns answer:

- Which blocks belong together?
- Which states must be visible?
- Which evidence, audit, and diagnostics rules apply?
- Which quality gates are required before a screen pattern is promoted?
- Which behavior stays app-owned?

Use the typed catalog from
`@repo/design-system/contracts/enterprise-screen-patterns` for Storybook,
documentation, and app-team tooling.

## When To Use

Use screen patterns when a team needs a complete ERP screen, not just a single
component:

- Approval operations
- Batch posting
- Tenant master-detail
- Audit evidence review
- Policy lock administration
- Reconciliation workspace
- Exception triage
- Long-running job monitor

Do not create a new screen pattern when the problem is one local route, one
tenant policy, or one business calculation. Keep that work app-local.

## Key Concepts

### Anatomy

Anatomy lists the expected screen regions. It should read like a build checklist:
header, metrics, filters, primary table, detail/evidence panel, actions, and
state surfaces.

### Blocks

Blocks list the stable Afenda components that should compose the screen. The
screen pattern can require blocks, but it must not move route state, persistence,
or authorization policy into the design system.

### States

Every ERP screen must explicitly handle:

- `ready`
- `filtered-empty`
- `loading`
- `partial`
- `error`
- `forbidden`
- `readonly`

Add `first-use`, `conflict`, or `offline` when the workflow can enter those
states.

### Gates

Screen patterns use gates to show how much release evidence is required:

- `typecheck`
- `storybook`
- `accessibility`
- `visual-baseline`
- `overflow`
- `diagnostics`
- `audit-payload`

Screens with governed actions require diagnostics and audit payload coverage.

## Reference Composition

Approval operations is the reference screen for governed ERP composition:

1. `PageHeader`: tenant, period, policy scope, status, and primary governed action.
2. `StatsStrip`: SLA risk, ready-to-post count, failed sync count, and audit pressure.
3. `FilterBar`: tenant, owner, SLA, risk, and search filters with visible active filters.
4. `ApprovalQueueBlock` or `AdvancedDataTable`: dense rows, selection, row status, and pagination.
5. `RiskEvidencePanel`: selected-row evidence, policy reason, missing artifacts, and audit facts.
6. `PermissionActionToolbar`: approve, reject, return, delegate, and request-access actions with disabled reasons.

Required states:

- `ready`: render queue, evidence, filters, and available actions.
- `filtered-empty`: keep filters visible and render a bounded empty state.
- `loading`: preserve shell dimensions and avoid table width shift.
- `partial`: render successful sources while marking failed or stale sources inline.
- `forbidden`: keep governed actions visible when policy allows, disabled with exact reason.
- `readonly`: render evidence and history; disable mutating actions.
- `conflict`: preserve selected row and decision notes until the conflict is resolved.

Quality evidence:

```bash
pnpm --filter @repo/design-system typecheck
pnpm --filter @repo/design-system test -- metadata-renderer.test.tsx
pnpm --filter storybook typecheck
pnpm design-system:stabilize
```

Run `pnpm blocks:quality` only with Storybook already running. That gate covers
interaction, accessibility, Chromatic visual baseline, and overflow checks.

## Pattern Rules

### Approval Operations

Use a split-pane screen: queue on one side, evidence on the other. Keep denied
actions visible with exact disabled reasons. Do not replace row evidence with a
summary chart.

### Batch Posting

Use dense table, validation summary, selected count, failed row evidence, and
reversible actions. If a toolbar bulk selector is present, do not rely on
integrated table select-all as the primary selection control.

### Tenant Master-Detail

Use a stable primary table and detail panel. Selection changes must not discard
dirty edits, conflict warnings, offline changes, or autosave state.

### Audit Evidence Review

Use immutable event rows, source filters, selected event evidence, and partial
source handling. Toasts and transient UI are not audit records.

### Policy Lock Administration

Keep locked actions visible but disabled unless policy requires hiding the whole
scope. Unlock, override, and request-access actions require reason and audit
scope.

### Reconciliation Workspace

Show source freshness, variance metrics, matched/unmatched rows, and selected
variance evidence. One failed feed must not blank successful sources.

### Exception Triage

Make owner, severity, due time, policy, and resolution reason scannable. Waive,
approve, assign, and close actions require evidence and audit payloads.

### Long-Running Job Monitor

Show phase, progress, last event, timeline, retry/cancel rules, and affected
records. Do not use spinner-only job states.

## Common Pitfalls

- Building a landing page when users need an operational workspace.
- Hiding filters or selected counts in dense tables.
- Showing a full-page empty state while still rendering irrelevant toolbars.
- Replacing evidence with decorative chart clutter.
- Moving business policy or database writes into the design system.
- Treating partial data failure as a full-screen failure.
- Forgetting narrow viewport overflow checks for split-pane and table screens.

## Related Docs

- [`pattern-library.md`](./pattern-library.md)
- [`contribution-lifecycle.md`](./contribution-lifecycle.md)
- [`component-scorecards.md`](./component-scorecards.md)
- [`block-authoring.md`](./block-authoring.md)
