import { describe, expect, it } from "vitest";
import {
  AFENDA_FORBIDDEN_RAW_TOKEN_PATTERNS,
  AFENDA_TOKEN_AUTHORITY_RULES,
  AFENDA_TOKEN_FORBIDDEN_OWNERSHIP,
  AFENDA_TOKEN_SOURCE_OF_TRUTH,
  AFENDA_TOKEN_USAGE_RULES,
  afendaTokenContract,
} from "../contracts/afenda-token.contract";
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

  it("keeps token authority explicit and free of lifecycle registry ownership", () => {
    expect(afendaTokenContract).not.toHaveProperty("status");
    expect(afendaTokenContract.authorityRules).toBe(
      AFENDA_TOKEN_AUTHORITY_RULES
    );
    expect(AFENDA_TOKEN_AUTHORITY_RULES).toEqual({
      tokenOwnsAliases: true,
      tokenOwnsCssVariables: true,
      tokenOwnsRawValues: true,
      tokenOwnsValue: true,
    });
  });

  it("forbids token ownership outside the token layer", () => {
    expect(afendaTokenContract.forbiddenOwnership).toBe(
      AFENDA_TOKEN_FORBIDDEN_OWNERSHIP
    );
    expect(AFENDA_TOKEN_FORBIDDEN_OWNERSHIP).toEqual({
      componentsMustNotDeclareTokens: true,
      examplesMustNotDeclareTokens: true,
      recipesMustNotDeclareTokens: true,
      variantsMustNotDeclareTokens: true,
    });
  });

  it("keeps CSS variables and raw values under token ownership", () => {
    expect(AFENDA_TOKEN_USAGE_RULES).toMatchObject({
      arbitraryTailwindValuesRequireTokenReference: true,
      cssVariablesMustBeDeclaredByTokens: true,
      rawColorValuesAreForbiddenOutsideTokens: true,
      tokenAliasesMustResolveToCanonicalToken: true,
    });
    expect(AFENDA_FORBIDDEN_RAW_TOKEN_PATTERNS).toContain("ms");
    expect(AFENDA_FORBIDDEN_RAW_TOKEN_PATTERNS).not.toContain("s");
    expect(AFENDA_TOKEN_SOURCE_OF_TRUTH).toEqual([
      "tokens.json",
      "globals.css",
      "afenda-token.contract.ts",
    ]);
  });
});
