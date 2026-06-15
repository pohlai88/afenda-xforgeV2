# Storybook ecosystem (afenda-Xforge)

Design-system workshop at `apps/storybook` (port **6006**). Component stories live under `stories/`; shared config under `.storybook/`.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | **`@storybook/react-vite`** | Vite builder — faster dev HMR, smaller manager/preview vs `@storybook/nextjs` webpack |
| UI source | `@repo/design-system` | Vite aliases + `vite-tsconfig-paths` resolve monorepo `@repo/*` imports |
| Essentials | Storybook 10 **core** | Actions, backgrounds, controls, viewport — `preview.parameters.ts` |
| Addons | a11y, themes, links, Chromatic, MCP | Onboarding removed (mature repo) |
| Testing | test-runner + axe-playwright | Lanes in [TESTING.md](./TESTING.md) |
| MCP | `@storybook/addon-mcp` | Dev/docs/test only — **disabled on `pnpm build`** |

## Commands

```bash
pnpm --filter storybook dev          # local workshop (6006)
pnpm --filter storybook build        # static export (MCP addon omitted)
pnpm --filter storybook clean        # storybook-static, caches, a11y-reports
pnpm --filter storybook check           # typecheck + static build (prebuild clears output)
pnpm --filter storybook typecheck
pnpm --filter storybook test-storybook:interaction   # narrow play lane
```

## Performance / stability knobs

Configured in `.storybook/main.ts` (`viteFinal`):

- **`@repo/*` Vite aliases** — design-system and sibling packages resolve without Next.js
- **`optimizeDeps.include`** — pre-bundles react, lucide-react for snappier cold start
- **`server.fs.allow`** — monorepo root for workspace package reads
- **`server.watch.ignored`** — skips `node_modules`, `.git`, `.turbo` churn
- **Production `manualChunks`** — splits react / react-dom / lucide for cache-friendly static build
- **`core.disableTelemetry`** — less network noise in CI

`vite-shims/server-only.ts` stubs `server-only` imports from design-system boundaries.

`@repo/design-system/lib/utils` keeps `cn()` free of `@repo/observability` so Storybook does not pull Sentry/`next` through every component import.

## MCP workflow

With `pnpm --filter storybook dev` running:

1. **get-storybook-story-instructions** — before editing stories
2. **list-all-documentation** / **get-documentation** — component API
3. **preview-stories** — verify URLs after changes

See [TESTING.md](./TESTING.md) for test lanes and failure patterns.

## Migration note (Next → Vite)

Storybook no longer depends on `next` or `@storybook/nextjs`. The only Next-specific story usage (`next/image` in `aspect-ratio`) was replaced with a plain `<img>`. Production Next.js apps (`apps/app`, `apps/web`) are unchanged.

## Config conventions

- **`.storybook/main.ts` imports** must use explicit `.ts` extensions (Storybook 10 ESM requirement).
- **MDX blocks** — import from `@storybook/addon-docs/blocks` (Storybook 10; there is no standalone `@storybook/blocks` package).
- **Docgen scope** — `tsconfig.docgen.json` includes `@repo/design-system` so Controls/Autodocs prop tables resolve without skip warnings.
- **Client boundaries** — `vite-plugins/strip-use-client.ts` removes `"use client"` from node_modules during Vite transforms.
- **Shared Vite logic** lives in `.storybook/vite.shared.ts`; URL/debug helpers in `.storybook/debug.ts` + `.storybook/constants.ts`.
- **Generated artifacts** — run `pnpm --filter storybook clean` before release builds; outputs are gitignored (`storybook-static/`, `a11y-reports/`, Vite cache).

## Setup checklist (storybook-setup)

| Item | Status |
| --- | --- |
| `@storybook/react-vite` + addons | Done |
| Preview decorators + theme toolbar | `preview.decorators.tsx` |
| Essentials parameters | `preview.parameters.ts` |
| Autodocs (`tags: ['autodocs']`) | `preview.tsx` default tag (SB10 — not `main.ts` docs.autodocs) |
| CSF3 stories | `stories/**/*.stories.tsx` |
| MDX docs page | `stories/Introduction.mdx` |
| a11y addon + test-runner | `.storybook/test-runner.ts` |
| Chromatic | `chromatic.config.json` |
| Static build | `pnpm build` (`prebuild` clears output) |
| CI gate (no dev server) | `pnpm check` + [`.github/workflows/storybook-check.yml`](../../.github/workflows/storybook-check.yml) |
| Test-runner Jest config | `test-runner-jest.config.mjs` |

## File map

| File | Role |
| --- | --- |
| `main.ts` | Addons, framework, tags, Vite hook |
| `vite.shared.ts` | Monorepo aliases, chunking, watch ignores |
| `preview.tsx` | Composes preview modules |
| `preview.parameters.ts` | Backgrounds, controls, viewport, story sort |
| `preview.decorators.tsx` | Theme + Afenda shell |
| `constants.ts` / `debug.ts` | URL helpers for test-runner + MCP |
| `test-runner.ts` | Axe postVisit (Afenda/block lane) |
| `scripts/clean.mjs` | Wipe caches and reports |
