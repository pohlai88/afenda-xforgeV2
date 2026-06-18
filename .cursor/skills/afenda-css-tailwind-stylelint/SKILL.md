---
name: afenda-css-tailwind-stylelint
description: >-
  afenda-Xforge CSS — Tailwind v4, design tokens, utility-first styling for
  @repo/design-system. Use when editing CSS, globals.css, @theme/@utility/@source,
  design tokens, or component styles in apps/app and Storybook.
---

# afenda-Xforge CSS + Tailwind v4

Scoped to the afenda-xforge monorepo (`packages/design-system`, `apps/app`, `apps/storybook`).

## When to apply

- Editing `packages/design-system/styles/**/*.css` or app `styles.css`
- Adding design tokens, `@utility`, `@theme inline`, or `@source` scopes
- Choosing utilities vs custom CSS in components
- Fixing Tailwind v3 regressions (`@tailwind`, `tailwind.config.js`, `hsl(var(--*))`)

## Architecture

1. **`:root` / `.dark`** at stylesheet root — semantic CSS variables
2. **`@theme inline`** maps tokens to Tailwind utilities via `var(--token)`
3. **`@layer base`** applies semantic defaults
4. Apps import design-system styles — do not duplicate `@import "tailwindcss"`

Canonical entry: `packages/design-system/styles/globals.css`

App entry: `apps/app/app/styles.css` (imports design-system globals)

## Tailwind v4 rules (reject v3)

| v3 (ban) | v4 (use) |
|----------|----------|
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` theme.extend | `@theme` / `@theme inline` in CSS |
| `@layer utilities { .foo {} }` for new utilities | `@utility foo { ... }` |
| `hsl(var(--primary))` | `var(--primary)` or `bg-primary` utility |
| `rgb()`, hex in token sources | CSS variables + semantic utilities |

## Utility-first

Prefer composing Tailwind utilities in TSX over bespoke CSS.

**Do:**

- Parent `gap-*` instead of child margin chains
- Semantic utilities (`bg-background`, `text-muted-foreground`) from tokens
- `cn()` from `@repo/design-system/lib/utils` for `className` composition

**Avoid:**

- Arbitrary hex/rgb in TSX when a token utility exists
- Duplicating token definitions in app-level CSS

## shadcn workflow

```bash
npx shadcn@latest add [component] -c packages/design-system
pnpm bump-ui    # update all components from registry
```

## Verification

```bash
pnpm --filter @repo/design-system typecheck
pnpm check      # Ultracite (Biome) — repo-wide
pnpm --filter app typecheck
```

## Fix workflow

1. Fix at token source (`globals.css` `:root` / `.dark`) if color-related
2. Map through `@theme inline` if utility missing
3. Use `@utility` for reusable non-token patterns
4. Re-run `pnpm check`
