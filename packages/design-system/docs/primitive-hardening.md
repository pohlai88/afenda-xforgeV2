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
