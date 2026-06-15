# Storybook (`apps/storybook`)

Design-system workshop for `@repo/design-system` — **Vite + React**, port **6006**.

## Commands

```bash
pnpm --filter storybook dev              # local workshop
pnpm --filter storybook build            # static export → storybook-static/
pnpm --filter storybook check              # typecheck + static build
pnpm --filter storybook typecheck
pnpm --filter storybook test-storybook:interaction   # narrow play lane
pnpm --filter storybook clean            # remove build output + caches
```

## Docs

| Doc | Purpose |
| --- | --- |
| [`.storybook/ECOSYSTEM.md`](./.storybook/ECOSYSTEM.md) | Stack, Vite aliases, performance knobs |
| [`.storybook/TESTING.md`](./.storybook/TESTING.md) | Test lanes, MCP debugging, failure patterns |
| [`.storybook/TAGS.md`](./.storybook/TAGS.md) | Story tags and filters |

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `STORYBOOK_URL` | `http://127.0.0.1:6006` | test-runner / CI target |
| `STORYBOOK_DISABLE_MCP=1` | unset | Omit MCP addon (set automatically on `build`) |

Cursor MCP: `"storybook": { "url": "http://127.0.0.1:6006/mcp" }` in `.cursor/mcp.json`.
