#!/usr/bin/env node
/**
 * preToolUse — agent-discipline.mdc: human-owned design-system primitives.
 */
import { emit, log, parseStdinJson } from "./_hook-utils.mjs";

const TAG = "guard-workspace-compose";

const DESIGN_SYSTEM_UI =
  /packages[/\\]design-system[/\\]components[/\\]ui[/\\]/i;

const EDIT_TOOLS = new Set([
  "Write",
  "StrReplace",
  "Delete",
  "EditNotebook",
  "ApplyPatch",
]);

function extractPath(input) {
  const toolInput = input.tool_input ?? input.arguments ?? input.input ?? {};

  if (typeof toolInput === "string") {
    return toolInput;
  }

  const candidates = [
    toolInput.path,
    toolInput.file_path,
    toolInput.target_notebook,
    toolInput.notebook_path,
    input.path,
    input.file_path,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.length > 0) {
      return value.replace(/\\/g, "/");
    }
  }

  return "";
}

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; allowing");
  emit({ permission: "allow" });
  process.exit(0);
}

const toolName = input.tool_name ?? input.toolName ?? "";

if (toolName && !EDIT_TOOLS.has(toolName)) {
  emit({ permission: "allow" });
  process.exit(0);
}

const path = extractPath(input);

if (!(path && DESIGN_SYSTEM_UI.test(path))) {
  emit({ permission: "allow" });
  process.exit(0);
}

log(TAG, `flagged edit: ${path}`);

emit({
  permission: "ask",
  user_message: `Edit targets design-system UI primitives (${path}). Core shadcn components are shared — approve only if intentional.`,
  agent_message:
    "Design-system primitives are protected (agent-discipline.mdc). For visual/polish tasks, prefer apps/app wiring or apps/storybook. Ask the human to approve before editing packages/design-system/components/ui/**.",
});

process.exit(0);
