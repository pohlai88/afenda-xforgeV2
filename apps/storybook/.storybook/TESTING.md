# Storybook Testing

Afenda Storybook uses stories as browser-rendered test cases. The testing stack is intentionally split by failure type.

**Stack:** `@storybook/react-vite` + Vite monorepo aliases — see [ECOSYSTEM.md](./ECOSYSTEM.md).

## Test Lanes

| Lane | Purpose | Tool | Command |
| --- | --- | --- | --- |
| Render smoke | Every story must render without runtime errors | `@storybook/test-runner` | `pnpm --filter storybook test-storybook:ci` |
| Interaction | `play` functions validate user behavior | `@storybook/test-runner` + `storybook/test` | `pnpm --filter storybook test-storybook:ci` |
| Accessibility | Axe checks against rendered stories | `@storybook/test-runner` + `axe-playwright` | `pnpm --filter storybook a11y:report` |
| Visual | Screenshot regression and review | Chromatic | `pnpm --filter storybook test-storybook:visual` |
| Coverage | Story coverage signal, not a hard quality target | `@storybook/test-runner --coverage` | `pnpm --filter storybook test-storybook:coverage` |
| Snapshot | Markup snapshot maintenance only when needed | `@storybook/test-runner` | `pnpm --filter storybook test-storybook:snapshots` |

## Local Requirements

The test-runner commands expect Storybook to be running:

```bash
pnpm --filter storybook dev
```

Then run the target lane in another terminal.

## Debugging failures

### 1. Narrow the lane

```bash
pnpm --filter storybook test-storybook:interaction      # play-function stories only
pnpm --filter storybook test-storybook:interaction:watch # iterate on one story
pnpm --filter storybook a11y:report                      # Afenda/block axe lane only
```

Test-runner errors include a **Debug in Storybook** URL with the right addon panel (`interactions` for play failures, `a11y` for axe). Helpers live in `.storybook/debug.ts`.

### 2. Storybook MCP (Cursor)

Requires `pnpm --filter storybook dev` and `"storybook"` in `.cursor/mcp.json`.

| Step | MCP tool | Purpose |
| --- | --- | --- |
| Before editing stories | `get-storybook-story-instructions` | Import paths, `play` patterns, `initialGlobals` |
| Discover IDs | `list-all-documentation` (`withStoryIds: true`) | Story IDs for preview + docs |
| Open failing story | `preview-stories` | Correct preview URLs (always use MCP links, not guessed IDs) |
| Prop / variant lookup | `get-documentation` | Args, variants, first stories |
| One variant deep-dive | `get-documentation-for-story` | Extra docs for a specific export |

**Play-function debugging:** open the story with the **Interactions** panel:

```txt
http://127.0.0.1:6006/?path=/story/<story-id>&addonPanel=storybook/interactions/panel
```

**A11y debugging:** use the **Accessibility** panel (or `.storybook/a11y-reports/<story-id>.json` after `a11y:report`):

```txt
http://127.0.0.1:6006/?path=/story/<story-id>&addonPanel=storybook/a11y/panel
```

**Portaled UI (select, popover, dialog, sheet):** query with `screen` from `storybook/test`, not `canvas`, after opening the overlay. Tag stories with `interaction` and spread `interactionStoryParameters` from `.storybook/essentials.ts`.

### 3. Common failure patterns

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Axe is already running` | addon-a11y + test-runner both scan during `play` | `tags: ["interaction"]` + `interactionStoryParameters`; test-runner skips postVisit axe for that tag |
| Portal content not found | Content renders outside `#storybook-root` | Use `screen.findByRole` / `screen.findByPlaceholderText` after click |
| `Play assumes default args` | Controls persist args in the browser session | Use local `useState` in interaction stories; spread `interactionStoryParameters` |
| `ui/*` color-contrast in CI | Legacy reference stories, not Afenda surface | Expected for `ui/*` smoke; fix in design system or disable a11y on matrix stories |

## Interaction Tests

Use `play` functions for real behavior:

```ts
import { expect } from "storybook/test"

export const OpensDialog = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /open/i }))
    await expect(canvas.getByRole("dialog")).toBeInTheDocument()
  },
} satisfies Story
```

Rules:

- Import test utilities from `storybook/test`.
- Prefer role and label queries.
- Test behavior, not implementation details.
- Tag explicit interaction coverage with `interaction` when useful for filtering.

## Accessibility

`.storybook/test-runner.ts` injects Axe and writes reports to:

```txt
apps/storybook/.storybook/a11y-reports
```

Legacy `ui/*` stories are render-smoke only. Axe reporting is scoped to Afenda/block stories because the old shadcn reference stories are not the governed product surface.

Use story-level opt-out only for justified cases:

```ts
parameters: {
  a11y: {
    disable: true,
  },
}
```

## Visual Tests

Chromatic owns visual regression. Use `visual-audit` for exploratory inspection stories that should stay visible but should not run in CI test-runner scripts.

```ts
tags: ["visual-audit", "!test"]
```

## Snapshot Tests

Snapshot tests are not the primary Afenda UI gate. Use them only when markup stability matters. Prefer render, interaction, accessibility, and visual lanes first.

Update snapshots explicitly:

```bash
pnpm --filter storybook test-storybook:snapshots:update
```

## Tags

- `test`: implicit; included in test-runner.
- `play-fn`: automatic when a story has `play`.
- `interaction`: optional explicit tag for meaningful interaction coverage.
- `snapshot`: optional explicit tag for markup-sensitive stories.
- `visual-audit`: excluded from test-runner scripts.
- `!test`: exclude a story from automated test-runner execution.

## CI Recommendation

Run these in order:

```bash
pnpm --filter storybook typecheck
pnpm --filter storybook build
pnpm --filter storybook test-storybook:ci
pnpm --filter storybook test-storybook:visual
```

Run coverage on scheduled jobs or before major releases:

```bash
pnpm --filter storybook test-storybook:coverage
```
