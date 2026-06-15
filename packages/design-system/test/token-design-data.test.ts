import { describe, expect, it } from "vitest";
import tokens from "../tokens/tokens.json";

const requiredTokenCategories = [
  "color",
  "radius",
  "spacing",
  "layout",
  "typography",
  "shadow",
  "motion",
  "zIndex",
] as const;

describe("token design data contract", () => {
  it("keeps category metadata for every token category", () => {
    expect(Object.keys(tokens.metadata.categories).sort()).toEqual(
      [...requiredTokenCategories].sort()
    );

    for (const category of requiredTokenCategories) {
      const metadata = tokens.metadata.categories[category];

      expect(metadata.description, category).toBeTruthy();
      expect(metadata.cssPrefix, category).toBeTruthy();
      expect(metadata.figmaCollection, category).toContain("Afenda /");
      expect(metadata.usage, category).toBeTruthy();
    }
  });

  it("keeps usage constraints, deprecation policy, and Figma mapping explicit", () => {
    expect(tokens.metadata.usageConstraints.primitive.rule).toContain(
      "Primitive tokens"
    );
    expect(tokens.metadata.usageConstraints.warmth.forbiddenScopes).toContain(
      "approval-queue"
    );
    expect(tokens.metadata.deprecation.policy).toContain("migration guide");
    expect(tokens.metadata.deprecation.deprecatedTokens).toEqual([]);
    expect(tokens.metadata.figma.modeMap).toMatchObject({
      dark: "Dark",
      light: "Light",
    });
    expect(tokens.metadata.figma.variableNameTemplate).toBe(
      "{layer}/{category}/{mode}/{name}"
    );
  });
});
