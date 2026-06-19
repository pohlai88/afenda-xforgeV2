#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AFENDA_ALLOWED_CLASS_NAME_PREFIXES,
  AFENDA_CLASS_NAME_FORBIDDEN_PATTERNS,
  AFENDA_FORBIDDEN_CLASS_NAME_PREFIXES,
} from "../contracts/afenda-class-name-policy.contract.ts";

const NEWLINE_RE = /\r?\n/;
const CLASSNAME_IGNORE_NEXT_LINE_RE =
  /^\s*\/\/ afenda-classname-ignore-next-line -- \S.+$/;

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
  forbiddenPattern: "classname/no-forbidden-pattern",
  forbiddenPrefix: "classname/no-forbidden-prefix",
  nonLayoutClass: "classname/no-non-layout-class",
  arbitraryValue: "classname/no-arbitrary-value",
  dynamicClassName: "classname/no-dynamic-classname",
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
const classNameLiteralPatterns = [
  /className\s*=\s*"([^"]*)"/g,
  /className\s*=\s*'([^']*)'/g,
  /className\s*=\s*{`([^`]*)`}/g,
] as const;
const dynamicClassNamePattern = /className\s*=\s*{(?!\s*cn\s*\(|\s*`)[^}]+}/g;
const classTokenPattern = /\S+/g;
const variantPrefixPattern = /^(?:[a-z0-9_:[\]=.-]+:)+(.+)$/;
const arbitraryValuePattern = /\[[^\]\n\r]+\]/;

const sourceFiles = scanFiles();
const violations = sourceFiles
  .filter((file) => !isRecipeSource(file))
  .flatMap(checkClassNameFile)
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
  console.error("ClassName governance failed.");
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

console.log("ClassName governance passed.");
console.log("");
console.log(`Score: ${score}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);

function checkClassNameFile(file: SourceFile): Violation[] {
  return [...checkLiteralClassNames(file), ...checkDynamicClassNames(file)];
}

function checkLiteralClassNames(file: SourceFile): Violation[] {
  const violations: Violation[] = [];

  for (const pattern of classNameLiteralPatterns) {
    pattern.lastIndex = 0;

    for (const match of file.source.matchAll(pattern)) {
      const className = match[1] ?? "";
      const classNameOffset = (match.index ?? 0) + match[0].indexOf(className);
      violations.push(...checkClassNameValue(file, className, classNameOffset));
    }
  }

  return violations;
}

function checkClassNameValue(
  file: SourceFile,
  className: string,
  classNameOffset: number
): Violation[] {
  const violations: Violation[] = [];
  classTokenPattern.lastIndex = 0;

  for (const match of className.matchAll(classTokenPattern)) {
    const rawToken = match[0];
    const token = stripVariantPrefixes(rawToken);
    const tokenIndex = classNameOffset + (match.index ?? 0);

    const forbiddenPattern = AFENDA_CLASS_NAME_FORBIDDEN_PATTERNS.find(
      (pattern) => token.includes(pattern)
    );

    if (forbiddenPattern) {
      pushViolation(
        violations,
        ignoredAwareViolation(file, tokenIndex, {
          evidence: rawToken,
          message: `Forbidden className pattern "${forbiddenPattern}" is present.`,
          ruleId: RULES.forbiddenPattern,
        })
      );
      continue;
    }

    if (arbitraryValuePattern.test(token) && !token.includes("var(--")) {
      pushViolation(
        violations,
        ignoredAwareViolation(file, tokenIndex, {
          evidence: rawToken,
          message: `Arbitrary className value "${rawToken}" is forbidden unless it references a token.`,
          ruleId: RULES.arbitraryValue,
        })
      );
      continue;
    }

    const forbiddenPrefix = AFENDA_FORBIDDEN_CLASS_NAME_PREFIXES.find(
      (prefix) => token.startsWith(prefix)
    );

    if (forbiddenPrefix) {
      pushViolation(
        violations,
        ignoredAwareViolation(file, tokenIndex, {
          evidence: rawToken,
          message: `className token "${rawToken}" uses forbidden prefix "${forbiddenPrefix}" because className owns layout only.`,
          ruleId: RULES.forbiddenPrefix,
        })
      );
      continue;
    }

    if (!isAllowedLayoutToken(token)) {
      pushViolation(
        violations,
        ignoredAwareViolation(file, tokenIndex, {
          evidence: rawToken,
          message: `className token "${rawToken}" is not allowed by the layout-only className policy.`,
          ruleId: RULES.nonLayoutClass,
        })
      );
    }
  }

  return violations;
}

function pushViolation(
  violations: Violation[],
  violation: Violation | undefined
): void {
  if (violation) {
    violations.push(violation);
  }
}

function checkDynamicClassNames(file: SourceFile): Violation[] {
  const violations: Violation[] = [];
  dynamicClassNamePattern.lastIndex = 0;

  for (const match of file.source.matchAll(dynamicClassNamePattern)) {
    const evidence = match[0];
    const violation = ignoredAwareViolation(file, match.index ?? 0, {
      evidence,
      message:
        "Dynamic className values are forbidden because className is a layout-only escape hatch.",
      ruleId: RULES.dynamicClassName,
    });

    if (violation) {
      violations.push(violation);
    }
  }

  return violations;
}

function ignoredAwareViolation(
  file: SourceFile,
  index: number,
  details: {
    readonly evidence: string;
    readonly message: string;
    readonly ruleId: string;
  }
): Violation | undefined {
  const violation = toViolation(file, index, {
    ...details,
    severity: "error",
  });

  if (isIgnored(file, violation.line)) {
    return undefined;
  }

  return violation;
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

function stripVariantPrefixes(token: string): string {
  return token.match(variantPrefixPattern)?.[1] ?? token;
}

function isAllowedLayoutToken(token: string): boolean {
  return AFENDA_ALLOWED_CLASS_NAME_PREFIXES.some(
    (prefix) => token === prefix || token.startsWith(prefix)
  );
}

function isRecipeSource(file: SourceFile): boolean {
  return (
    file.relativePath.endsWith("/recipes.ts") ||
    file.relativePath.endsWith("-recipes.ts") ||
    file.relativePath.endsWith("/block-recipes.ts")
  );
}

function isIgnored(file: SourceFile, line: number): boolean {
  const previousLine = file.lines[line - 2];

  if (!previousLine) {
    return false;
  }

  return CLASSNAME_IGNORE_NEXT_LINE_RE.test(previousLine);
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
