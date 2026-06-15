import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  blockComponentIds,
  blockScorecards,
  componentScorecards,
  primitiveComponentIds,
  primitiveScorecards,
} from "../contracts/component-scorecards.contract";

const root = fileURLToPath(new URL("..", import.meta.url));
const primitiveDir = join(root, "components", "afenda-ui");
const blockIndexPath = join(root, "components", "blocks", "index.ts");
const storyRoot = join(root, "..", "..", "apps", "storybook", "stories");
const storyExtension = /\.stories\.tsx$/;
const componentExtension = /\.tsx$/;
const componentExportNamePattern = /^[A-Z]\w+$/;
const valueExportBlockPattern = /export\s+\{([\s\S]*?)\}\s+from/gm;
const readinessLevelPattern = /covered|manual|not-applicable/;
const densityFitPattern = /comfortable|dense|fixed-format/;
const overflowBehaviorPattern =
  /bounded|horizontal-scroll|responsive-wrap|viewport-managed/;
const ownerPattern = /design-system|metadata-platform|workflow-blocks/;
const statusPattern = /ready|watch|needs-work/;

describe("component scorecards", () => {
  it("covers every afenda primitive component file", () => {
    const primitiveFiles = readdirSync(primitiveDir)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => file.replace(componentExtension, ""))
      .sort();

    expect([...primitiveComponentIds].sort()).toEqual(primitiveFiles);
  });

  it("covers every documented block component export", () => {
    const blockIndex = readFileSync(blockIndexPath, "utf8");
    const exportedComponents = [...blockIndex.matchAll(valueExportBlockPattern)]
      .flatMap((match) => match[1].split(","))
      .map((name) => name.trim())
      .filter((name) => componentExportNamePattern.test(name))
      .sort();

    expect([...blockComponentIds].sort()).toEqual(exportedComponents);
  });

  it("keeps a single readiness record for each primitive and block", () => {
    const scorecardIds = componentScorecards.map((scorecard) => scorecard.id);
    const uniqueIds = new Set(scorecardIds);

    expect(uniqueIds.size).toBe(scorecardIds.length);
    expect(scorecardIds.sort()).toEqual(
      [...primitiveComponentIds, ...blockComponentIds].sort()
    );
  });

  it("records release readiness fields for each scorecard", () => {
    for (const scorecard of componentScorecards) {
      expect(scorecard.statesCovered.length).toBeGreaterThan(0);
      expect(scorecard.keyboardSupport).toMatch(readinessLevelPattern);
      expect(scorecard.a11yLabels).toMatch(readinessLevelPattern);
      expect(scorecard.reducedMotion).toMatch(readinessLevelPattern);
      expect(scorecard.densityFit).toMatch(densityFitPattern);
      expect(scorecard.overflowBehavior).toMatch(overflowBehaviorPattern);
      expect(scorecard.visualBaselineStory).not.toHaveLength(0);
      expect(scorecard.owner).toMatch(ownerPattern);
      expect(scorecard.status).toMatch(statusPattern);
    }
  });

  it("links every scorecard to an available Storybook baseline family", () => {
    const storySources = collectStorySources(storyRoot);

    for (const scorecard of [...primitiveScorecards, ...blockScorecards]) {
      const storyFamily = scorecard.visualBaselineStory.split("/").at(0);

      expect(storyFamily).toBeDefined();
      expect(
        storySources.some((source) => source.includes(`title: "${storyFamily}`))
      ).toBe(true);
    }
  });
});

function collectStorySources(path: string): string[] {
  if (!existsSync(path)) {
    return [];
  }

  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(path, entry.name);

    if (entry.isDirectory()) {
      return collectStorySources(entryPath);
    }

    if (!storyExtension.test(entry.name)) {
      return [];
    }

    return readFileSync(entryPath, "utf8");
  });
}
