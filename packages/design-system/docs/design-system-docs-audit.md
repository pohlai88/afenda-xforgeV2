# Design System Docs Audit

Audit date: 2026-06-15
Revision date: 2026-06-15

Audience: design-system maintainers, app teams, and domain teams deciding how to
use or extend the Afenda design system.

## Scoring Model

Each document is scored on five dimensions. The maximum score is 100.

| Dimension | Weight | Question |
|-----------|--------|----------|
| Coverage | 25 | Does the doc cover the active contracts, exports, stories, and gates it claims to cover? |
| Accuracy | 25 | Does the doc match the current codebase and avoid stale paths or legacy surfaces? |
| Actionability | 20 | Can a reader make the next correct implementation or governance decision from it? |
| Traceability | 15 | Does the doc point to source contracts, tests, Storybook evidence, or commands? |
| Maintainability | 15 | Is ownership, update trigger, migration impact, or drift protection clear? |

Score bands:

- 90-100: Release-ready.
- 80-89: Strong, with targeted gaps.
- 70-79: Useful, but needs hardening before broad app-team reliance.
- Below 70: At risk of drift or misapplication.

## Summary Score

Overall docs health: 93 / 100.

The design-system docs are release-ready for app-team use. The hardening pass
added role-based navigation, source-of-truth sections, validation commands,
Storybook evidence mapping, and concrete promotion/API rules.

## Document Scores

| Document | Coverage | Accuracy | Actionability | Traceability | Maintainability | Score | Priority |
|----------|----------|----------|---------------|--------------|-----------------|-------|----------|
| `README.md` | 24 | 24 | 19 | 14 | 14 | 95 | Complete |
| `block-authoring.md` | 23 | 23 | 18 | 12 | 12 | 88 | Monitor |
| `block-governance.md` | 23 | 24 | 18 | 14 | 14 | 93 | Complete |
| `block-migration-guide.md` | 23 | 24 | 19 | 14 | 14 | 94 | Complete |
| `component-scorecards.md` | 22 | 24 | 18 | 14 | 14 | 92 | Complete |
| `contribution-lifecycle.md` | 23 | 24 | 19 | 14 | 14 | 94 | Complete |
| `enterprise-screen-patterns.md` | 24 | 24 | 20 | 14 | 13 | 95 | Complete |
| `pattern-library.md` | 22 | 24 | 18 | 13 | 12 | 89 | Monitor |
| `primitive-hardening.md` | 22 | 24 | 18 | 14 | 13 | 91 | Complete |
| `mindful-operator.md` | 22 | 24 | 18 | 14 | 13 | 91 | Complete |

## Findings

### Complete: Docs Entry Point

`README.md` now provides role-based read paths, stable import paths, and a
Storybook evidence matrix.

### Complete: Primitive And Color Traceability

`primitive-hardening.md` and `mindful-operator.md` define important rules, but
they do not point clearly enough to their validating artifacts.

Current source artifacts:

- `contracts/primitive-hardening.contract.ts`
- `contracts/color.contract.ts`
- `tokens/tokens.json`
- `tokens/tokens.schema.json`
- `scripts/check-primitive-readiness.mjs`
- `scripts/check-ui-craft.mjs`
- `scripts/report-token-diff.mjs`
- `token-design-data.test.ts`

`primitive-hardening.md` and `mindful-operator.md` now include source-of-truth
and validation sections tied to contracts, tests, scripts, and token files.

### Complete: Enterprise Screen Builder Example

`enterprise-screen-patterns.md` gives good screen-level guidance, but it remains
mostly prose. It should add one compact metadata or block-composition skeleton
for the highest-value screen, likely approval operations or batch posting.

Impact: app teams know the rules but still need to infer implementation shape.

`enterprise-screen-patterns.md` now includes an approval operations reference
composition with block order, required states, and quality gates.

### Complete: Storybook Evidence Matrix

Several docs mention Storybook evidence, but there is no table mapping docs to
their governance stories.

Current governance stories:

- `Blocks/Quality Gates/Afenda Pattern Library`
- `Blocks/Quality Gates/Component Scorecards`
- `Blocks/Quality Gates/Contribution Lifecycle`
- `Blocks/Quality Gates/Enterprise Screen Patterns`
- `Blocks/Quality Gates`
- `Blocks/Block Readiness`
- `Blocks/Storybook Coverage`

`README.md` now maps governance docs to their Storybook evidence stories.

### Complete: Public API Checklist

The stable import path is documented in `block-authoring.md` and compatibility
rules live in `block-migration-guide.md`. This is accurate, but release reviewers
need one consolidated public API checklist.

`block-migration-guide.md` now includes a public API checklist.

### Complete: Promotion Evidence Thresholds

The lifecycle correctly defines core, extended, app-local, and out-of-scope.
Promotion from extended to core is still qualitative.

`contribution-lifecycle.md` now defines promotion requirements from extended to
core.

### Complete: Scorecard Watch Handling

`component-scorecards.md` defines `watch`, but does not specify review cadence or
who clears it.

`component-scorecards.md` now defines the watch review rule and needs-work
handling.

## Improvement Backlog

1. Add a docs audit script that verifies doc-to-contract/story/test links.
2. Add compact before/after migration examples when the first post-freeze breaking change appears.
3. Add one app-owned example showing how enterprise screen patterns stay separate from persistence and routing.

## Suggested Next Quality Gate

Add a docs audit script when this report becomes a release gate. Minimum checks:

- Every doc listed in `block-governance.md` exists.
- Every contract mentioned by a doc exists.
- Every governance doc has a Storybook evidence story or explicit reason why not.
- Every command in docs maps to a package script.
- No doc references removed compatibility wrappers or legacy import paths.

## Current Decision

Docs are release-ready for current app-team block/platform use. The remaining
opportunity is automation: convert the scoring model into a script that checks
doc links, commands, contract references, and Storybook evidence.
