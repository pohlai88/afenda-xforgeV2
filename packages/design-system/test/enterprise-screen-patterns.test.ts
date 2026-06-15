import { describe, expect, it } from "vitest";

import {
  enterpriseScreenPatternEntries,
  enterpriseScreenPatternGateValues,
  enterpriseScreenPatternIds,
  enterpriseScreenPatternStateValues,
  enterpriseScreenPatterns,
} from "../contracts/enterprise-screen-patterns.contract";

describe("enterprise screen patterns contract", () => {
  it("keeps the screen pattern catalog stable and ordered", () => {
    expect(enterpriseScreenPatternIds).toEqual([
      "approval-operations-screen",
      "batch-posting-screen",
      "tenant-master-detail-screen",
      "audit-evidence-review-screen",
      "policy-lock-administration-screen",
      "reconciliation-workspace-screen",
      "exception-triage-screen",
      "long-running-job-monitor-screen",
    ]);
    expect(new Set(enterpriseScreenPatternIds).size).toBe(
      enterpriseScreenPatternIds.length
    );
    expect(enterpriseScreenPatternEntries.map((pattern) => pattern.id)).toEqual(
      [...enterpriseScreenPatternIds]
    );
  });

  it("documents product-level assembly guidance for each screen", () => {
    for (const pattern of enterpriseScreenPatternEntries) {
      expect(pattern.anatomy.length, pattern.id).toBeGreaterThanOrEqual(5);
      expect(pattern.blocks.length, pattern.id).toBeGreaterThanOrEqual(5);
      expect(pattern.do.length, pattern.id).toBeGreaterThanOrEqual(3);
      expect(pattern.dont.length, pattern.id).toBeGreaterThanOrEqual(3);
      expect(pattern.states, pattern.id).toContain("ready");
      expect(pattern.gates, pattern.id).toContain("typecheck");
      expect(pattern.gates, pattern.id).toContain("storybook");
      expect(pattern.gates, pattern.id).toContain("overflow");
      expect(pattern.whenToUse, pattern.id).not.toHaveLength(0);
    }
  });

  it("requires diagnostics and audit payload gates for governed action screens", () => {
    const governedScreens = enterpriseScreenPatternEntries.filter(
      (pattern) => pattern.id !== "tenant-master-detail-screen"
    );

    for (const pattern of governedScreens) {
      expect(pattern.gates, pattern.id).toContain("diagnostics");
      expect(pattern.gates, pattern.id).toContain("audit-payload");
    }
  });

  it("registers every state and gate used by screen patterns", () => {
    const usedStates = new Set(
      enterpriseScreenPatternEntries.flatMap((pattern) => pattern.states)
    );
    const usedGates = new Set(
      enterpriseScreenPatternEntries.flatMap((pattern) => pattern.gates)
    );

    expect([...usedStates].sort()).toEqual(
      [...enterpriseScreenPatternStateValues].sort()
    );
    expect([...usedGates].sort()).toEqual(
      [...enterpriseScreenPatternGateValues].sort()
    );
  });

  it("keeps batch posting and empty-state rules explicit", () => {
    expect(enterpriseScreenPatterns["batch-posting-screen"].dont).toContain(
      "Do not use integrated table select-all when a toolbar bulk selector is present."
    );
    expect(
      enterpriseScreenPatterns["audit-evidence-review-screen"].do
    ).toContain("Use filtered-empty copy for no matching events after search.");
  });
});
