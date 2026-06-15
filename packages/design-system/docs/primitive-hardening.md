# Afenda Primitive Hardening

Afenda primitives are the shared shadcn/Radix building blocks that must be stable before release.

## Readiness Rule

Primitive readiness is a release gate. Shared primitives must pass the readiness report before they ship in product surfaces.

## Required State Matrix

Every primitive must account for:

- default
- hover
- focus-visible
- active or pressed
- disabled
- invalid
- selected, open, or checked
- loading when applicable
- reduced motion

## Risk Groups

Forms: input, textarea, select, checkbox, radio group, switch, slider, input group, input OTP, field, and form.

Overlays and menus: dialog, sheet, drawer, popover, hover card, tooltip, dropdown menu, context menu, menubar, and command.

Navigation and data: tabs, navigation menu, breadcrumb, pagination, sidebar, table, accordion, and collapsible.

Display and feedback: alert, badge, card, empty, progress, skeleton, spinner, sonner, avatar, chart, carousel, resizable, and scroll area.

## Token Policy

Operational primitives use semantic surface, text, border, brand, and status tokens only.

Warmth tokens are forbidden in primitives unless a primitive is explicitly demonstrating low-frequency expression. Dense ERP surfaces, tables, forms, audit logs, menus, and dashboards must not use warmth tokens.

## Motion Policy

Afenda is a low-motion operator workspace. Primitives must not use `transition-all` or transitions on layout properties such as width, height, top, left, margin, or padding.

Reduced motion must preserve state clarity without decorative movement.

## Source Of Truth

- State and risk-group expectations: `contracts/primitive-hardening.contract.ts`
- Primitive implementation surface: `components/afenda-ui`
- Primitive public barrel: `components/afenda-ui/index.ts`
- Release readiness evidence: `apps/storybook/stories/primitive-readiness.stories.tsx`
- Component-level readiness records: `contracts/component-scorecards.contract.ts`

## Validation

Run these checks before changing primitive status or declaring a primitive ready:

```bash
pnpm design-system:primitive-readiness
pnpm ui-craft:detect
pnpm --filter @repo/design-system typecheck
pnpm --filter storybook typecheck
```

`pnpm design-system:stabilize` runs the primitive readiness, UI craft,
typecheck, and Storybook typecheck gates together.

Primitive changes that add, rename, or remove an `afenda-ui` component must also
update the scorecard contract and matching Storybook story in the same change.
