# Afenda Mindful Operator

Afenda uses a mindful operator palette, not a wellness palette.

## Doctrine

Quiet Interfaces, Loud Decisions.

Neutrals do the work. Brand creates memory. Status creates decisions. Warmth creates humanity.

Color communicates meaning, not decoration. Typography carries hierarchy. Spacing carries structure. Brand colors identify Afenda. Semantic colors identify operational decisions.

## Palette Roles

Foundation tokens carry most screen time:

- `canvas` is the application background.
- `raised` is the default panel and card surface.
- `surface` is a muted foundation surface.
- `ink`, `muted`, and `line` carry text and structure.

Neutral interaction roles follow a Geist-inspired state ladder:

- `surfaceHover` is the default quiet hover surface.
- `surfaceActive` is the selected, pressed, or open surface.
- `borderHover` is the stronger structural hover border.
- `borderActive` is the active/focus border.

Components should use these semantic state roles before reaching for opacity-modified surface classes.

Brand tokens identify Afenda and true primary intent:

- `brandPrimary`
- `brandDark`
- `brandSoft`

Status tokens communicate operational state only:

- `info`
- `warning`
- `danger`
- `success`

Warning amber is preserved as a palette and fill token. Operational warning text uses an accessible warning foreground so contrast gates stay strict.

Warmth tokens are brand-expression tokens, not operational UI tokens:

- `bark`
- `doe`
- `pink`

## Usage Rules

Warmth tokens are allowed in onboarding, empty states, welcome surfaces, marketing, and illustration.

Warmth tokens are forbidden in data tables, admin forms, audit logs, approval queues, dashboard status, dense dashboards, and admin CRUD flows.

Brand primary is not the default action color everywhere. Repeated operator actions such as Save, Continue, Open, View, and Edit may stay neutral. Use brand primary for main CTA, active navigation, command center, Nexus, logo identity, setup completion, and true primary intent.

Brand green and success green must never be aliased. Afenda identity and healthy/completed/passed states are separate meanings.

`packages/design-system/tokens/tokens.json` is the source of truth for design tokens.
