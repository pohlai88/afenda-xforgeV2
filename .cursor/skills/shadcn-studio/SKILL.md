---
name: shadcn-studio
description: >-
  shadcn/studio MCP workflow for afenda-Xforge — /cui, /rui, /iui, /ftc block
  generation, toolbar visual editing, and design-system install paths. Use when
  using shadcn/studio MCP, generating blocks, refining UI from studio blocks,
  or running the shadcn/studio toolbar against Storybook or apps.
---

# shadcn/studio (afenda-Xforge)

Authority: `.cursor/rules/shadcn-studio.instructions.mdc` (always-on MCP workflow discipline).

## Repo wiring

| Item | Path / command |
|------|----------------|
| MCP workflow rule | `.cursor/rules/shadcn-studio.instructions.mdc` |
| shadcn CLI + registry MCP | `.cursor/mcp.json` → `shadcn` (`-c packages/design-system`) |
| Studio toolbar config | `shadcn-studio.config.json` |
| shadcn install cwd | `packages/design-system` |
| Toolbar (Storybook) | `pnpm studio:toolbar` → port 3200 → Storybook 6006 |
| Toolbar (app) | `pnpm studio:toolbar:app` → port 3200 → app 3000 |
| Toolbar (web) | `pnpm studio:toolbar:web` → port 3200 → web 3001 |

Start the target dev server **before** the toolbar. Do not start long-running servers unless the user asks.

## MCP servers (two roles)

| Server | Role |
|--------|------|
| `shadcn` (configured) | Registry search, `shadcn add`, audit checklist — `-c packages/design-system` |
| `shadcn-studio-mcp` (upstream) | `/cui`, `/rui`, `/iui`, `/ftc` block workflows — add from [shadcn/studio onboarding](https://shadcnstudio.com/mcp/onboarding) if not enabled |

When `shadcn/studio` MCP is active, follow its step-by-step workflow exactly.

## Workflow discipline (from upstream rule)

### All workflows

- Follow MCP tool sequence in order; no skipping or reordering.
- Complete collection/analysis before install/write phases.
- Continue through the full workflow without unnecessary confirmation when the next step is defined.
- Keep commentary brief between steps.
- Stop only when: MCP needs input, a repo hook blocks action, or the action violates user instructions.

### Commands

| Command | Purpose |
|---------|---------|
| `/cui` | Customize from existing shadcn/studio block — **collect all blocks first, install last**, then customize content |
| `/rui` | Refine or edit an existing block |
| `/iui` | Generate inspired UI (Pro) |
| `/ftc` | Figma design → code (requires Figma MCP) |

### Recovery

If the workflow drifted: stop → identify last completed step → resume from the next required step → finish without unrelated detours.

## Repo compatibility

- `AGENTS.md` and `.cursor/rules/*.mdc` still apply.
- Layer order: `apps/app` → Storybook → `packages/design-system` (`agent-discipline.mdc`).
- Do not edit `packages/design-system/components/ui/` primitives for app-only polish — hook may block.
- Add components: `npx shadcn@latest add [component] -c packages/design-system`
- Use `pnpm` for repo commands.

## Verification after generated UI lands

```bash
pnpm --filter app typecheck          # if apps/app changed
pnpm --filter @repo/design-system typecheck   # if design-system changed
pnpm --filter storybook typecheck    # if stories changed
pnpm check
```

## Refresh upstream rule

```bash
curl --create-dirs -o .cursor/rules/shadcn-studio.instructions.mdc https://cdn.shadcnstudio.com/ss-assets/mcp/instructions/shadcn-studio-cursor-instructions.mdc
```

Validate: local file size 3568 bytes and SHA-256 matches CDN download.
