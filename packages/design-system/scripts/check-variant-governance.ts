#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AFENDA_COMPONENT_SIZE_VARIANTS,
  AFENDA_DENSITIES,
  AFENDA_EMPHASIS,
  AFENDA_FORBIDDEN_VARIANT_ALIASES,
  AFENDA_SIZES,
  AFENDA_STRUCTURAL_VARIANTS,
  AFENDA_TEXT_COLOR_VARIANTS,
  AFENDA_TONES,
  AFENDA_ACTION_VARIANTS,
} from "../registries/variant.registry.ts";

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
  duplicateVariant: "variant/no-duplicate-variant",
  invalidVariantName: "variant/no-invalid-variant-name",
  forbiddenAlias: "variant/no-forbidden-alias",
  unknownVariant: "variant/no-unknown-variant",
  dynamicVariant: "variant/no-dynamic-variant",
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
const variantNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const variantPropNames = [
  "variant",
  "tone",
  "intent",
  "color",
  "density",
  "emphasis",
  "size",
] as const;
type VariantPropName = (typeof variantPropNames)[number];
const variantAttributePattern =
  /\b(variant|tone|intent|color|density|emphasis|size)\s*=\s*["']([^"']+)["']/g;
const variantObjectPattern =
  /\b(variant|tone|intent|color|density|emphasis|size)\s*:\s*["']([^"']+)["']/g;
const dynamicVariantAttributePattern =
  /\b(variant|tone|intent|color|density|emphasis|size)\s*=\s*{\s*(?!["'`])[^}]+}/g;
const dataVariantSelectorPattern = /data-\[variant=([^\]]+)\]/g;

const allowedByProp = {
  color: AFENDA_TEXT_COLOR_VARIANTS,
  density: AFENDA_DENSITIES,
  emphasis: AFENDA_EMPHASIS,
  intent: AFENDA_ACTION_VARIANTS,
  size: [...AFENDA_SIZES, ...AFENDA_COMPONENT_SIZE_VARIANTS],
  tone: AFENDA_TONES,
  variant: [...AFENDA_ACTION_VARIANTS, ...AFENDA_STRUCTURAL_VARIANTS],
} as const satisfies Record<VariantPropName, readonly string[]>;
const aliasToCanonical = createAliasMap();
const sourceFiles = scanFiles();
const violations = [
  ...checkVariantRegistry(),
  ...sourceFiles.flatMap(checkVariantFile),
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
  console.error("Variant governance failed.");
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

console.log("Variant governance passed.");
console.log("");
console.log(`Score: ${score}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);

function checkVariantRegistry(): Violation[] {
  const violations: Violation[] = [];

  for (const [prop, variants] of Object.entries(allowedByProp)) {
    const seenVariants = new Set<string>();

    for (const variant of variants) {
      if (seenVariants.has(variant)) {
        violations.push(
          registryViolation(
            RULES.duplicateVariant,
            variant,
            `Variant "${variant}" is duplicated in the ${prop} variant registry.`
          )
        );
      }

      seenVariants.add(variant);

      if (!variantNamePattern.test(variant)) {
        violations.push(
          registryViolation(
            RULES.invalidVariantName,
            variant,
            `Variant "${variant}" must use stable kebab-case.`
          )
        );
      }
    }
  }

  return violations;
}

function checkVariantFile(file: SourceFile): Violation[] {
  return [
    ...checkLiteralVariants(file, variantAttributePattern),
    ...checkLiteralVariants(file, variantObjectPattern),
    ...checkDataVariantSelectors(file),
    ...checkDynamicVariants(file, dynamicVariantAttributePattern),
  ];
}

function checkLiteralVariants(file: SourceFile, pattern: RegExp): Violation[] {
  const violations: Violation[] = [];
  pattern.lastIndex = 0;

  for (const match of file.source.matchAll(pattern)) {
    const prop = match[1] ?? "";
    const variant = match[2] ?? "";

    if (!isVariantProp(prop) || isAllowedVariantForProp(prop, variant)) {
      continue;
    }

    const aliasTarget = aliasToCanonical.get(variant);
    const violation = toViolation(file, match.index ?? 0, {
      evidence: variant,
      message: aliasTarget
        ? `Variant alias "${variant}" is forbidden; use canonical "${aliasTarget}".`
        : `Unknown ${prop} variant "${variant}" is forbidden because ${prop} must use registry vocabulary.`,
      ruleId: aliasTarget ? RULES.forbiddenAlias : RULES.unknownVariant,
      severity: "error",
    });

    if (!isIgnored(file, violation.line)) {
      violations.push(violation);
    }
  }

  return violations;
}

function checkDataVariantSelectors(file: SourceFile): Violation[] {
  const violations: Violation[] = [];
  dataVariantSelectorPattern.lastIndex = 0;

  for (const match of file.source.matchAll(dataVariantSelectorPattern)) {
    const variant = match[1] ?? "";

    if (isAllowedVariantForProp("variant", variant)) {
      continue;
    }

    const aliasTarget = aliasToCanonical.get(variant);
    const violation = toViolation(file, match.index ?? 0, {
      evidence: variant,
      message: aliasTarget
        ? `Variant alias "${variant}" is forbidden; use canonical "${aliasTarget}".`
        : `Unknown variant selector "${variant}" is forbidden because variants must use registry vocabulary.`,
      ruleId: aliasTarget ? RULES.forbiddenAlias : RULES.unknownVariant,
      severity: "error",
    });

    if (!isIgnored(file, violation.line)) {
      violations.push(violation);
    }
  }

  return violations;
}

function checkDynamicVariants(file: SourceFile, pattern: RegExp): Violation[] {
  const violations: Violation[] = [];
  pattern.lastIndex = 0;

  for (const match of file.source.matchAll(pattern)) {
    const prop = match[1] ?? "";

    if (!isVariantProp(prop)) {
      continue;
    }

    const evidence = match[0];
    const violation = toViolation(file, match.index ?? 0, {
      evidence,
      message: `Dynamic ${prop} value "${evidence.trim()}" is forbidden because variant identity must be registry-known.`,
      ruleId: RULES.dynamicVariant,
      severity: "error",
    });

    if (!isIgnored(file, violation.line)) {
      violations.push(violation);
    }
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
    file: "registries/variant.registry.ts",
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

      return (
        !relativePath.startsWith("contracts/") &&
        !relativePath.startsWith("scripts/") &&
        !relativePath.startsWith("test/") &&
        !relativePath.endsWith(".test.ts") &&
        !relativePath.endsWith(".test.tsx")
      );
    })
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

function createAliasMap(): Map<string, string> {
  const aliases = new Map<string, string>();

  for (const [canonical, values] of Object.entries(
    AFENDA_FORBIDDEN_VARIANT_ALIASES
  )) {
    for (const alias of values) {
      aliases.set(alias, canonical);
    }
  }

  return aliases;
}

function isVariantProp(prop: string): prop is VariantPropName {
  return variantPropNames.includes(prop as VariantPropName);
}

function isAllowedVariantForProp(
  prop: VariantPropName,
  variant: string
): boolean {
  return (allowedByProp[prop] as readonly string[]).includes(variant);
}

function isIgnored(file: SourceFile, line: number): boolean {
  const previousLine = file.lines[line - 2];

  if (!previousLine) {
    return false;
  }

  return /^\s*\/\/ afenda-variant-ignore-next-line -- \S.+$/.test(
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
