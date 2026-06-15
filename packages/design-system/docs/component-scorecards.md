# Component Scorecards

Component scorecards are the release-readiness record for Afenda primitives and
blocks. They live in `contracts/component-scorecards.contract.ts` and are
published through `@repo/design-system/contracts/component-scorecards`.

Scorecards are governance data. They do not change runtime behavior and should
not be passed as component props.

## Required Fields

Each primitive and block scorecard must record:

- `statesCovered`: visible states covered by implementation, story, or test.
- `keyboardSupport`: `covered`, `manual`, or `not-applicable`.
- `a11yLabels`: label and accessible-name readiness.
- `reducedMotion`: motion-reduction readiness for transitions and animated UI.
- `densityFit`: how the component fits compact ERP surfaces.
- `overflowBehavior`: the intended constrained-width behavior.
- `visualBaselineStory`: Storybook family used as the visual baseline.
- `owner`: accountable package or block platform owner.
- `status`: `ready`, `watch`, or `needs-work`.

## Status Policy

Use `ready` when the component is suitable for app-team use and covered by the
release gates.

Use `watch` when the component is usable but has a tracked risk, such as manual
motion review, complex focus behavior, or constrained-width risk.

Use `needs-work` when app teams should avoid adoption until the listed gap is
closed. A `needs-work` scorecard should be paired with a follow-up issue or
implementation task before release freeze is accepted.

## Watch Review Rule

`watch` is allowed only when the component is usable and the risk is explicitly
owned. The owner must record the reason, next review trigger, and expected path
to `ready` in the release note, issue, or pull request that introduced the
scorecard state.

`needs-work` is stronger than `watch`: it requires an issue, release blocker, or
documented app-team migration path before the component can be promoted.

## Maintenance Rule

Adding a primitive or exported block component requires adding the scorecard in
the same change. Removing or renaming a scorecard is a breaking governance
change unless the migration guide documents the compatibility path.

The scorecard contract is validated by `component-scorecards.test.ts` and shown
in Storybook under `Blocks/Quality Gates/Component Scorecards`.
