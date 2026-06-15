import { describe, expect, it } from "vitest";

import {
  contributionEvidenceValues,
  contributionLayerEntries,
  contributionLayerIds,
  contributionLayers,
  contributionLifecycleEntries,
  contributionLifecycleStageIds,
} from "../contracts/contribution-lifecycle.contract";

describe("contribution lifecycle contract", () => {
  it("keeps the Afenda contribution layers stable", () => {
    expect(contributionLayerIds).toEqual([
      "core",
      "extended",
      "app-local",
      "out-of-scope",
    ]);
    expect(new Set(contributionLayerIds).size).toBe(
      contributionLayerIds.length
    );
    expect(contributionLayerEntries.map((layer) => layer.id)).toEqual([
      ...contributionLayerIds,
    ]);
  });

  it("keeps core stricter than extended and app-local", () => {
    expect(contributionLayers.core.requiredEvidence).toEqual([
      "typed-contract",
      "storybook-story",
      "scorecard",
      "docs",
      "tests",
      "quality-gate",
      "owner",
      "migration-note",
    ]);
    expect(contributionLayers.extended.requiredEvidence).toContain("owner");
    expect(contributionLayers.extended.requiredEvidence).toContain("tests");
    expect(contributionLayers["app-local"].requiredEvidence).toEqual([
      "owner",
      "docs",
    ]);
    expect(contributionLayers["out-of-scope"].scopeRule).toContain(
      "persistence"
    );
  });

  it("defines an ordered lifecycle from proposal through promotion or retirement", () => {
    expect(contributionLifecycleStageIds).toEqual([
      "define",
      "classify",
      "build",
      "document",
      "validate",
      "adopt",
      "promote-or-retire",
    ]);
    expect(contributionLifecycleEntries.map((stage) => stage.id)).toEqual([
      ...contributionLifecycleStageIds,
    ]);

    for (const stage of contributionLifecycleEntries) {
      expect(stage.decision).not.toHaveLength(0);
      expect(stage.output).not.toHaveLength(0);
    }
  });

  it("keeps all required evidence values registered", () => {
    const requiredEvidence = new Set(
      contributionLayerEntries.flatMap((layer) => layer.requiredEvidence)
    );

    expect([...requiredEvidence].sort()).toEqual(
      [...contributionEvidenceValues].sort()
    );
  });
});
