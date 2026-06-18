#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { AFENDA_TOKEN_SOURCE_OF_TRUTH } from "../contracts/afenda-token.contract.ts";

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

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const outputJson = process.argv.includes("--json");
const sourceFilePattern = /\.(css|ts|tsx)$/;
const ignoredDirectories = new Set([
  ".cache",
  ".turbo",
  "dist",
  "node_modules",
]);

const RULES = {
  rawTailwindColor: "token/no-raw-tailwind-color",
  rawCssColor: "token/no-raw-css-color",
  rawArbitraryValue: "token/no-raw-arbitrary-value",
  rawStringValue: "token/no-raw-string-value",
  cssVariableDeclaration: "token/no-css-variable-declaration",
  unknownTokenReference: "token/no-unknown-token-reference",
} as const;

const rawTailwindColorPattern =
  /(?<![a-zA-Z0-9_-])(?:[a-zA-Z0-9_:/[\]=.-]+:)*(?:bg|text|border|ring|outline|decoration|accent|caret|fill|stroke|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)(?:\/\d+)?(?![a-zA-Z0-9_-])/g;
const rawCssColorPattern =
  /#[0-9a-fA-F]{3,8}\b|(?:rgb|rgba|hsl|hsla|oklch)\(/g;
const rawArbitraryValuePattern =
  /\[[^\]\n\r]*(?:\d+(?:\.\d+)?(?:px|rem|em|ms)|cubic-bezier\()[^\]\n\r]*\]/g;
const rawStringValuePattern =
  /["'](?:-?\d+(?:\.\d+)?(?:px|rem|em|ms)|cubic-bezier\([^"'\n\r]*\))["']/g;
const cssVariableDeclarationPattern = /--[a-zA-Z0-9-]+\s*:/g;
const unknownTokenReferencePattern = /var\(--unknown[a-zA-Z0-9-]*\)/g;

const violations = scanFiles()
  .filter((file) => !isSourceOfTruth(file))
  .flatMap(checkFile)
  .sort(sortViolations);

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
  console.error("Token governance failed.");
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

console.log("Token governance passed.");
console.log("");
console.log(`Score: ${score}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);

function checkFile(file: SourceFile): Violation[] {
  return [
    ...findMatches(file, rawTailwindColorPattern, RULES.rawTailwindColor, (evidence) => ({
      evidence,
      message: `Raw Tailwind color utility "${evidence}" is forbidden because Token owns value.`,
    })),
    ...findMatches(file, rawCssColorPattern, RULES.rawCssColor, (evidence) => ({
      evidence,
      message: `Raw color value "${evidence}" is forbidden because Token owns raw values.`,
    })),
    ...findMatches(
      file,
      rawArbitraryValuePattern,
      RULES.rawArbitraryValue,
      (evidence) => ({
      evidence,
      message: `Raw arbitrary value "${evidence}" is forbidden unless it references a token.`,
      })
    ).filter((violation) => !violation.evidence.includes("var(--")),
    ...findMatches(file, rawStringValuePattern, RULES.rawStringValue, (evidence) => ({
      evidence,
      message: `Raw unit value "${evidence}" is forbidden because Token owns raw values.`,
    })).filter((violation) => !violation.evidence.includes("var(--")),
    ...findMatches(
      file,
      cssVariableDeclarationPattern,
      RULES.cssVariableDeclaration,
      (evidence) => ({
      evidence,
      message: `CSS variable declaration "${evidence}" is forbidden because Token owns CSS variables.`,
      })
    ),
    ...findMatches(
      file,
      unknownTokenReferencePattern,
      RULES.unknownTokenReference,
      (evidence) => ({
      evidence,
      message: `Unknown token reference "${evidence}" is forbidden.`,
      })
    ),
  ];
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
    const evidence = match[0];
    const details = createViolation(evidence);
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
    .sort((a, b) => normalizePath(a).localeCompare(normalizePath(b)))
    .map((path) => ({
      path,
      relativePath: normalizePath(relative(packageRoot, path)),
      source: readFileSync(path, "utf8"),
    }))
    .map((file) => ({
      ...file,
      lines: file.source.split(/\r?\n/),
    }));
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

function isSourceOfTruth(file: SourceFile): boolean {
  const normalizedPath = normalizePath(file.relativePath);

  if (
    normalizedPath.startsWith("contracts/") ||
    normalizedPath.startsWith("scripts/") ||
    normalizedPath.startsWith("test/") ||
    normalizedPath.endsWith(".test.ts") ||
    normalizedPath.endsWith(".test.tsx")
  ) {
    return true;
  }

  return AFENDA_TOKEN_SOURCE_OF_TRUTH.some((sourceOfTruth) =>
    normalizedPath.endsWith(sourceOfTruth)
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

function isIgnored(file: SourceFile, line: number): boolean {
  const previousLine = file.lines[line - 2];

  if (!previousLine) {
    return false;
  }

  return /^\s*\/\/ afenda-token-ignore-next-line -- \S.+$/.test(previousLine);
}

function sortViolations(a: Violation, b: Violation): number {
  return (
    a.file.localeCompare(b.file) ||
    a.line - b.line ||
    a.column - b.column ||
    a.ruleId.localeCompare(b.ruleId)
  );
}
