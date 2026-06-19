#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { afendaRecipe } from "../components/afenda-ui/recipes.ts";
import { afendaBlockRecipe } from "../components/blocks/block-recipes.ts";
import { AFENDA_RECIPE_FORBIDDEN_PATTERNS } from "../contracts/afenda-recipe.contract.ts";
import {
  AFENDA_BLOCK_RECIPE_IDENTITY_REGISTRY,
  AFENDA_RECIPE_IDENTITY_REGISTRY,
} from "../registries/recipe.registry.ts";

const NEWLINE_RE = /\r?\n/;
const RECIPE_IGNORE_NEXT_LINE_RE =
  /^\s*\/\/ afenda-recipe-ignore-next-line -- \S.+$/;

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
  unknownRecipeIdentity: "recipe/no-unknown-recipe-identity",
  missingRecipeImplementation: "recipe/no-missing-recipe-implementation",
  forbiddenPattern: "recipe/no-forbidden-pattern",
  dynamicRecipeId: "recipe/no-dynamic-recipe-id",
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
const dynamicRecipeIdPattern = /\b(?:recipe|blockRecipe)\s*\(\s*(?!["'])/g;

const violations = [
  ...checkRecipeRegistries(),
  ...scanFiles().flatMap(checkRecipeFile),
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
  console.error("Recipe governance failed.");
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

console.log("Recipe governance passed.");
console.log("");
console.log(`Score: ${score}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);

function checkRecipeRegistries(): Violation[] {
  const violations: Violation[] = [];
  const implementedRecipes = Object.keys(afendaRecipe);
  const implementedBlockRecipes = Object.keys(afendaBlockRecipe);
  const registeredRecipes = new Set<string>(AFENDA_RECIPE_IDENTITY_REGISTRY);
  const registeredBlockRecipes = new Set<string>(
    AFENDA_BLOCK_RECIPE_IDENTITY_REGISTRY
  );

  for (const recipeId of implementedRecipes) {
    if (!registeredRecipes.has(recipeId)) {
      violations.push(
        registryViolation(
          RULES.unknownRecipeIdentity,
          "components/afenda-ui/recipes.ts",
          recipeId,
          `Recipe identity "${recipeId}" is implemented but not registered in the recipe registry.`
        )
      );
    }
  }

  for (const recipeId of AFENDA_RECIPE_IDENTITY_REGISTRY) {
    if (!implementedRecipes.includes(recipeId)) {
      violations.push(
        registryViolation(
          RULES.missingRecipeImplementation,
          "components/afenda-ui/recipes.ts",
          recipeId,
          `Recipe identity "${recipeId}" is registered but has no implementation.`
        )
      );
    }
  }

  for (const recipeId of implementedBlockRecipes) {
    if (!registeredBlockRecipes.has(recipeId)) {
      violations.push(
        registryViolation(
          RULES.unknownRecipeIdentity,
          "components/blocks/block-recipes.ts",
          recipeId,
          `Block recipe identity "${recipeId}" is implemented but not registered in the recipe registry.`
        )
      );
    }
  }

  for (const recipeId of AFENDA_BLOCK_RECIPE_IDENTITY_REGISTRY) {
    if (!implementedBlockRecipes.includes(recipeId)) {
      violations.push(
        registryViolation(
          RULES.missingRecipeImplementation,
          "components/blocks/block-recipes.ts",
          recipeId,
          `Block recipe identity "${recipeId}" is registered but has no implementation.`
        )
      );
    }
  }

  return violations;
}

function checkRecipeFile(file: SourceFile): Violation[] {
  return [
    ...AFENDA_RECIPE_FORBIDDEN_PATTERNS.flatMap((pattern) =>
      findLiteralPattern(file, pattern)
    ),
    ...findMatches(
      file,
      dynamicRecipeIdPattern,
      RULES.dynamicRecipeId,
      (evidence) => ({
        evidence,
        message: `Dynamic recipe call "${evidence.trim()}" is forbidden because recipe identity must be stable.`,
      })
    ),
  ];
}

function findLiteralPattern(file: SourceFile, pattern: string): Violation[] {
  const matches: Violation[] = [];
  let index = file.source.indexOf(pattern);

  while (index !== -1) {
    const violation = toViolation(file, index, {
      evidence: pattern,
      message: `Forbidden recipe pattern "${pattern}" is present.`,
      ruleId: RULES.forbiddenPattern,
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
    .filter((path) => sourceFilePattern.test(path))
    .filter((path) => isRecipeFile(normalizePath(relative(packageRoot, path))))
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

function isRecipeFile(path: string): boolean {
  return (
    path === "components/afenda-ui/recipes.ts" ||
    path === "components/blocks/block-recipes.ts" ||
    path.endsWith("-recipes.ts")
  );
}

function isIgnored(file: SourceFile, line: number): boolean {
  const previousLine = file.lines[line - 2];

  if (!previousLine) {
    return false;
  }

  return RECIPE_IGNORE_NEXT_LINE_RE.test(previousLine);
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
