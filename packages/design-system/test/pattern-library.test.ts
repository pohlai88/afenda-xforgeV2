import { describe, expect, it } from "vitest";
import {
  afendaPatternIds,
  afendaPatternLibrary,
  afendaPatternLibraryEntries,
} from "../contracts/pattern-library.contract";

describe("Afenda pattern library contract", () => {
  it("keeps every required ERP pattern registered exactly once", () => {
    expect(afendaPatternIds).toEqual([
      "approval-review",
      "batch-posting",
      "primary-detail",
      "audit-log-viewer",
      "exception-handling",
      "bulk-selection",
      "data-reconciliation",
      "policy-lock",
      "long-running-job",
    ]);
    expect(new Set(afendaPatternIds).size).toBe(afendaPatternIds.length);
    expect(afendaPatternLibraryEntries.map((pattern) => pattern.id)).toEqual([
      ...afendaPatternIds,
    ]);
    expect(Object.keys(afendaPatternLibrary).sort()).toEqual(
      [...afendaPatternIds].sort()
    );
  });

  it("keeps every pattern actionable for app teams", () => {
    for (const pattern of afendaPatternLibraryEntries) {
      expect(pattern.name, pattern.id).toBeTruthy();
      expect(pattern.whenToUse, pattern.id).toBeTruthy();
      expect(pattern.description, pattern.id).toBeTruthy();
      expect(pattern.requiredBlocks.length, pattern.id).toBeGreaterThanOrEqual(
        3
      );
      expect(pattern.requiredStates.length, pattern.id).toBeGreaterThanOrEqual(
        4
      );
      expect(pattern.evidenceRule, pattern.id).toBeTruthy();
      expect(pattern.auditRule, pattern.id).toBeTruthy();
      expect(pattern.riskRule, pattern.id).toBeTruthy();
    }
  });
});
