# Afenda Design System Docs

This folder is the app-team and maintainer guide for the Afenda design system.
The code source of truth stays in `packages/design-system`; these docs explain
how to choose the right layer, prove quality, and avoid moving app-owned
business behavior into shared UI.

## Read Paths

### App Team Building An ERP Screen

1. Start with [`contribution-lifecycle.md`](./contribution-lifecycle.md) to
   confirm the work is core, extended, app-local, or out-of-scope.
2. Use [`enterprise-screen-patterns.md`](./enterprise-screen-patterns.md) to
   choose the screen assembly pattern.
3. Use [`pattern-library.md`](./pattern-library.md) for workflow-specific
   evidence, audit, and unhappy-state rules.
4. Use [`block-authoring.md`](./block-authoring.md) to select blocks and quality
   gates.

### Maintainer Adding Or Changing A Primitive

1. Read [`primitive-hardening.md`](./primitive-hardening.md).
2. Check [`mindful-operator.md`](./mindful-operator.md) before changing tokens,
   status color, focus, hover, or dense ERP visual states.
3. Update [`component-scorecards.md`](./component-scorecards.md) and the typed
   scorecard contract when the primitive surface changes.
4. Run `pnpm design-system:stabilize`.

### Maintainer Adding A Block Or Metadata Field

1. Read [`block-governance.md`](./block-governance.md).
2. Follow [`block-authoring.md`](./block-authoring.md).
3. Add compatibility notes to [`block-migration-guide.md`](./block-migration-guide.md)
   for any non-additive change.
4. Add tests and Storybook evidence before treating the export as stable.

### Domain Team Proposing A Reusable Pattern

1. Classify the proposal with [`contribution-lifecycle.md`](./contribution-lifecycle.md).
2. Add or update pattern guidance in [`pattern-library.md`](./pattern-library.md)
   only when the pattern is reusable across more than one surface.
3. Keep routing, persistence, permissions, and policy calculation app-owned.

### Release Reviewer

1. Review [`design-system-docs-audit.md`](./design-system-docs-audit.md).
2. Confirm [`block-migration-guide.md`](./block-migration-guide.md) reflects
   any compatibility impact.
3. Run the static gates in [`block-authoring.md`](./block-authoring.md).
4. Run `pnpm blocks:quality` only when Storybook is already running at
   `http://127.0.0.1:6006`.

## Storybook Evidence Matrix

| Evidence | Storybook title | Related doc |
|----------|-----------------|-------------|
| Block quality gates | `Blocks/Quality Gates` | [`block-authoring.md`](./block-authoring.md) |
| Block readiness | `Blocks/Block Readiness` | [`block-governance.md`](./block-governance.md) |
| Storybook coverage | `Blocks/Storybook Coverage` | [`block-migration-guide.md`](./block-migration-guide.md) |
| Pattern library | `Blocks/Quality Gates/Afenda Pattern Library` | [`pattern-library.md`](./pattern-library.md) |
| Enterprise screens | `Blocks/Quality Gates/Enterprise Screen Patterns` | [`enterprise-screen-patterns.md`](./enterprise-screen-patterns.md) |
| Component scorecards | `Blocks/Quality Gates/Component Scorecards` | [`component-scorecards.md`](./component-scorecards.md) |
| Contribution lifecycle | `Blocks/Quality Gates/Contribution Lifecycle` | [`contribution-lifecycle.md`](./contribution-lifecycle.md) |

## Stable Contract Imports

Use these public imports from apps and domain packages:

- `@repo/design-system/components/afenda-ui`
- `@repo/design-system/components/blocks`
- `@repo/design-system/contracts/component-scorecards`
- `@repo/design-system/contracts/contribution-lifecycle`
- `@repo/design-system/contracts/enterprise-screen-patterns`
- `@repo/design-system/contracts/pattern-library`

Do not deep-import internal implementation modules unless the package barrel
explicitly documents them as public.

## Internal Shadcn Scaffold

`packages/design-system/components/ui` is protected internal shadcn generator scaffold.
It stays in the repo so `npx shadcn@latest add [component] -c
packages/design-system` can update upstream primitives predictably.

App teams must not import `@repo/design-system/components/ui`. Use
`@repo/design-system/components/afenda-ui` for primitives and
`@repo/design-system/components/blocks` for ERP blocks. The import-boundary gate
enforces this outside the design-system package.
