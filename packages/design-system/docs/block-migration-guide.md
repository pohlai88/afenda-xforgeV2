# Afenda Block Migration Guide

This guide freezes the Phase 1-9 block platform as a documented stable API. App teams may build on these contracts with the expectation that future changes are additive unless a migration note is added.

## Compatibility Policy

- Metadata schema `version: 1` remains the current stable wire format.
- Public block imports come from `@repo/design-system/components/blocks`.
- Existing exported component names, metadata schemas, diagnostics contracts, fixtures, and quality-gate helpers must not be removed without a migration note.
- New block props, schema fields, diagnostics, and exports should be additive.
- Breaking changes require a migration note, compatibility tests, and updated Storybook examples.
- Public barrels must stay explicit; wildcard exports are not allowed for release-freeze surfaces.
- The Afenda Pattern Library is additive guidance; removing or renaming a pattern id requires a migration note and updated Storybook coverage.

## Public API Checklist

Before changing a public design-system surface, verify:

- App-facing blocks are imported from `@repo/design-system/components/blocks`.
- App-facing primitives are imported from `@repo/design-system/components/afenda-ui`.
- Stable governance contracts are imported from `@repo/design-system/contracts/*`
  package exports, not deep implementation paths.
- `components/blocks/index.ts` keeps explicit exports and does not add wildcard barrels.
- Compatibility tests cover existing fixture metadata, metadata schema v1, and documented stable exports.
- Internal modules such as `metadata-renderer-core.ts`, `metadata-diagnostics.ts`,
  `metadata-binding.ts`, and `state-orchestration.ts` are not documented as app-team deep imports.
- Any removal, rename, or behavior break has a migration note, before/after path, Storybook coverage, and test coverage.

## Phase 1-9 Current Contract

Stable block families:

- Foundation: page header, filter bar, stats strip, empty panel, form section
- Operator: table shell, bulk action bar, entity summary, status timeline, audit trail
- Advanced: advanced data table, command search, approval queue, risk evidence, record editor, operational dashboard shell
- Workflow: approval control, tenant operations, audit evidence, policy locks, batch posting
- Metadata: schema v1, renderer, bindings, layout composition, governed actions, diagnostics
- Quality: typecheck, interaction, accessibility, visual, and overflow gate representation
- Patterns: approval review, batch posting, primary-detail, audit log viewer, exception handling, bulk selection, data reconciliation, policy lock/unlock, and long-running job state

## Metadata v1 Migration Notes

Use `metadataPageSchema` before rendering untrusted metadata.

Stable v1 behavior:

- Unknown block types fail schema validation before render.
- Duplicate `blockId`, metric ids, filter ids, table column ids, and action keys fail validation.
- Missing required bindings render bounded diagnostics instead of throwing.
- Loading, empty, error, forbidden, and stale data source envelopes render deterministic states.
- Stale data renders usable content with diagnostic attributes.
- Layout regions, groups, columns, tabs, visibility, and visible dependencies are schema-validated.
- Hidden governed blocks do not satisfy visible layout dependencies.

## Governed Actions

Action normalization is stable:

- Default `permission`: `blocks.<blockType>.<surface>.<actionKey>`
- Default `capability`: `<blockType>:<surface>:<actionKey>`
- Default `auditEvent`: `<blockType>.<surface>.<actionKey>`
- Default `auditScope`: block id
- Critical actions default `confirmationLabel` to the action label.
- Readonly, forbidden, denied, and disabled states emit visible reasons.

App teams should still provide explicit permission, capability, reason, audit event, and audit scope when actions are tenant or policy sensitive.

## Diagnostics And Audit

Diagnostics are additive. Consumers should ignore unknown diagnostic codes, telemetry event names, and audit event names.

Stable event families:

- `metadata.block.rendered`
- `metadata.action.normalized`
- `metadata.action.disabled`
- `metadata.binding.invalid`
- `metadata.block.denied`
- `metadata.block.hidden`
- `metadata.page.invalid`
- `metadata.state.changed`

## Storybook Taxonomy

Final production groups:

- `Blocks/Foundation`
- `Blocks/Operator`
- `Blocks/Advanced`
- `Blocks/Workflow`
- `Blocks/Metadata Renderer`
- `Blocks/Metadata Schema`
- `Blocks/ERP Metadata Pages`
- `Blocks/Quality Gates`

Governance and coverage groups remain:

- `Blocks/Block Readiness`
- `Blocks/Storybook Coverage`

Do not move production block stories outside this taxonomy without updating the authoring guide and compatibility tests.

## Visual Regression Baseline

Chromatic is the canonical visual regression baseline through:

```bash
pnpm --filter storybook test-storybook:visual
```

The full block gate is:

```bash
pnpm blocks:quality
```

This requires Storybook to already be running at `http://127.0.0.1:6006`.

## Deprecation Process

For a future breaking change:

1. Keep the old field/export working where possible.
2. Add a migration note here with before/after examples.
3. Add or update compatibility tests.
4. Add Storybook coverage for the new path.
5. Remove the old path only after app teams have migrated and the deprecation window is closed.
