#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AFENDA_AI_DRIFT_SCORE_GATE,
  AFENDA_AI_VIBE_CODING_GATE,
} from "../contracts/afenda-design-system.contract.ts";

const TS_EXTENSION_RE = /\.tsx?$/;

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

interface GovernanceResult {
  readonly passed: boolean;
  readonly violations: readonly Violation[];
}

interface FileScore {
  readonly file: string;
  readonly passed: boolean;
  readonly score: number;
  readonly violations: readonly ScoredViolation[];
}

interface ScoredViolation extends Violation {
  readonly penalty: number;
}

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const scriptsRoot = fileURLToPath(new URL(".", import.meta.url));
const outputJson = process.argv.includes("--json");
const strict = process.argv.includes("--strict");
const minimumScore = Math.max(
  AFENDA_AI_DRIFT_SCORE_GATE.minimumScore,
  AFENDA_AI_VIBE_CODING_GATE.minimumScore
);
const governanceScripts = [
  "check-token-governance.ts",
  "check-recipe-governance.ts",
  "check-component-governance.ts",
  "check-slot-governance.ts",
  "check-variant-governance.ts",
  "check-classname-governance.ts",
  "check-example-governance.ts",
] as const;

const violations = collectGovernanceViolations().sort(sortViolations);
const files = scoreFiles(violations);
const packageScore = files.length
  ? Math.min(...files.map((file) => file.score))
  : 100;
const passed = files.every((file) => file.passed);

if (outputJson) {
  console.log(
    JSON.stringify(
      { passed, minimumScore, score: packageScore, files },
      null,
      2
    )
  );
  process.exit(passed ? 0 : 1);
}

for (const file of files) {
  console.log(displayName(file.file));
  console.log("");
  console.log(`Score: ${file.score}`);
  console.log("");
  console.log(file.passed ? "PASS" : "FAIL");
  console.log("");
}

process.exit(passed ? 0 : 1);

function collectGovernanceViolations(): Violation[] {
  return governanceScripts.flatMap((script) => {
    const scriptPath = join(scriptsRoot, script);

    if (!existsSync(scriptPath)) {
      return [];
    }

    const result = spawnSync(
      process.execPath,
      [scriptPath, "--json", ...(strict ? ["--strict"] : [])],
      {
        cwd: packageRoot,
        encoding: "utf8",
      }
    );

    const parsed = parseGovernanceResult(result.stdout);

    if (!parsed) {
      return [
        {
          ruleId: "drift-score/no-invalid-governance-json",
          severity: "error",
          file: normalizePath(relative(packageRoot, scriptPath)),
          line: 1,
          column: 1,
          evidence: result.stdout.trim() || result.stderr.trim(),
          message: `Governance script "${script}" did not emit valid JSON.`,
        },
      ];
    }

    return parsed.violations;
  });
}

function scoreFiles(violations: readonly Violation[]): FileScore[] {
  const grouped = new Map<string, ScoredViolation[]>();

  for (const violation of violations) {
    const scoredViolation = {
      ...violation,
      penalty: penaltyFor(violation),
    };
    grouped.set(violation.file, [
      ...(grouped.get(violation.file) ?? []),
      scoredViolation,
    ]);
  }

  for (const file of scanComponentFiles()) {
    if (!grouped.has(file)) {
      grouped.set(file, []);
    }
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, fileViolations]) => {
      const score = Math.max(
        0,
        100 -
          fileViolations.reduce(
            (total, violation) => total + violation.penalty,
            0
          )
      );

      return {
        file,
        score,
        passed: score >= minimumScore,
        violations: fileViolations.sort(sortScoredViolations),
      };
    });
}

function penaltyFor(violation: Violation): number {
  if (
    violation.severity === "warning" &&
    !(strict && violation.ruleId.startsWith("example/"))
  ) {
    return 5;
  }

  if (
    violation.ruleId.startsWith("example/") ||
    violation.ruleId.includes("stale")
  ) {
    return 10;
  }

  if (
    violation.ruleId.startsWith("classname/") ||
    violation.ruleId.endsWith("no-invalid-slot-name") ||
    violation.ruleId.endsWith("no-invalid-slot-pattern")
  ) {
    return 5;
  }

  if (
    violation.ruleId.includes("raw") ||
    violation.ruleId.includes("private") ||
    violation.ruleId.includes("internal") ||
    violation.ruleId.includes("server-action") ||
    violation.ruleId.includes("database-import") ||
    violation.ruleId.includes("environment-read") ||
    violation.ruleId.includes("data-fetching") ||
    violation.ruleId.includes("css-variable")
  ) {
    return 20;
  }

  if (
    violation.ruleId.includes("slot") ||
    violation.ruleId.includes("variant") ||
    violation.ruleId.includes("recipe") ||
    violation.ruleId.includes("missing")
  ) {
    return 15;
  }

  return 5;
}

function scanComponentFiles(): string[] {
  return walk(join(packageRoot, "components"))
    .filter((path) => path.endsWith(".tsx"))
    .map((path) => normalizePath(relative(packageRoot, path)))
    .sort((a, b) => a.localeCompare(b));
}

function walk(path: string): string[] {
  if (!existsSync(path)) {
    return [];
  }

  const stats = statSync(path);

  if (!stats.isDirectory()) {
    return [path];
  }

  if (basename(path) === "node_modules") {
    return [];
  }

  return readdirSync(path)
    .sort((a, b) => a.localeCompare(b))
    .flatMap((child) => walk(join(path, child)));
}

function parseGovernanceResult(output: string): GovernanceResult | undefined {
  try {
    const parsed: unknown = JSON.parse(output);

    if (!isRecord(parsed)) {
      return undefined;
    }

    if (
      typeof parsed.passed !== "boolean" ||
      !Array.isArray(parsed.violations)
    ) {
      return undefined;
    }

    return {
      passed: parsed.passed,
      violations: parsed.violations.filter(isViolation),
    };
  } catch {
    return undefined;
  }
}

function isViolation(value: unknown): value is Violation {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.ruleId === "string" &&
    (value.severity === "error" || value.severity === "warning") &&
    typeof value.file === "string" &&
    typeof value.line === "number" &&
    typeof value.column === "number" &&
    typeof value.evidence === "string" &&
    typeof value.message === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function displayName(file: string): string {
  const filename = file.split("/").at(-1) ?? file;
  const stem = filename.replace(TS_EXTENSION_RE, "");
  const extension = filename.slice(stem.length);

  return `${stem
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("")}${extension}`;
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

function sortScoredViolations(a: ScoredViolation, b: ScoredViolation): number {
  return sortViolations(a, b) || b.penalty - a.penalty;
}
