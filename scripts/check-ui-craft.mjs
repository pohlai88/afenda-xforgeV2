import { spawnSync } from "node:child_process";
import { relative } from "node:path";
import {
  evaluateUiCraftFindings,
  parseUiCraftFindings,
  stripUiCraftAnsi,
  summarizeUiCraftFindings,
} from "../packages/design-system/governance/ui-craft-exceptions.mjs";

const root = process.cwd();
const command =
  "pnpm dlx ui-craft-detect packages/design-system apps/storybook/stories";

const result = spawnSync(command, {
  cwd: root,
  encoding: "utf8",
  shell: true,
});

const output = stripUiCraftAnsi(
  [result.stdout, result.stderr].filter(Boolean).join("\n")
);

const findings = parseUiCraftFindings(output, root);

if (result.status !== 0 && findings.length === 0) {
  console.error(
    [
      "ui-craft detector exited non-zero, but no structured findings could be parsed.",
      "Raw output follows:",
      output,
    ].join("\n")
  );
  process.exit(result.status ?? 1);
}

const { actionable, ignored, violations } = evaluateUiCraftFindings({
  findings,
  root,
});

if (ignored.length) {
  const summary = summarizeUiCraftFindings(ignored);
  console.warn(
    `ui-craft ignored ${ignored.length} known detector false positives: ${summary}`
  );

  if (process.env.UI_CRAFT_VERBOSE === "1") {
    console.warn(
      ignored
        .map(
          (finding) =>
            `- ${relative(root, finding.file)}:${finding.line} ${finding.message}`
        )
        .join("\n")
    );
  }
}

if (violations.length) {
  console.error(
    [
      "ui-craft exception registry is invalid:",
      ...violations.map(
        (violation) => `- [${violation.rule}] ${violation.message}`
      ),
    ].join("\n")
  );
  process.exit(result.status ?? 1);
}

if (actionable.length) {
  console.error(
    [
      "ui-craft reported actionable findings:",
      ...actionable.map(
        (finding) =>
          `- ${relative(root, finding.file)}:${finding.line} ${finding.message}`
      ),
      "",
      "Run pnpm ui-craft:detect:raw for full detector output.",
    ].join("\n")
  );
  process.exit(result.status ?? 1);
}

console.log(
  "ui-craft checks passed; only known detector false positives remain."
);
