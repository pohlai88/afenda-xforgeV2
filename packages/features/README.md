# Afenda Features

Governed product capabilities that ship as **add-on packages** under `packages/features/add-ons/`.

## Add-on contract

| Rule | Detail |
|------|--------|
| Import name | `@repo/<add-on-slug>` (e.g. `@repo/orbit-case`) |
| Tenancy | All persisted data scoped by `organizationId` |
| Server boundary | Business logic in the add-on package; `apps/app` owns routes + thin Server Actions |
| UI layering | App compose first → Storybook → design-system blocks (ask before editing primitives) |
| Phases | Each add-on documents Phase 1–N in `docs/REQUIREMENTS.md` with enterprise DoD |
| Push / morph | Human-initiated only; governed registry; no auto-routing or AI-generated ERP records |

## Workspace layout

```
packages/features/
  README.md           # this file
  add-ons/
    README.md         # catalog index
    <slug>/           # @repo/<slug> package (pnpm workspace member)
```

## Registering a new add-on

1. Create `packages/features/add-ons/<slug>/` with `package.json` (`name: @repo/<slug>`, `"tags": ["library"]` in `turbo.json`).
2. Ensure `pnpm-workspace.yaml` includes `packages/features/add-ons/*`.
3. Add `workspace:*` dependency in consuming apps (typically `apps/app`).
4. Add architecture + requirements docs under `docs/`.
5. Extend `@repo/database` schema + RLS migration when persistence is required.

## Catalog

See [add-ons/README.md](./add-ons/README.md).
