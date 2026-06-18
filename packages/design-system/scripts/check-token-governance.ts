#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { AFENDA_TOKEN_SOURCE_OF_TRUTH } from "../contracts/afenda-token.contract.ts";

interface SourceFile {
  readonly path: string;
  readonly relativePath: string;
  readonly source: string;
}

interface Violation {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly evidence: string;
  readonly message: string;
}

const packageRoot = join(fileURLToPath(new URL("..", import.meta.url)));
const sourceFilePattern = /\.(css|ts|tsx)$/;
const ignoredDirectories = new Set([
  ".cache",
  ".turbo",
  "dist",
  "node_modules",
]);

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
  .flatMap(checkFile);

if (violations.length > 0) {
  console.error(
    `Token governance failed with ${violations.length} violation${
      violations.length === 1 ? "" : "s"
    }.`
  );

  for (const violation of violations) {
    console.error(
      `${violation.file}:${violation.line}:${violation.column} ${violation.message} Evidence: ${violation.evidence}`
    );
  }

  process.exit(1);
}

console.log("Token governance passed.");

function checkFile(file: SourceFile): Violation[] {
  return [
    ...findMatches(file, rawTailwindColorPattern, (evidence) => ({
      evidence,
      message: `Raw Tailwind color utility "${evidence}" is forbidden because Token owns value.`,
    })),
    ...findMatches(file, rawCssColorPattern, (evidence) => ({
      evidence,
      message: `Raw color value "${evidence}" is forbidden because Token owns raw values.`,
    })),
    ...findMatches(file, rawArbitraryValuePattern, (evidence) => ({
      evidence,
      message: `Raw arbitrary value "${evidence}" is forbidden unless it references a token.`,
    })).filter((violation) => !violation.evidence.includes("var(--")),
    ...findMatches(file, rawStringValuePattern, (evidence) => ({
      evidence,
      message: `Raw unit value "${evidence}" is forbidden because Token owns raw values.`,
    })).filter((violation) => !violation.evidence.includes("var(--")),
    ...findMatches(file, cssVariableDeclarationPattern, (evidence) => ({
      evidence,
      message: `CSS variable declaration "${evidence}" is forbidden because Token owns CSS variables.`,
    })),
    ...findMatches(file, unknownTokenReferencePattern, (evidence) => ({
      evidence,
      message: `Unknown token reference "${evidence}" is forbidden.`,
    })),
  ];
}

function findMatches(
  file: SourceFile,
  pattern: RegExp,
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
    matches.push(toViolation(file, match.index ?? 0, details));
  }

  return matches;
}

function toViolation(
  file: SourceFile,
  index: number,
  details: { readonly evidence: string; readonly message: string }
): Violation {
  const location = lineAndColumn(file.source, index);

  return {
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
    .map((path) => ({
      path,
      relativePath: normalizePath(relative(packageRoot, path)),
      source: readFileSync(path, "utf8"),
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

  return readdirSync(path).flatMap((child) => walk(join(path, child)));
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
