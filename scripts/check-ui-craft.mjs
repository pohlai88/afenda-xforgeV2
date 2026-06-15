import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const command =
  "pnpm dlx ui-craft-detect packages/design-system apps/storybook/stories";

const result = spawnSync(command, {
  cwd: root,
  encoding: "utf8",
  shell: true,
});

const output = stripAnsi([result.stdout, result.stderr].filter(Boolean).join("\n"));

if (result.status === 0) {
  if (output.trim()) {
    process.stdout.write(output);
  }
  process.exit(0);
}

const findings = parseFindings(output);

if (findings.length === 0) {
  console.error(
    [
      "ui-craft detector exited non-zero, but no structured findings could be parsed.",
      "Raw output follows:",
      output,
    ].join("\n")
  );
  process.exit(result.status ?? 1);
}
const actionable = [];
const ignored = [];

for (const finding of findings) {
  if (isKnownFalsePositive(finding)) {
    ignored.push(finding);
    continue;
  }

  actionable.push(finding);
}

if (ignored.length) {
  const summary = summarizeIgnoredFindings(ignored);
  console.warn(`ui-craft ignored ${ignored.length} known detector false positives: ${summary}`);

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

console.log("ui-craft checks passed; only known detector false positives remain.");

function parseFindings(rawOutput) {
  const lines = rawOutput.split(/\r?\n/);
  const findings = [];
  let current;

  for (const line of lines) {
    const pathMatch = line.match(/^(packages[\\/].+?\.(?:tsx|ts|css)):(\d+)$/);

    if (pathMatch) {
      current = {
        file: join(root, pathMatch[1]),
        line: Number(pathMatch[2]),
        message: "",
      };
      continue;
    }

    const messageMatch = line.match(/^\s*●\s+(.+?)\s+—\s+/);
    if (messageMatch && current) {
      current.message = messageMatch[1].trim();
      findings.push(current);
      current = undefined;
    }
  }

  return findings;
}

function isKnownFalsePositive(finding) {
  const relativePath = toPosixPath(relative(root, finding.file));

  if (!relativePath.startsWith("packages/design-system/components/afenda-ui/")) {
    return false;
  }

  if (finding.message === "custom modal without native <dialog> or [popover]") {
    return relativePath === "packages/design-system/components/afenda-ui/navigation-menu.tsx";
  }

  if (finding.message === "table without overflow handling or sticky header") {
    return hasTableOverflowAndStickyHeader(finding.file);
  }

  if (finding.message === "outline removed without focus-visible replacement") {
    return sourceHasFocusRecipe(finding.file);
  }

  if (finding.message === "hover state without focus-visible") {
    return sourceHasFocusRecipe(finding.file) || isNonFocusableHoverSurface(finding.file);
  }

  return false;
}

function sourceHasFocusRecipe(file) {
  const source = readSource(file);

  return (
    source.includes('recipe("focusRing') ||
    source.includes('"focusRing"') ||
    source.includes('"focusRingOnly"') ||
    source.includes("focus-visible:")
  );
}

function hasTableOverflowAndStickyHeader(file) {
  const source = readSource(file);

  return source.includes("overflow-x-auto") && source.includes("sticky top-0");
}

function isNonFocusableHoverSurface(file) {
  const relativePath = toPosixPath(relative(root, file));

  return new Set([
    "packages/design-system/components/afenda-ui/field.tsx",
    "packages/design-system/components/afenda-ui/scroll-area.tsx",
    "packages/design-system/components/afenda-ui/sonner.tsx",
    "packages/design-system/components/afenda-ui/table.tsx",
  ]).has(relativePath);
}

function toPosixPath(value) {
  return value.replace(/\\/g, "/");
}

function readSource(file) {
  if (!existsSync(file)) {
    return "";
  }

  return readFileSync(file, "utf8");
}

function summarizeIgnoredFindings(findings) {
  const counts = new Map();

  for (const finding of findings) {
    counts.set(finding.message, (counts.get(finding.message) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([message, count]) => `${count} ${message}`)
    .join("; ");
}

function stripAnsi(value) {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}
