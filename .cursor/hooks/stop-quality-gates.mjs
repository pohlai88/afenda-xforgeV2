#!/usr/bin/env node
/**
 * stop hook — scoped quality gates from frontend-app, frontend-storybook,
 * frontend-design-system, and nextjs-mcp-quality rules.
 */
import {
  emit,
  log,
  parseStdinJson,
  resolveRepoRoot,
  runShell,
  scopeChanged,
  truncate,
} from "./_hook-utils.mjs";

const TAG = "stop-quality-gates";

const GATES = [
  {
    scope: "apps/app",
    command: "pnpm --filter app typecheck",
    label: "apps/app typecheck",
  },
  {
    scope: "apps/app",
    command: "pnpm --filter app test",
    label: "apps/app unit tests",
  },
  {
    scope: "apps/storybook",
    command: "pnpm --filter storybook typecheck",
    label: "apps/storybook typecheck",
  },
  {
    scope: "packages/design-system",
    command: "pnpm --filter @repo/design-system typecheck",
    label: "@repo/design-system typecheck",
  },
];

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; skipping");
  emit({});
  process.exit(0);
}

const status = input.status ?? "completed";
const loopCount = typeof input.loop_count === "number" ? input.loop_count : 0;

if (status !== "completed") {
  log(TAG, `status=${status}; skipping`);
  emit({});
  process.exit(0);
}

const repoRoot = resolveRepoRoot();
const failures = [];

for (const gate of GATES) {
  if (!scopeChanged(repoRoot, gate.scope)) {
    continue;
  }

  log(TAG, `${gate.scope} changed; running ${gate.label} (loop ${loopCount})`);

  const result = runShell(gate.command, repoRoot);
  const combined = truncate(
    [result.stdout ?? "", result.stderr ?? ""]
      .filter(Boolean)
      .join("\n")
      .trim() || `${gate.label} exited with code ${result.status ?? "unknown"}`
  );

  if (result.status === 0 && !result.error) {
    log(TAG, `${gate.label} passed`);
    continue;
  }

  const exitCode = result.status ?? 1;
  const errorNote = result.error
    ? `\nSpawn error: ${result.error.message}`
    : "";

  failures.push({
    label: gate.label,
    command: gate.command,
    exitCode,
    output: combined + errorNote,
  });
}

if (failures.length === 0) {
  emit({});
  process.exit(0);
}

log(TAG, `${failures.length} gate(s) failed`);

const sections = failures.flatMap((failure, index) => [
  index === 0
    ? "Quality gate(s) failed after your last turn. Fix the issues below, then stop — hooks will re-run automatically."
    : "",
  "",
  `## ${failure.label}`,
  `Command: ${failure.command}`,
  `Exit code: ${failure.exitCode}`,
  "",
  failure.output,
]);

emit({
  followup_message: sections.join("\n").trim(),
});

process.exit(0);
