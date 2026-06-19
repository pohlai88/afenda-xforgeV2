#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { AFENDA_SLOT_FORBIDDEN_PATTERNS } from "../contracts/afenda-slot.contract.ts";
import {
  AFENDA_SLOT_EXACT_IDENTITY_REGISTRY,
  AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY,
} from "../registries/slot.registry.ts";

const NEWLINE_RE = /\r?\n/;
const SLOT_IGNORE_NEXT_LINE_RE =
  /^\s*\/\/ afenda-slot-ignore-next-line -- \S.+$/;

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
  duplicateSlot: "slot/no-duplicate-slot",
  invalidSlotName: "slot/no-invalid-slot-name",
  invalidSlotPattern: "slot/no-invalid-slot-pattern",
  unknownSlot: "slot/no-unknown-slot",
  dynamicSlot: "slot/no-dynamic-slot",
  forbiddenSlotPattern: "slot/no-forbidden-slot-pattern",
} as const;

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const outputJson = process.argv.includes("--json");
const ignoredDirectories = new Set([
  ".cache",
  ".turbo",
  "dist",
  "node_modules",
]);
const sourceFilePattern = /\.(ts|tsx)$/;
const slotNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const dataSlotPatterns = [
  /data-slot\s*=\s*["']([^"']+)["']/g,
  /data-slot\s*:\s*["']([^"']+)["']/g,
  /["']data-slot["']\s*:\s*["']([^"']+)["']/g,
] as const;
const dynamicDataSlotPatterns = [
  /data-slot\s*=\s*{`([^`]*\$\{[^`]+)`}/g,
  /data-slot\s*:\s*`([^`]*\$\{[^`]+)`/g,
  /["']data-slot["']\s*:\s*`([^`]*\$\{[^`]+)`/g,
] as const;

const slotIdentityPatterns = AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY.map(
  (pattern) => new RegExp(pattern)
);
const sourceFiles = scanFiles();
const violations = [
  ...checkSlotRegistry(),
  ...sourceFiles.flatMap(checkSlotFile),
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
  console.error("Slot governance failed.");
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

console.log("Slot governance passed.");
console.log("");
console.log(`Score: ${score}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);

function checkSlotRegistry(): Violation[] {
  const violations: Violation[] = [];
  const seenSlots = new Set<string>();

  for (const slot of AFENDA_SLOT_EXACT_IDENTITY_REGISTRY) {
    if (seenSlots.has(slot)) {
      violations.push(
        registryViolation(
          RULES.duplicateSlot,
          slot,
          `Slot "${slot}" is duplicated in the exact slot registry.`
        )
      );
    }

    seenSlots.add(slot);

    if (!slotNamePattern.test(slot)) {
      violations.push(
        registryViolation(
          RULES.invalidSlotName,
          slot,
          `Slot "${slot}" must use stable kebab-case.`
        )
      );
    }
  }

  for (const pattern of AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY) {
    try {
      new RegExp(pattern);
    } catch {
      violations.push(
        registryViolation(
          RULES.invalidSlotPattern,
          pattern,
          `Slot pattern "${pattern}" is not a valid regular expression.`
        )
      );
    }
  }

  return violations;
}

function checkSlotFile(file: SourceFile): Violation[] {
  return [
    ...AFENDA_SLOT_FORBIDDEN_PATTERNS.flatMap((pattern) =>
      findLiteralPattern(
        file,
        pattern,
        RULES.forbiddenSlotPattern,
        `Forbidden slot pattern "${pattern}" is present.`
      )
    ),
    ...checkDynamicSlots(file),
    ...checkKnownSlots(file),
  ];
}

function checkDynamicSlots(file: SourceFile): Violation[] {
  const violations: Violation[] = [];

  for (const pattern of dynamicDataSlotPatterns) {
    pattern.lastIndex = 0;

    for (const match of file.source.matchAll(pattern)) {
      const evidence = match[1] ?? match[0];
      const violation = toViolation(file, match.index ?? 0, {
        evidence,
        message: `Dynamic data-slot "${evidence}" is forbidden because slot identity must be registry-known.`,
        ruleId: RULES.dynamicSlot,
        severity: "error",
      });

      if (!isIgnored(file, violation.line)) {
        violations.push(violation);
      }
    }
  }

  return violations;
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
        message: `Unknown data-slot "${slot}" is forbidden because slot is not registered.`,
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
  const violations: Violation[] = [];
  let index = file.source.indexOf(pattern);

  while (index !== -1) {
    const violation = toViolation(file, index, {
      evidence: pattern,
      message,
      ruleId,
      severity: "error",
    });

    if (!isIgnored(file, violation.line)) {
      violations.push(violation);
    }

    index = file.source.indexOf(pattern, index + pattern.length);
  }

  return violations;
}

function registryViolation(
  ruleId: string,
  evidence: string,
  message: string
): Violation {
  return {
    ruleId,
    severity: "error",
    file: "registries/slot.registry.ts",
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
    .filter((path) => sourceFilePattern.test(path))
    .filter((path) => {
      const relativePath = normalizePath(relative(packageRoot, path));

      return !(
        relativePath.startsWith("components/ui/") ||
        relativePath.startsWith("contracts/") ||
        relativePath.startsWith("scripts/") ||
        relativePath.startsWith("test/") ||
        relativePath.endsWith(".test.ts") ||
        relativePath.endsWith(".test.tsx")
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

  return SLOT_IGNORE_NEXT_LINE_RE.test(previousLine);
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
