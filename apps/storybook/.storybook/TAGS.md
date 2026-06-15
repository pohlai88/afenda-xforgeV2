# Storybook Tags

Storybook tags govern visibility, documentation, manifests, and test scope.

## Defaults

- `dev`: implicit. Story appears in the sidebar.
- `manifest`: implicit. Story is available to Storybook MCP manifests.
- `test`: implicit. Story runs in Storybook test runner.
- `autodocs`: global. Every story gets docs unless explicitly removed.

## Afenda Tags

- `afenda-ui`: primitives from `packages/design-system/components/afenda-ui`.
- `primitive`: low-level reusable UI primitives.
- `block`: governed block-layer composition.
- `visual-audit`: visual inspection stories that should stay visible but are not production examples.
- `experimental`: hidden from the sidebar filter by default.
- `deprecated`: hidden from the sidebar filter by default.
- `internal`: hidden from the sidebar filter by default.

## Recipes

Docs-only story:

```ts
tags: ["!dev", "autodocs"]
```

Visual combo story that should not run in tests:

```ts
tags: ["!test"]
```

Test-only variant that should not clutter the sidebar or docs:

```ts
tags: ["!dev", "!autodocs"]
```

Experimental story:

```ts
tags: ["experimental"]
```

Do not remove `manifest` unless the story is misleading for agents. Storybook MCP depends on manifests for component and documentation retrieval.
