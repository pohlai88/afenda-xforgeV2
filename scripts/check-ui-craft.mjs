import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const command =
  "pnpm dlx ui-craft-detect packages/design-system apps/storybook/stories";
// biome-ignore lint/suspicious/noControlCharactersInRegex: strips ANSI escape sequences from detector output.
const ANSI_PATTERN = /\u001b\[[0-9;]*m/g;
const FINDING_MESSAGE_PATTERN = /^\s*●\s+(.+?)\s+—\s+/;
const FINDING_PATH_PATTERN = /^(packages[\\/].+?\.(?:tsx|ts|css)):(\d+)$/;
const LINE_SPLIT_PATTERN = /\r?\n/;
const knownFocusRecipeFalsePositivePaths = new Set([
  "packages/design-system/components/afenda-ui/accordion.tsx",
  "packages/design-system/components/afenda-ui/alert-dialog.tsx",
  "packages/design-system/components/afenda-ui/button.tsx",
  "packages/design-system/components/afenda-ui/checkbox.tsx",
  "packages/design-system/components/afenda-ui/collapsible.tsx",
  "packages/design-system/components/afenda-ui/dialog.tsx",
  "packages/design-system/components/afenda-ui/drawer.tsx",
  "packages/design-system/components/afenda-ui/focusable.tsx",
  "packages/design-system/components/afenda-ui/item.tsx",
  "packages/design-system/components/afenda-ui/menubar.tsx",
  "packages/design-system/components/afenda-ui/navigation-menu.tsx",
  "packages/design-system/components/afenda-ui/radio-group.tsx",
  "packages/design-system/components/afenda-ui/recipes.ts",
  "packages/design-system/components/afenda-ui/resizable.tsx",
  "packages/design-system/components/afenda-ui/scroll-area.tsx",
  "packages/design-system/components/afenda-ui/select.tsx",
  "packages/design-system/components/afenda-ui/sheet.tsx",
  "packages/design-system/components/afenda-ui/sidebar.tsx",
  "packages/design-system/components/afenda-ui/slider.tsx",
  "packages/design-system/components/afenda-ui/switch.tsx",
  "packages/design-system/components/afenda-ui/tabs.tsx",
  "packages/design-system/components/afenda-ui/toggle.tsx",
]);
const knownHoverFocusFalsePositivePaths = new Set([
  "packages/design-system/components/afenda-ui/accordion.tsx",
  "packages/design-system/components/afenda-ui/breadcrumb.tsx",
  "packages/design-system/components/afenda-ui/button.tsx",
  "packages/design-system/components/afenda-ui/item.tsx",
  "packages/design-system/components/afenda-ui/menubar.tsx",
  "packages/design-system/components/afenda-ui/navigation-menu.tsx",
  "packages/design-system/components/afenda-ui/radio-group.tsx",
  "packages/design-system/components/afenda-ui/resizable.tsx",
  "packages/design-system/components/afenda-ui/sidebar.tsx",
  "packages/design-system/components/afenda-ui/slider.tsx",
  "packages/design-system/components/afenda-ui/tabs.tsx",
  "packages/design-system/components/afenda-ui/toggle.tsx",
]);
const knownNonFocusableHoverFalsePositivePaths = new Set([
  "packages/design-system/components/afenda-ui/field.tsx",
  "packages/design-system/components/afenda-ui/scroll-area.tsx",
  "packages/design-system/components/afenda-ui/sonner.tsx",
  "packages/design-system/components/afenda-ui/table.tsx",
]);

const result = spawnSync(command, {
  cwd: root,
  encoding: "utf8",
  shell: true,
});

const output = stripAnsi(
  [result.stdout, result.stderr].filter(Boolean).join("\n")
);

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

function parseFindings(rawOutput) {
  const lines = rawOutput.split(LINE_SPLIT_PATTERN);
  const findings = [];
  let current;

  for (const line of lines) {
    const pathMatch = line.match(FINDING_PATH_PATTERN);

    if (pathMatch) {
      current = {
        file: join(root, pathMatch[1]),
        line: Number(pathMatch[2]),
        message: "",
      };
      continue;
    }

    const messageMatch = line.match(FINDING_MESSAGE_PATTERN);
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

  if (
    (relativePath ===
      "packages/design-system/contracts/afenda-recipe.contract.ts" ||
      relativePath ===
        "packages/design-system/contracts/afenda-class-name-policy.contract.ts") &&
    finding.message === "transition: all"
  ) {
    return true;
  }

  if (
    (relativePath ===
      "packages/design-system/contracts/afenda-accessibility.contract.ts" ||
      relativePath ===
        "packages/design-system/test/afenda-design-system-contract.test.ts") &&
    finding.message === "outline removed without focus-visible replacement"
  ) {
    return true;
  }

  if (
    relativePath === "packages/design-system/styles/globals.css" &&
    (finding.message === "hover state without focus-visible" ||
      finding.message === "mixed length units in same block")
  ) {
    return true;
  }

  if (
    !relativePath.startsWith("packages/design-system/components/afenda-ui/")
  ) {
    return false;
  }

  if (finding.message === "custom modal without native <dialog> or [popover]") {
    return (
      relativePath ===
      "packages/design-system/components/afenda-ui/navigation-menu.tsx"
    );
  }

  if (finding.message === "table without overflow handling or sticky header") {
    return (
      relativePath ===
        "packages/design-system/components/afenda-ui/table.tsx" &&
      hasTableOverflowAndStickyHeader(finding.file)
    );
  }

  if (finding.message === "outline removed without focus-visible replacement") {
    return (
      knownFocusRecipeFalsePositivePaths.has(relativePath) &&
      sourceHasFocusRecipe(finding.file)
    );
  }

  if (finding.message === "hover state without focus-visible") {
    return (
      (knownHoverFocusFalsePositivePaths.has(relativePath) &&
        sourceHasFocusRecipe(finding.file)) ||
      knownNonFocusableHoverFalsePositivePaths.has(relativePath)
    );
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
  return value.replace(ANSI_PATTERN, "");
}
