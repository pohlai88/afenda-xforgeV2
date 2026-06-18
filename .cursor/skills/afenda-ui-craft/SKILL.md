---
name: afenda-ui-craft
description: >-
  afenda-Xforge UI craft — composition, polish, and anti-slop for afenda-xforge surfaces.
  Wraps ui-craft with local layer order and design-system governance. Use when
  building or refining app UI, Storybook, or @repo/design-system surfaces.
  Prefer ui-craft-dense-dashboard for dashboard and admin work.
disable-model-invocation: true
---

# afenda-Xforge UI Craft

Merged guidance from **ui-craft** (`.cursor/skills/ui-craft/`), scoped to this afenda-xforge monorepo.

## How to invoke in Cursor

Cursor reads project skills from **`.cursor/skills/`** only.

| Goal | Invoke |
|------|--------|
| Build a full surface (dashboard, landing, auth) | `@craft` or ask: "use craft skill to build a dashboard" |
| Wireframe before code | `@shape` |
| Polish / review / tokens / finalize | `@polish`, `@heuristic`, `@tokens`, `@finalize` |
| Local UI work | `@afenda-ui-craft` first, then `@craft` or `@ui-craft-dense-dashboard` |

## When to apply

- Building or polishing UI in `apps/app`, `apps/storybook`
- Dashboard, admin, or data-dense SaaS surfaces
- Pre-ship UI review on app-layer changes

## Read order (authority)

1. **Design system** — `packages/design-system/` (`styles/globals.css`, `components/ui/`)
2. **CSS + tokens** — `.cursor/skills/afenda-css-tailwind-stylelint/SKILL.md`
3. **Layer rules** — `.cursor/rules/agent-discipline.mdc` (app → Storybook → design-system)
4. **ui-craft** — `.cursor/skills/ui-craft/SKILL.md` for composition, motion, polish, heuristics

ui-craft **must not** override shared shadcn primitives without human approval.

## Layer boundaries

| Layer | Path | ui-craft OK? |
|-------|------|--------------|
| App wiring | `apps/app/` | Yes — primary target |
| Storybook | `apps/storybook/` | Yes |
| Design-system primitives | `packages/design-system/components/ui/` | **No** — hook asks first |
| Design-system tokens | `packages/design-system/styles/globals.css` | Ask before broad token changes |

Fix visual issues at the **lowest allowed layer** before touching shared primitives.

## Variant selection

| Surface | Skill |
|---------|-------|
| Dashboard, admin, analytics | `.cursor/skills/ui-craft-dense-dashboard/SKILL.md` |
| Marketing / editorial landing | `.cursor/skills/ui-craft-editorial/SKILL.md` |
| Minimal auth or settings | `.cursor/skills/ui-craft-minimal/SKILL.md` |
| General UI | `.cursor/skills/ui-craft/SKILL.md` |

## Token and theme rules

- Use semantic tokens from `globals.css` (`bg-primary`, `text-muted-foreground`) — not ad-hoc hex
- `next-themes` via `@repo/design-system` provider for dark mode
- Add shadcn components: `npx shadcn@latest add [component] -c packages/design-system`

## Verification gates

After UI changes touching `apps/app`:

```bash
pnpm --filter app typecheck
pnpm check
```

After design-system changes:

```bash
pnpm --filter @repo/design-system typecheck
pnpm --filter storybook typecheck
```

## Source skills

| Skill | Path | Focus |
|-------|------|-------|
| ui-craft | `.cursor/skills/ui-craft/` | Anti-slop, discovery, polish, recipes |
| craft | `.cursor/skills/craft/` | One-shot dashboard / landing / auth builds |
| ui-craft-dense-dashboard | `.cursor/skills/ui-craft-dense-dashboard/` | Admin / data-dense defaults |
| afenda-css-tailwind-stylelint | `.cursor/skills/afenda-css-tailwind-stylelint/` | Tailwind v4, tokens |
| xforge-nextjs-vercel | `.cursor/skills/xforge-nextjs-vercel/` | Next.js 16+ app patterns |
