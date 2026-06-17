import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  evaluateUiCraftFindings,
  parseUiCraftFindings,
  summarizeUiCraftFindings,
} from "../governance/ui-craft-exceptions.mjs";

const root = process.cwd();
const fixturePath = "packages/design-system/components/afenda-ui/demo.tsx";
const absoluteFixturePath = join(root, fixturePath);
const hoverMessage = ["hover state without", "focus-visible"].join(" ");

function createFinding(message = hoverMessage) {
  return {
    file: absoluteFixturePath,
    line: 12,
    message,
  };
}

function createException(overrides = {}) {
  return {
    category: "recipe-composition",
    evidence: "focusRecipe",
    message: hoverMessage,
    path: fixturePath,
    reason: "Fixture proves focus-visible through the focus recipe.",
    ...overrides,
  };
}

function evaluate({
  exceptions = [createException()],
  findings = [createFinding()],
  source = 'recipe("focusRingOnly")',
  fileExists = () => true,
  budget = {
    total: 1,
    byCategory: { "recipe-composition": 1 },
    byMessage: { [hoverMessage]: 1 },
  },
} = {}) {
  return evaluateUiCraftFindings({
    budget,
    exceptions,
    fileExists,
    findings,
    readSource: () => source,
    root,
  });
}

describe("ui-craft exception governance", () => {
  it("parses detector output into stable findings", () => {
    const findings = parseUiCraftFindings(
      [`${fixturePath}:12`, `  ● ${hoverMessage} — details`].join("\n"),
      root
    );

    expect(findings).toEqual([
      {
        file: absoluteFixturePath,
        line: 12,
        message: hoverMessage,
      },
    ]);
  });

  it("parses app and Storybook detector paths", () => {
    const storyPath = "apps/storybook/stories/afenda-ui/demo.stories.tsx";
    const findings = parseUiCraftFindings(
      [`${storyPath}:7`, `  ● ${hoverMessage} — details`].join("\n"),
      root
    );

    expect(findings).toEqual([
      {
        file: join(root, storyPath),
        line: 7,
        message: hoverMessage,
      },
    ]);
  });

  it("ignores a known finding only when matching evidence exists", () => {
    const result = evaluate();

    expect(result.actionable).toEqual([]);
    expect(result.ignored).toHaveLength(1);
    expect(result.violations).toEqual([]);
  });

  it("fails a known finding when evidence is removed", () => {
    const result = evaluate({ source: "text-text-primary" });

    expect(result.actionable).toHaveLength(1);
    expect(result.violations.map((violation) => violation.rule)).toContain(
      "missing-evidence"
    );
  });

  it("fails stale exceptions that no longer match detector output", () => {
    const result = evaluate({ findings: [] });

    expect(result.violations.map((violation) => violation.rule)).toContain(
      "stale-exception"
    );
  });

  it("fails exception count drift for repeated findings in one file", () => {
    const result = evaluate({
      exceptions: [
        createException({
          counts: {
            [fixturePath]: 2,
          },
        }),
      ],
    });

    expect(result.violations.map((violation) => violation.rule)).toContain(
      "exception-count-drift"
    );
  });

  it("fails missing exception files", () => {
    const result = evaluate({ fileExists: () => false });

    expect(result.violations.map((violation) => violation.rule)).toContain(
      "missing-exception-file"
    );
  });

  it("fails ignored-count growth above the baseline", () => {
    const result = evaluate({
      budget: {
        total: 0,
        byCategory: { "recipe-composition": 0 },
        byMessage: { [hoverMessage]: 0 },
      },
    });

    expect(result.violations.map((violation) => violation.rule)).toContain(
      "false-positive-budget-exceeded"
    );
  });

  it("rejects raw path-only exceptions", () => {
    const result = evaluate({
      exceptions: [{ path: fixturePath }],
    });

    expect(result.violations.map((violation) => violation.rule)).toContain(
      "invalid-exception"
    );
  });

  it("preserves verbose ignored-finding summaries", () => {
    const result = evaluate();

    expect(summarizeUiCraftFindings(result.ignored)).toBe(
      "1 hover state without focus-visible"
    );
  });
});
