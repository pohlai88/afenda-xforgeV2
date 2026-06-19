#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AFENDA_AI_DRIFT_SCORE_GATE,
  AFENDA_AI_REQUIRED_CONTRACTS,
  AFENDA_AI_VIBE_CODING_GATE,
} from "../contracts/afenda-design-system.contract.ts";

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

interface DriftScoreResult {
  readonly files: readonly {
    readonly file: string;
    readonly score: number;
    readonly passed: boolean;
  }[];
  readonly passed: boolean;
  readonly score: number;
}

const RULES = {
  missingContract: "design-system/no-missing-contract",
  missingGovernanceScript: "design-system/no-missing-governance-script",
  invalidGovernanceJson: "design-system/no-invalid-governance-json",
  governanceScriptFailed: "design-system/no-failing-governance-script",
  scoreBelowGate: "design-system/no-score-below-gate",
} as const;

const scriptPath = fileURLToPath(import.meta.url);
const scriptsRoot = dirname(scriptPath);
const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const outputJson = process.argv.includes("--json");
const strict = process.argv.includes("--strict");
const driftScoreScript = "check-drift-score.ts";
const requiredGovernanceScripts = [
  "check-token-governance.ts",
  "check-recipe-governance.ts",
  "check-component-governance.ts",
  "check-slot-governance.ts",
  "check-variant-governance.ts",
  "check-classname-governance.ts",
  "check-example-governance.ts",
] as const;

const violations = [
  ...checkRequiredContracts(),
  ...checkRequiredGovernanceScripts(),
  ...runGovernanceScripts(),
].sort(sortViolations);

const driftScoreResult = runDriftScore();
const score = driftScoreResult?.score ?? 0;
const minimumScore = Math.max(
  AFENDA_AI_DRIFT_SCORE_GATE.minimumScore,
  AFENDA_AI_VIBE_CODING_GATE.minimumScore
);
const scoreViolations = createScoreViolations(driftScoreResult);
const finalViolations = [...violations, ...scoreViolations].sort(
  sortViolations
);
const finalErrorCount = finalViolations.filter(
  (violation) => violation.severity === "error"
).length;
const finalWarningCount = finalViolations.filter(
  (violation) => violation.severity === "warning"
).length;
const passed = finalErrorCount === 0 && (!strict || finalWarningCount === 0);

if (outputJson) {
  console.log(JSON.stringify({ passed, violations: finalViolations }, null, 2));
  process.exit(passed ? 0 : 1);
}

if (!passed) {
  console.error("Design system governance failed.");
  console.error("");
  console.error(`Score: ${score}`);
  console.error(`Errors: ${finalErrorCount}`);
  console.error(`Warnings: ${finalWarningCount}`);

  for (const violation of finalViolations) {
    console.error("");
    console.error(
      `${violation.file}:${violation.line}:${violation.column} ${violation.ruleId}`
    );
    console.error(violation.message);
  }

  process.exit(1);
}

console.log("Design system governance passed.");
console.log("");
console.log(`Score: ${score}`);
console.log(`Errors: ${finalErrorCount}`);
console.log(`Warnings: ${finalWarningCount}`);

function checkRequiredContracts(): Violation[] {
  return AFENDA_AI_REQUIRED_CONTRACTS.flatMap((contract) => {
    const contractPath = join(packageRoot, "contracts", contract);

    if (existsSync(contractPath)) {
      return [];
    }

    return [
      registryViolation({
        evidence: contract,
        message: `Required design-system contract "${contract}" is missing.`,
        ruleId: RULES.missingContract,
        severity: "error",
      }),
    ];
  });
}

function checkRequiredGovernanceScripts(): Violation[] {
  return [...requiredGovernanceScripts, driftScoreScript].flatMap((script) => {
    const governanceScriptPath = join(scriptsRoot, script);

    if (existsSync(governanceScriptPath)) {
      return [];
    }

    return [
      registryViolation({
        evidence: script,
        message: `Required design-system governance script "${script}" is missing.`,
        ruleId: RULES.missingGovernanceScript,
        severity: "error",
      }),
    ];
  });
}

function runDriftScore(): DriftScoreResult | undefined {
  const driftScorePath = join(scriptsRoot, driftScoreScript);

  if (!existsSync(driftScorePath)) {
    return undefined;
  }

  const result = spawnSync(
    process.execPath,
    [driftScorePath, "--json", ...(strict ? ["--strict"] : [])],
    {
      cwd: packageRoot,
      encoding: "utf8",
    }
  );

  return parseDriftScoreResult(result.stdout);
}

function createScoreViolations(
  result: DriftScoreResult | undefined
): Violation[] {
  if (!result) {
    return [
      scriptViolation(driftScoreScript, {
        evidence: driftScoreScript,
        message: `Drift scoring script "${driftScoreScript}" did not emit valid JSON output.`,
        ruleId: RULES.invalidGovernanceJson,
        severity: "error",
      }),
    ];
  }

  return result.files
    .filter((file) => !file.passed)
    .map((file) => ({
      ruleId: RULES.scoreBelowGate,
      severity: "error",
      file: file.file,
      line: 1,
      column: 1,
      evidence: String(file.score),
      message: `Component drift score ${file.score} is below required minimum ${minimumScore}.`,
    }));
}

function runGovernanceScripts(): Violation[] {
  return requiredGovernanceScripts.flatMap((script) => {
    const governanceScriptPath = join(scriptsRoot, script);

    if (!existsSync(governanceScriptPath)) {
      return [];
    }

    const result = spawnSync(
      process.execPath,
      [governanceScriptPath, "--json", ...(strict ? ["--strict"] : [])],
      {
        cwd: packageRoot,
        encoding: "utf8",
      }
    );

    if (!result.stdout.trim()) {
      return [
        scriptViolation(script, {
          evidence: result.stderr.trim() || String(result.status ?? "unknown"),
          message: `Governance script "${script}" did not emit JSON output.`,
          ruleId: RULES.invalidGovernanceJson,
          severity: "error",
        }),
      ];
    }

    const parsed = parseGovernanceResult(script, result.stdout);

    if (!parsed) {
      return [
        scriptViolation(script, {
          evidence: result.stdout.trim(),
          message: `Governance script "${script}" emitted invalid JSON output.`,
          ruleId: RULES.invalidGovernanceJson,
          severity: "error",
        }),
      ];
    }

    if (parsed.violations.length > 0) {
      return parsed.violations.map((violation) => ({
        ...violation,
        message: `[${script}] ${violation.message}`,
      }));
    }

    if (!parsed.passed || result.status !== 0) {
      return [
        scriptViolation(script, {
          evidence: String(result.status ?? "unknown"),
          message: `Governance script "${script}" failed without reporting a violation.`,
          ruleId: RULES.governanceScriptFailed,
          severity: "error",
        }),
      ];
    }

    return [];
  });
}

function parseGovernanceResult(
  _script: string,
  output: string
): GovernanceResult | undefined {
  try {
    const parsed: unknown = JSON.parse(output);

    if (!isGovernanceResultShape(parsed)) {
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

function parseDriftScoreResult(output: string): DriftScoreResult | undefined {
  try {
    const parsed: unknown = JSON.parse(output);

    if (!isRecord(parsed)) {
      return undefined;
    }

    if (
      typeof parsed.passed !== "boolean" ||
      typeof parsed.score !== "number" ||
      !Array.isArray(parsed.files)
    ) {
      return undefined;
    }

    return {
      passed: parsed.passed,
      score: parsed.score,
      files: parsed.files.filter(isDriftFileScore),
    };
  } catch {
    return undefined;
  }
}

function isDriftFileScore(value: unknown): value is {
  readonly file: string;
  readonly score: number;
  readonly passed: boolean;
} {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.file === "string" &&
    typeof value.score === "number" &&
    typeof value.passed === "boolean"
  );
}

function isGovernanceResultShape(value: unknown): value is {
  readonly passed: boolean;
  readonly violations: readonly unknown[];
} {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.passed === "boolean" && Array.isArray(value.violations);
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

function registryViolation(details: {
  readonly evidence: string;
  readonly message: string;
  readonly ruleId: string;
  readonly severity: Severity;
}): Violation {
  return {
    ruleId: details.ruleId,
    severity: details.severity,
    file: "contracts/afenda-design-system.contract.ts",
    line: 1,
    column: 1,
    evidence: details.evidence,
    message: details.message,
  };
}

function scriptViolation(
  script: string,
  details: {
    readonly evidence: string;
    readonly message: string;
    readonly ruleId: string;
    readonly severity: Severity;
  }
): Violation {
  return {
    ruleId: details.ruleId,
    severity: details.severity,
    file: normalizePath(relative(packageRoot, join(scriptsRoot, script))),
    line: 1,
    column: 1,
    evidence: details.evidence,
    message: details.message,
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
