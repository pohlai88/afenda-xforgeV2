# Contribution Lifecycle

Afenda uses a layered contribution lifecycle so app teams know when work belongs
in the design system and when it should stay local. The model is adapted from
GitLab Pajamas' core and extended layer guidance, with Afenda-specific
boundaries for ERP workflows.

Audience: design-system maintainers, app engineers, and domain teams proposing
new primitives, tokens, blocks, or reusable workflow patterns.

## Layer Model

| Layer | Belongs here | Owner | Required evidence |
|-------|--------------|-------|-------------------|
| Core | Primitives, tokens, recipes, stable blocks, metadata schema v1 contracts | Design system | Typed contract, Storybook, scorecard, docs, tests, quality gate, owner, migration note |
| Extended | Reusable ERP patterns that are production-ready but not universal | Domain team | Typed contract, Storybook, docs, tests, owner |
| App-local | Domain-specific workflows, copy, route composition, tenant behavior | App team | Owner and local docs |
| Out-of-scope | Business logic, persistence, routing, authorization policy, backend orchestration | Not design-system | Owner and docs in the owning package |

## Layer Rules

### Core

Use core for elements app teams should choose by default: primitives, tokens,
recipes, stable blocks, metadata contracts, diagnostics contracts, and public
block exports.

Core changes must be additive unless a migration note and compatibility test are
included. Every core component needs a component scorecard.

### Extended

Use extended for reusable ERP patterns that are valuable across more than one
surface but still proving adoption. Extended patterns can be shared through
contracts and Storybook guidance without forcing design-system ownership too
early.

Extended contributions may graduate to core after repeated adoption,
accessibility coverage, stable evidence, and design-system owner acceptance.

Promotion from extended to core requires all of the following:

- Used by at least two app or domain surfaces without local forks.
- Has typed contract coverage when tooling or Storybook consumes the pattern.
- Has Storybook evidence under the release taxonomy.
- Has tests or quality gates covering required states and accessibility risk.
- Has a clear owner accepted by design-system maintainers.
- Has migration guidance for any non-additive public API change.

### App-local

Use app-local for workflow assembly, domain copy, route state, persistence,
permissions, and tenant-specific policy. App-local code may compose core and
extended guidance but must not move business behavior into the design system.

Promote app-local work to extended only when multiple app or domain teams need
the same reusable pattern.

### Out-of-scope

Business logic, database writes, route handlers, authorization engines, policy
calculation, and backend orchestration stay outside the design system.

If the design system needs to support these areas, expose UI states, typed
integration boundaries, diagnostics, or audit payload contracts. Do not embed
the business behavior itself.

## Lifecycle

1. Define: state the gap, duplicate pattern, bug, or workflow pressure.
2. Classify: choose core, extended, app-local, or out-of-scope.
3. Build: implement the smallest scoped change for the selected layer.
4. Document: explain when to use it, when not to use it, and what remains app-owned.
5. Validate: run the relevant tests, typecheck, Storybook, accessibility, visual, overflow, and drift gates.
6. Adopt: confirm teams can use it without forks or hidden assumptions.
7. Promote or retire: graduate, keep proving, deprecate, or remove shared guidance.

## Contribution Decision Checklist

- Is this reusable across multiple domains or only one route?
- Does correctness depend on persistence, routing, permission policy, or tenant state?
- Can the design system own accessibility, density, overflow, and visual baselines?
- Is there a typed contract and Storybook evidence for shared use?
- Does a core change include migration guidance for any non-additive behavior?
- Is the owner explicit after adoption?

## Source Of Truth

Typed lifecycle data lives in
`contracts/contribution-lifecycle.contract.ts` and is exported from
`@repo/design-system/contracts/contribution-lifecycle`.

Storybook governance evidence lives under
`Blocks/Quality Gates/Contribution Lifecycle`.
