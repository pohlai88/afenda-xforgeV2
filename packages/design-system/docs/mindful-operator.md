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
- `critical`
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

## Source Of Truth

- Token values and metadata: `tokens/tokens.json`
- Token schema: `tokens/tokens.schema.json`
- Token contract: `contracts/afenda-token.contract.ts`
- Variant contract: `contracts/afenda-variant.contract.ts`
- Global CSS variables: `styles/globals.css`
- Token design-data tests: `test/token-design-data.test.ts`

## Validation

Run these checks before changing palette roles, token metadata, or semantic
status mappings:

```bash
pnpm design-system:token-diff
pnpm ui-craft:detect
pnpm --filter @repo/design-system test -- token-design-data.test.ts
```

`pnpm design-system:stabilize` is the fast local pass for token metadata, CSS
variable coverage, primitive readiness, and UI craft drift. Run
`pnpm design-system:governance` before merge or release.

Any new token category must include category metadata, usage constraints,
deprecation handling, and Figma variable mapping before release.
