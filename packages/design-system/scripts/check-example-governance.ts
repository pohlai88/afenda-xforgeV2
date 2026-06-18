#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AFENDA_EXAMPLE_CONTRACT_VERSION,
  AFENDA_EXAMPLE_FORBIDDEN_PATTERNS,
  AFENDA_EXAMPLE_WARNING_PATTERNS,
} from "../contracts/afenda-example.contract.ts";

interface SourceFile {
  readonly path: string;
  readonly relativePath: string;
  readonly source: string;
  readonly lines: readonly string[];
}

type Severity = "error" | "warning";

interface Violation {
  readonly ruleId: string;
  readonly severity: Severity;
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly evidence: string;
  readonly message: string;
}

const RULES = {
  forbiddenPattern: "example/no-forbidden-pattern",
  warningPattern: "example/no-warning-pattern",
  privateImport: "example/no-private-import",
  internalPath: "example/no-internal-path",
  staleContractVersion: "example/no-stale-contract-version",
} as const;

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const outputJson = process.argv.includes("--json");
const strict = process.argv.includes("--strict");
const ignoredDirectories = new Set([
  ".cache",
  ".turbo",
  "dist",
  "node_modules",
]);
const sourceFilePattern = /\.(ts|tsx)$/;
const privateImportPattern =
  /from\s+["']@repo\/design-system\/components\/ui(?:\/[^"']*)?["']/g;
const internalPathPattern =
  /from\s+["'](?:\.\.?\/)*(?:internal|src)(?:\/[^"']*)?["']/g;
const packageInternalImportPattern =
  /from\s+["']@repo\/design-system\/(?:src|internal)(?:\/[^"']*)?["']/g;
const exampleContractVersionPattern =
  /AFENDA_EXAMPLE_CONTRACT_VERSION\s*[:=]\s*["']([^"']+)["']|exampleContractVersion\s*[:=]\s*["']([^"']+)["']/g;

const violations = scanFiles()
  .flatMap(checkExampleFile)
  .sort(sortViolations);

const errorCount = violations.filter(
  (violation) => violation.severity === "error"
).length;
const warningCount = violations.filter(
  (violation) => violation.severity === "warning"
).length;
const passed = errorCount === 0 && (!strict || warningCount === 0);
const score = Math.max(0, 100 - errorCount * 5 - warningCount);

if (outputJson) {
  console.log(JSON.stringify({ passed, violations }, null, 2));
  process.exit(passed ? 0 : 1);
}

if (!passed) {
  console.error("Example governance failed.");
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

console.log("Example governance passed.");
console.log("");
console.log(`Score: ${score}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);

function checkExampleFile(file: SourceFile): Violation[] {
  return [
    ...AFENDA_EXAMPLE_FORBIDDEN_PATTERNS.flatMap((pattern) =>
      findLiteralPattern(file, pattern, RULES.forbiddenPattern, "error")
    ),
    ...AFENDA_EXAMPLE_WARNING_PATTERNS.flatMap((pattern) =>
      findLiteralPattern(file, pattern, RULES.warningPattern, "warning")
    ),
    ...findMatches(file, privateImportPattern, RULES.privateImport, "error", (evidence) => ({
      evidence,
      message:
        "Examples must not import private shadcn implementation modules; use public design-system exports.",
    })),
    ...findMatches(file, internalPathPattern, RULES.internalPath, "error", (evidence) => ({
      evidence,
      message: `Examples must not import internal paths. Evidence: ${evidence}`,
    })),
    ...findMatches(
      file,
      packageInternalImportPattern,
      RULES.internalPath,
      "error",
      (evidence) => ({
        evidence,
        message: `Examples must not import internal paths. Evidence: ${evidence}`,
      })
    ),
    ...checkContractVersion(file),
  ];
}

function checkContractVersion(file: SourceFile): Violation[] {
  const violations: Violation[] = [];
  exampleContractVersionPattern.lastIndex = 0;

  for (const match of file.source.matchAll(exampleContractVersionPattern)) {
    const version = match[1] ?? match[2] ?? "";

    if (version === AFENDA_EXAMPLE_CONTRACT_VERSION) {
      continue;
    }

    const violation = toViolation(file, match.index ?? 0, {
      evidence: version,
      message: `Example contract version "${version}" is stale; use "${AFENDA_EXAMPLE_CONTRACT_VERSION}".`,
      ruleId: RULES.staleContractVersion,
      severity: "error",
    });

    if (!isIgnored(file, violation.line)) {
      violations.push(violation);
    }
  }

  return violations;
}

function findLiteralPattern(
  file: SourceFile,
  pattern: string,
  ruleId: string,
  severity: Severity
): Violation[] {
  const violations: Violation[] = [];
  let index = file.source.indexOf(pattern);

  while (index !== -1) {
    const violation = toViolation(file, index, {
      evidence: pattern,
      message:
        severity === "error"
          ? `Forbidden example pattern "${pattern}" is present.`
          : `Warning example pattern "${pattern}" is present.`,
      ruleId,
      severity,
    });

    if (!isIgnored(file, violation.line)) {
      violations.push(violation);
    }

    index = file.source.indexOf(pattern, index + pattern.length);
  }

  return violations;
}

function findMatches(
  file: SourceFile,
  pattern: RegExp,
  ruleId: string,
  severity: Severity,
  createViolation: (evidence: string) => {
    readonly evidence: string;
    readonly message: string;
  }
): Violation[] {
  const violations: Violation[] = [];
  pattern.lastIndex = 0;

  for (const match of file.source.matchAll(pattern)) {
    const details = createViolation(match[0]);
    const violation = toViolation(file, match.index ?? 0, {
      ...details,
      ruleId,
      severity,
    });

    if (!isIgnored(file, violation.line)) {
      violations.push(violation);
    }
  }

  return violations;
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
    .filter((path) => sourceFilePattern.test(path))
    .filter((path) => isExampleFile(normalizePath(relative(packageRoot, path))))
    .sort((a, b) => normalizePath(a).localeCompare(normalizePath(b)))
    .map((path) => {
      const source = readFileSync(path, "utf8");

      return {
        path,
        relativePath: normalizePath(relative(packageRoot, path)),
        source,
        lines: source.split(/\r?\n/),
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

function isExampleFile(path: string): boolean {
  return (
    path.includes("/fixtures/") ||
    path.includes("-demo-") ||
    path.includes("/demo-") ||
    path.includes(".example.") ||
    path.includes("/examples/") ||
    path.endsWith(".stories.tsx")
  );
}

function isIgnored(file: SourceFile, line: number): boolean {
  const previousLine = file.lines[line - 2];

  if (!previousLine) {
    return false;
  }

  return /^\s*\/\/ afenda-example-ignore-next-line -- \S.+$/.test(
    previousLine
  );
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

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

function sortViolations(a: Violation, b: Violation): number {
  return (
    a.file.localeCompare(b.file) ||
    a.line - b.line ||
    a.column - b.column ||
    a.ruleId.localeCompare(b.ruleId)
  );
}
