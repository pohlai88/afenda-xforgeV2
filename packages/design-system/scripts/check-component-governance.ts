#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { AFENDA_COMPONENT_FORBIDDEN_PATTERNS } from "../contracts/afenda-component.contract.ts";
import {
  AFENDA_BLOCK_COMPONENT_IDS,
  AFENDA_PRIMITIVE_COMPONENT_IDS,
} from "../registries/component.registry.ts";
import {
  AFENDA_SLOT_EXACT_IDENTITY_REGISTRY,
  AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY,
} from "../registries/slot.registry.ts";

const NEWLINE_RE = /\r?\n/;
const COMPONENT_IGNORE_NEXT_LINE_RE =
  /^\s*\/\/ afenda-component-ignore-next-line -- \S.+$/;
const RECIPE_CALL_RE = /\b(?:recipe|blockRecipe)\s*\(/;
const EXPORT_ALIAS_RE = /^([A-Z][A-Za-z0-9]*)\s+as\s+([A-Z][A-Za-z0-9]*)$/;
const ALIAS_SUFFIX_RE = /\s+as\s+[A-Z][A-Za-z0-9]*$/;
const PASCAL_NAME_RE = /^[A-Z][A-Za-z0-9]*$/;

interface SourceFile {
  readonly lines: readonly string[];
  readonly path: string;
  readonly relativePath: string;
  readonly source: string;
}

type Severity = "error" | "warning";

interface Violation {
  readonly column: number;
  readonly evidence: string;
  readonly file: string;
  readonly line: number;
  readonly message: string;
  readonly ruleId: string;
  readonly severity: Severity;
}

const RULES = {
  missingPrimitiveImplementation:
    "component/no-missing-primitive-implementation",
  missingBlockImplementation: "component/no-missing-block-implementation",
  unknownPrimitiveFile: "component/no-unknown-primitive-file",
  forbiddenPattern: "component/no-forbidden-pattern",
  serverAction: "component/no-server-action",
  environmentRead: "component/no-environment-read",
  databaseImport: "component/no-database-import",
  dataFetching: "component/no-data-fetching",
  missingDataSlot: "component/missing-data-slot",
  missingRecipe: "component/no-missing-recipe",
  unknownSlot: "component/no-unknown-slot",
} as const;

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const outputJson = process.argv.includes("--json");
const ignoredDirectories = new Set([
  ".cache",
  ".turbo",
  "dist",
  "node_modules",
]);
const componentFilePattern = /\.tsx$/;
const allowedAfendaUiNonComponentFiles = new Set([
  "index",
  "recipes",
  "recipes.contract",
  "sidebar-behavior",
  "sidebar-rail-recipes",
  "sonner",
]);
const componentForbiddenPatterns = AFENDA_COMPONENT_FORBIDDEN_PATTERNS.filter(
  (pattern) =>
    pattern === "as any" ||
    pattern === "Record<string, any>" ||
    pattern === "use server" ||
    pattern === "process.env"
);
const databaseImportPattern = /from\s+["']@repo\/database(?:\/[^"']*)?["']/g;
const dataFetchingPattern = /\b(?:fetch|database\.[a-zA-Z0-9_]+)\s*\(/g;
const dataSlotPatterns = [
  /data-slot\s*=\s*["']([^"']+)["']/g,
  /data-slot\s*:\s*["']([^"']+)["']/g,
  /["']data-slot["']\s*:\s*["']([^"']+)["']/g,
] as const;
const slotIdentityPatterns = AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY.map(
  (pattern) => new RegExp(pattern)
);

const sourceFiles = scanFiles();
const violations = [
  ...checkPrimitiveRegistry(),
  ...checkBlockRegistry(),
  ...sourceFiles.flatMap(checkComponentFile),
].sort(sortViolations);

const errorCount = violations.filter(
  (violation) => violation.severity === "error"
).length;
const warningCount = violations.filter(
  (violation) => violation.severity === "warning"
).length;
const passed = errorCount === 0;
const score = Math.max(0, 100 - errorCount * 5 - warningCount);

if (outputJson) {
  console.log(JSON.stringify({ passed, violations }, null, 2));
  process.exit(passed ? 0 : 1);
}

if (!passed) {
  console.error("Component governance failed.");
  console.error("");
  console.error(`Score: ${score}`);
  console.error(`Errors: ${errorCount}`);
  console.error(`Warnings: ${warningCount}`);

  for (const violation of violations) {
    console.error("");
    console.error(
      `${violation.file}:${violation.line}:${violation.column} ${violation.ruleId}`
    );
    console.error(violation.message);
  }

  process.exit(1);
}

console.log("Component governance passed.");
console.log("");
console.log(`Score: ${score}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);

function checkPrimitiveRegistry(): Violation[] {
  const violations: Violation[] = [];
  const primitiveFiles = sourceFiles.filter((file) =>
    file.relativePath.startsWith("components/afenda-ui/")
  );
  const implementedFileIds = new Set(
    primitiveFiles.map((file) => basename(file.relativePath, ".tsx"))
  );
  const exportedNames = collectExportedNames(primitiveFiles);

  for (const fileId of implementedFileIds) {
    if (
      allowedAfendaUiNonComponentFiles.has(fileId) ||
      AFENDA_PRIMITIVE_COMPONENT_IDS.includes(
        fileId as (typeof AFENDA_PRIMITIVE_COMPONENT_IDS)[number]
      )
    ) {
      continue;
    }

    violations.push(
      registryViolation(
        RULES.unknownPrimitiveFile,
        `components/afenda-ui/${fileId}.tsx`,
        fileId,
        `Public primitive component file "${fileId}" is not registered in the component registry.`
      )
    );
  }

  for (const componentId of AFENDA_PRIMITIVE_COMPONENT_IDS) {
    const componentName = toPascalCase(componentId);

    if (
      implementedFileIds.has(componentId) ||
      exportedNames.has(componentName)
    ) {
      continue;
    }

    violations.push(
      registryViolation(
        RULES.missingPrimitiveImplementation,
        "components/afenda-ui",
        componentId,
        `Primitive component "${componentId}" is registered but has no implementation file or exported component.`
      )
    );
  }

  return violations;
}

function checkBlockRegistry(): Violation[] {
  const violations: Violation[] = [];
  const blockFiles = sourceFiles.filter((file) =>
    file.relativePath.startsWith("components/blocks/")
  );
  const exportedNames = collectExportedNames(blockFiles);

  for (const componentId of AFENDA_BLOCK_COMPONENT_IDS) {
    if (exportedNames.has(componentId)) {
      continue;
    }

    violations.push(
      registryViolation(
        RULES.missingBlockImplementation,
        "components/blocks",
        componentId,
        `Block component "${componentId}" is registered but has no exported implementation.`
      )
    );
  }

  return violations;
}

function checkComponentFile(file: SourceFile): Violation[] {
  if (isBlockBarrelFile(file.relativePath)) {
    return [];
  }

  return [
    ...checkDataSlotExposure(file),
    ...checkRecipeUsage(file),
    ...checkKnownSlots(file),
    ...componentForbiddenPatterns.flatMap((pattern) =>
      findLiteralPattern(
        file,
        pattern,
        RULES.forbiddenPattern,
        `Forbidden component pattern "${pattern}" is present.`
      )
    ),
    ...findLiteralPattern(
      file,
      '"use server"',
      RULES.serverAction,
      "Server actions are forbidden in design-system components."
    ),
    ...findLiteralPattern(
      file,
      "'use server'",
      RULES.serverAction,
      "Server actions are forbidden in design-system components."
    ),
    ...findLiteralPattern(
      file,
      "process.env",
      RULES.environmentRead,
      "Environment reads are forbidden because components must not own runtime configuration."
    ),
    ...findMatches(
      file,
      databaseImportPattern,
      RULES.databaseImport,
      (evidence) => ({
        evidence,
        message:
          "Database imports are forbidden because components must not own data access.",
      })
    ),
    ...findMatches(
      file,
      dataFetchingPattern,
      RULES.dataFetching,
      (evidence) => ({
        evidence,
        message: `Data fetching call "${evidence.trim()}" is forbidden because components own behavior, not data access.`,
      })
    ),
  ];
}

function checkDataSlotExposure(file: SourceFile): Violation[] {
  if (hasDataSlot(file.source)) {
    return [];
  }

  return [
    {
      ruleId: RULES.missingDataSlot,
      severity: "error",
      file: file.relativePath,
      line: 1,
      column: 1,
      evidence: file.relativePath,
      message:
        "Component file does not expose a data-slot; componentsMustExposeDataSlot is required by the component contract.",
    },
  ];
}

function checkRecipeUsage(file: SourceFile): Violation[] {
  if (RECIPE_CALL_RE.test(file.source)) {
    return [];
  }

  return [
    {
      ruleId: RULES.missingRecipe,
      severity: "error",
      file: file.relativePath,
      line: 1,
      column: 1,
      evidence: file.relativePath,
      message:
        "Component file does not use recipe() or blockRecipe(); componentWithoutRecipeIsHardFail is required by the component contract.",
    },
  ];
}

function checkKnownSlots(file: SourceFile): Violation[] {
  const violations: Violation[] = [];

  for (const pattern of dataSlotPatterns) {
    pattern.lastIndex = 0;

    for (const match of file.source.matchAll(pattern)) {
      const slot = match[1];

      if (!slot || isKnownSlot(slot)) {
        continue;
      }

      const violation = toViolation(file, match.index ?? 0, {
        evidence: slot,
        message: `Unknown data-slot "${slot}" is forbidden because components must use registry slots.`,
        ruleId: RULES.unknownSlot,
        severity: "error",
      });

      if (!isIgnored(file, violation.line)) {
        violations.push(violation);
      }
    }
  }

  return violations;
}

function findLiteralPattern(
  file: SourceFile,
  pattern: string,
  ruleId: string,
  message: string
): Violation[] {
  const matches: Violation[] = [];
  let index = file.source.indexOf(pattern);

  while (index !== -1) {
    const violation = toViolation(file, index, {
      evidence: pattern,
      message,
      ruleId,
      severity: "error",
    });

    if (!isIgnored(file, violation.line)) {
      matches.push(violation);
    }

    index = file.source.indexOf(pattern, index + pattern.length);
  }

  return matches;
}

function findMatches(
  file: SourceFile,
  pattern: RegExp,
  ruleId: string,
  createViolation: (evidence: string) => {
    readonly evidence: string;
    readonly message: string;
  }
): Violation[] {
  const matches: Violation[] = [];
  pattern.lastIndex = 0;

  for (const match of file.source.matchAll(pattern)) {
    const details = createViolation(match[0]);
    const violation = toViolation(file, match.index ?? 0, {
      ...details,
      ruleId,
      severity: "error",
    });

    if (!isIgnored(file, violation.line)) {
      matches.push(violation);
    }
  }

  return matches;
}

function registryViolation(
  ruleId: string,
  file: string,
  evidence: string,
  message: string
): Violation {
  return {
    ruleId,
    severity: "error",
    file,
    line: 1,
    column: 1,
    evidence,
    message,
  };
}

function toViolation(
  file: SourceFile,
  index: number,
  details: {
    readonly evidence: string;
    readonly message: string;
    readonly ruleId: string;
    readonly severity: Severity;
  }
): Violation {
  const location = lineAndColumn(file.source, index);

  return {
    ruleId: details.ruleId,
    severity: details.severity,
    file: file.relativePath,
    line: location.line,
    column: location.column,
    evidence: details.evidence,
    message: details.message,
  };
}

function scanFiles(): SourceFile[] {
  return walk(packageRoot)
    .filter(
      (path) => componentFilePattern.test(path) || isBlockBarrelFile(path)
    )
    .filter((path) => {
      const relativePath = normalizePath(relative(packageRoot, path));

      return (
        relativePath.startsWith("components/afenda-ui/") ||
        relativePath.startsWith("components/blocks/")
      );
    })
    .sort((a, b) => normalizePath(a).localeCompare(normalizePath(b)))
    .map((path) => {
      const source = readFileSync(path, "utf8");

      return {
        path,
        relativePath: normalizePath(relative(packageRoot, path)),
        source,
        lines: source.split(NEWLINE_RE),
      };
    });
}

function walk(path: string): string[] {
  if (!existsSync(path)) {
    return [];
  }

  const stats = statSync(path);

  if (!stats.isDirectory()) {
    return [path];
  }

  if (ignoredDirectories.has(basename(path))) {
    return [];
  }

  return readdirSync(path)
    .sort((a, b) => a.localeCompare(b))
    .flatMap((child) => walk(join(path, child)));
}

function collectExportedNames(files: readonly SourceFile[]): Set<string> {
  const names = new Set<string>();

  for (const file of files) {
    for (const name of collectExportedNamesFromSource(file.source)) {
      names.add(name);
    }
  }

  return names;
}

function collectNamesFromExportList(exportList: string): string[] {
  const names: string[] = [];

  for (const item of exportList.split(",")) {
    const trimmed = item.trim();

    if (trimmed.startsWith("type ")) {
      continue;
    }

    const aliasMatch = trimmed.match(EXPORT_ALIAS_RE);

    if (aliasMatch) {
      names.push(aliasMatch[1] ?? "", aliasMatch[2] ?? "");
      continue;
    }

    const exportedName = trimmed.replace(ALIAS_SUFFIX_RE, "").trim();

    if (PASCAL_NAME_RE.test(exportedName)) {
      names.push(exportedName);
    }
  }

  return names;
}

function collectExportedNamesFromSource(source: string): string[] {
  const names: string[] = [];

  for (const match of source.matchAll(
    /\bexport\s+(?:function|const)\s+([A-Z][A-Za-z0-9]*)/g
  )) {
    names.push(match[1] ?? "");
  }

  for (const match of source.matchAll(/\bexport\s*{([^}]+)}/g)) {
    names.push(...collectNamesFromExportList(match[1] ?? ""));
  }

  for (const match of source.matchAll(
    /\bmemo\s*\(\s*function\s+([A-Z][A-Za-z0-9]*)/g
  )) {
    names.push(match[1] ?? "");
  }

  for (const match of source.matchAll(/\bfunction\s+([A-Z][A-Za-z0-9]*)/g)) {
    const name = match[1] ?? "";

    if (source.includes("export {\n") && source.includes(name)) {
      names.push(name);
    }
  }

  return names.filter((name) => name.length > 0);
}

function hasDataSlot(source: string): boolean {
  return dataSlotPatterns.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(source);
  });
}

function isKnownSlot(slot: string): boolean {
  return (
    AFENDA_SLOT_EXACT_IDENTITY_REGISTRY.includes(
      slot as (typeof AFENDA_SLOT_EXACT_IDENTITY_REGISTRY)[number]
    ) || slotIdentityPatterns.some((pattern) => pattern.test(slot))
  );
}

function isIgnored(file: SourceFile, line: number): boolean {
  const previousLine = file.lines[line - 2];

  if (!previousLine) {
    return false;
  }

  return COMPONENT_IGNORE_NEXT_LINE_RE.test(previousLine);
}

function lineAndColumn(
  source: string,
  index: number
): { readonly line: number; readonly column: number } {
  const prefix = source.slice(0, index);
  const lines = prefix.split("\n");

  return {
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  };
}

function toPascalCase(value: string): string {
  return value
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

function isBlockBarrelFile(path: string): boolean {
  const relativePath = normalizePath(relative(packageRoot, path));

  return (
    relativePath.endsWith(".ts") &&
    relativePath.startsWith("components/blocks/") &&
    (relativePath.endsWith("/index.ts") ||
      relativePath === "components/blocks/index.ts")
  );
}

function sortViolations(a: Violation, b: Violation): number {
  return (
    a.file.localeCompare(b.file) ||
    a.line - b.line ||
    a.column - b.column ||
    a.ruleId.localeCompare(b.ruleId)
  );
}
