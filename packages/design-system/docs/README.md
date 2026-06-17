# Afenda Design System Docs

This folder documents the current Afenda design-system authority model.
The only public contract authority is the 12-file `afenda-*` wall in
`packages/design-system/contracts`.

## Read Paths

### AI IDE Contract Wall

1. Read `afenda-design-system.contract.ts` first.
2. Follow the owner contract for the thing being changed: token, recipe,
   component, slot, variant, class-name policy, export, accessibility, motion,
   state, or example.
3. Do not use deleted legacy contracts as migration input or compatibility
   shims.

### Primitive Or Block Change

1. Read [`block-governance.md`](./block-governance.md).
2. Follow [`block-authoring.md`](./block-authoring.md).
3. Check [`mindful-operator.md`](./mindful-operator.md) before changing tokens,
   status color, focus, hover, or dense ERP visual states.
4. Run `pnpm design-system:stabilize` for fast local stabilization, then
   `pnpm design-system:governance` before merge or release.

### Release Reviewer

1. Review [`design-system-docs-audit.md`](./design-system-docs-audit.md).
2. Confirm [`block-migration-guide.md`](./block-migration-guide.md) reflects
   any compatibility impact.
3. Use [`governance.md`](./governance.md) to choose the narrow or repo-wide
   governance gate.
4. Run the static gates in [`block-authoring.md`](./block-authoring.md).

## Storybook Evidence Matrix

| Evidence | Storybook title | Related doc |
|----------|-----------------|-------------|
| Block quality gates | `Blocks/Quality Gates` | [`block-authoring.md`](./block-authoring.md) |
| Block readiness | `Blocks/Block Readiness` | [`block-governance.md`](./block-governance.md) |
| Storybook coverage | `Blocks/Storybook Coverage` | [`block-migration-guide.md`](./block-migration-guide.md) |

## Storybook Example Contract

Storybook has two governed surfaces:

- Workshop stories: `autodocs`, `afenda-ui`, `block`, `foundations`,
  `primitive`, `interaction`, and `snapshot` stories. These are scanned for
  imports, tokens, slots, variants, and drift, but they do not need
  `afendaContractVersion`.
- AI imitation examples: stories tagged `example`, `ai-example`, or
  `copy-paste-example`, or stories with `afendaExample: true` / `aiExample:
  true`. These must declare the current `afendaContractVersion`.

Any story that declares `afendaContractVersion` must match the current contract
version, even if it is not tagged as an example.

## Stable Contract Imports

Use only these public contract imports from apps, packages, examples, and AI
generated code:

- `@repo/design-system/contracts/afenda-design-system`
- `@repo/design-system/contracts/afenda-token`
- `@repo/design-system/contracts/afenda-recipe`
- `@repo/design-system/contracts/afenda-component`
- `@repo/design-system/contracts/afenda-slot`
- `@repo/design-system/contracts/afenda-variant`
- `@repo/design-system/contracts/afenda-class-name-policy`
- `@repo/design-system/contracts/afenda-export`
- `@repo/design-system/contracts/afenda-accessibility`
- `@repo/design-system/contracts/afenda-motion`
- `@repo/design-system/contracts/afenda-state`
- `@repo/design-system/contracts/afenda-example`

Legacy non-`afenda-*` contracts are removed and must not be recreated as aliases.

## Internal Shadcn Scaffold

`packages/design-system/components/ui` is protected internal shadcn generator scaffold.
It stays in the repo so `npx shadcn@latest add [component] -c
packages/design-system` can update upstream primitives predictably.

App teams must not import `@repo/design-system/components/ui`,
`@repo/design-system/components/afenda-ui`, or
`@repo/design-system/components/blocks`. Use
`@repo/design-system/design-system` for app-facing primitives, blocks, recipes,
and helpers. The import-boundary gate enforces this outside the design-system
package.
