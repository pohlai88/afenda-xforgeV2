# Afenda Pattern Library

Afenda patterns are app-team rules for composing blocks into governed ERP workflows. They do not introduce new component families. A pattern defines when to use an existing composition, which blocks it normally requires, which unhappy states must be handled, and what audit/evidence rules cannot be skipped.

The typed source of truth lives in `packages/design-system/contracts/pattern-library.contract.ts` and is exported from `@repo/design-system/contracts/pattern-library`.

## Pattern Rules

- Use existing foundation, operator, advanced, workflow, and metadata blocks before creating app-local UI.
- Keep business routing, persistence, permissions, and domain policy in the app layer.
- Every mutating pattern needs a visible disabled state, reason text, permission/capability metadata, and audit scope.
- Every data-heavy pattern must handle loading, empty, error, forbidden or readonly, and at least one recovery path.
- Partial data must remain useful. Do not blank a workspace because one source failed.
- Dense ERP screens should prioritize compact tables, evidence rows, status dots, and clear action state over decorative charts.

## Pattern Catalog

| Pattern | Use when | Critical rules |
| --- | --- | --- |
| Approval review | An operator must approve, reject, return, or inspect a governed decision. | Show evidence and policy context next to the decision; denied actions stay visible with reasons. |
| Batch posting | Many records are validated and committed as a batch. | Disable posting until validation, evidence, locks, and stale data are resolved. |
| Master-detail / primary-detail | Operators scan a list and inspect one selected record repeatedly. | Selection changes must not discard dirty edits, conflicts, or offline queues. |
| Audit log viewer | Users need to know what happened, who did it, and why it was allowed. | Audit rows are immutable and chronological; toast is never the audit record. |
| Exception handling | Policy permits an override but requires explanation and traceability. | Resolution actions require reason, owner, and evidence completeness. |
| Bulk selection | A repeated governed action applies to multiple rows. | Show selected count, confirmation state, audit scope, and undo window. |
| Data reconciliation | Records must be matched across systems. | Render partial success and per-source failure inline. |
| Policy lock / unlock | Policy intentionally blocks changes until requirements are met. | Locked actions remain visible and disabled unless the policy requires hiding. |
| Long-running job state | A background operation may outlive the current interaction. | Show phase, progress, retry/cancel rules, and committed/reversible status. |

## Authoring Checklist

Before shipping a page that uses one of these patterns:

- Confirm the pattern id in `afendaPatternLibrary`.
- Use the listed block families unless there is a documented app-specific reason.
- Cover the required states in Storybook or app tests.
- Verify governed actions normalize permission, capability, audit event, audit scope, reason, and disabled state.
- Include a narrow viewport story when the pattern uses tables, toolbars, or primary-detail layouts.
- Run `pnpm design-system:stabilize`; run `pnpm blocks:quality` only when Storybook is already running.
