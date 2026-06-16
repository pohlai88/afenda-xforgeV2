import { describe, expect, it } from "vitest";
import {
  AFENDA_AI_DRIFT_SCORE_GATE,
  AFENDA_AI_HARD_FAIL_RULES,
  AFENDA_AI_AUTHORITY_RULES,
  AFENDA_AI_REQUIRED_CONTRACTS,
  AFENDA_AI_VIBE_CODING_GATE,
  AFENDA_AUTHORITY_RULES,
  AFENDA_CLASS_NAME_ESCAPE_HATCH_RULES,
  AFENDA_COMPONENT_IDENTITY_RULES,
  AFENDA_EXAMPLE_RULES,
  AFENDA_EXAMPLE_VERSION_RULES,
  AFENDA_FORBIDDEN_SEMANTIC_ALIASES,
  AFENDA_LOCAL_VOCABULARY_RULES,
  AFENDA_PUBLIC_EXPORTS,
  AFENDA_RECIPE_IDENTITY_RULES,
  AFENDA_REGISTRY_AUTHORITY_RULES,
  AFENDA_REQUIRED_AI_SAFETY_CONTRACTS,
  AFENDA_REQUIRED_CORE_CONTRACTS,
  AFENDA_SEMANTIC_ALIAS_RULES,
  AFENDA_SLOT_IDENTITY_RULES,
  AFENDA_SOURCE_OF_TRUTH_PRIORITY,
  AFENDA_VARIANT_GOVERNANCE_RULES,
  afendaDesignSystemContract,
  parsedAfendaDesignSystemContract,
} from "../contracts/afenda-design-system.contract";

describe("afenda design-system anti-drift contract", () => {
  it("keeps the master contract parseable at runtime", () => {
    expect(parsedAfendaDesignSystemContract).toEqual(
      afendaDesignSystemContract
    );
  });

  it("keeps AI IDE authority rules sealed", () => {
    expect(AFENDA_AI_AUTHORITY_RULES).toEqual(AFENDA_AUTHORITY_RULES);
    expect(Object.values(AFENDA_AUTHORITY_RULES)).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it("requires the full anti-drift contract wall", () => {
    expect(AFENDA_AI_REQUIRED_CONTRACTS).toEqual([
      "design-system.contract.ts",
      "token.contract.ts",
      "recipe.contract.ts",
      "component.contract.ts",
      "slot.contract.ts",
      "variant.contract.ts",
      "class-name-policy.contract.ts",
      "export.contract.ts",
      "accessibility.contract.ts",
      "motion.contract.ts",
      "state.contract.ts",
      "example.contract.ts",
    ]);
    expect(AFENDA_REQUIRED_CORE_CONTRACTS).toContain("recipe.contract.ts");
    expect(AFENDA_REQUIRED_CORE_CONTRACTS).toContain("variant.contract.ts");
    expect(AFENDA_REQUIRED_CORE_CONTRACTS).toContain(
      "class-name-policy.contract.ts"
    );
    expect(AFENDA_REQUIRED_AI_SAFETY_CONTRACTS).toContain(
      "example.contract.ts"
    );
  });

  it("keeps AI hard-fail rules explicit", () => {
    expect(AFENDA_AI_HARD_FAIL_RULES).toEqual([
      "raw-semantic-tailwind",
      "ungoverned-variant",
      "missing-data-slot",
      "private-import",
      "business-logic-in-design-system",
      "copy-paste-unsafe-example",
      "component-without-recipe",
      "slot-without-contract",
      "unknown-component-name",
      "unknown-recipe",
      "unknown-slot",
      "unregistered-semantic-alias",
      "local-vocabulary-declaration",
      "stale-example",
    ]);
  });

  it("fails generated UI below the enterprise AI drift threshold", () => {
    expect(AFENDA_AI_DRIFT_SCORE_GATE.minimumScore).toBe(95);
    expect(AFENDA_AI_DRIFT_SCORE_GATE).toMatchObject({
      failOnBusinessLogic: true,
      failOnMissingDataSlot: true,
      failOnPrivateImport: true,
      failOnRawSemanticTailwind: true,
      failOnUngovernedVariant: true,
      failOnUnsafeExample: true,
    });
    expect(AFENDA_AI_VIBE_CODING_GATE).toMatchObject({
      hardFailOverridesScore: true,
      minimumScore: 95,
      requireExamplesCopyPasteSafe: true,
      requireGovernedVariantsOnly: true,
      requirePublicExportsOnly: true,
      requireRecipeForSlots: true,
      requireRegistryKnownComponents: true,
      requireRegistryKnownRecipes: true,
      requireContractKnownSlots: true,
      forbidUnregisteredSemanticAliases: true,
      forbidLocalVocabularyDeclarations: true,
      requireCurrentExampleContractVersion: true,
    });
  });

  it("hard-fails ungoverned variants and className semantic escape hatches", () => {
    expect(AFENDA_VARIANT_GOVERNANCE_RULES).toMatchObject({
      unrecognizedVariantIsHardFail: true,
      variantNamesMustUseSemanticVocabulary: true,
      variantsMustBeDeclaredInContract: true,
      variantsMustMapToRecipes: true,
      variantsMustNotBeInventedInAppCode: true,
      variantsMustNotEncodeRawColor: true,
    });
    expect(AFENDA_CLASS_NAME_ESCAPE_HATCH_RULES).toMatchObject({
      allowedPrefixesNeverOverrideSemanticIdentity: true,
      arbitraryValuesRequireTokenReference: true,
      bracketColorValuesAreHardFail: true,
      bracketSpacingValuesAreHardFailUnlessTokenized: true,
    });
  });

  it("forces components, recipes, variants, and slots through registries", () => {
    expect(AFENDA_REGISTRY_AUTHORITY_RULES).toMatchObject({
      registryOwnsComponentIdentity: true,
      registryOwnsRecipeIdentity: true,
      registryOwnsSlotIdentity: true,
      registryOwnsVariantIdentity: true,
      registryOwnsVocabulary: true,
    });
    expect(AFENDA_COMPONENT_IDENTITY_RULES).toMatchObject({
      componentNamesMustExistInRegistry: true,
      unknownComponentNameIsHardFail: true,
    });
    expect(AFENDA_RECIPE_IDENTITY_RULES).toMatchObject({
      recipeNamesMustExistInRegistry: true,
      unknownRecipeIsHardFail: true,
    });
    expect(AFENDA_SLOT_IDENTITY_RULES).toMatchObject({
      slotNamesMustExistInContract: true,
      unknownSlotIsHardFail: true,
    });
  });

  it("blocks semantic aliases and local vocabulary declarations", () => {
    expect(AFENDA_SEMANTIC_ALIAS_RULES).toMatchObject({
      aliasesMustResolveToCanonicalVocabulary: true,
      canonicalVocabularyWinsOverSynonyms: true,
      unregisteredSemanticAliasIsHardFail: true,
    });
    expect(AFENDA_FORBIDDEN_SEMANTIC_ALIASES.critical).toEqual([
      "danger",
      "destructive",
      "error",
      "negative",
    ]);
    expect(AFENDA_LOCAL_VOCABULARY_RULES).toMatchObject({
      localEnumsMustReferenceContract: true,
      localStateArraysAreHardFail: true,
      localToneArraysAreHardFail: true,
      localVariantArraysAreHardFail: true,
      localVocabularyDeclarationsAreForbidden: true,
    });
  });

  it("keeps deterministic source priority and versioned examples", () => {
    expect(AFENDA_SOURCE_OF_TRUTH_PRIORITY).toEqual([
      "registry",
      "contract",
      "token",
      "recipe",
      "component",
      "example",
    ]);
    expect(AFENDA_EXAMPLE_VERSION_RULES).toMatchObject({
      examplesMustDeclareContractVersion: true,
      examplesMustImportCurrentContract: true,
      staleExamplesAreHardFail: true,
    });
  });

  it("keeps examples safe for AI imitation", () => {
    expect(AFENDA_EXAMPLE_RULES).toMatchObject({
      mustBeCopyPasteSafe: true,
      mustNotContainBusinessLogic: true,
      mustNotUseRawSemanticTailwind: true,
      mustUseDataSlot: true,
      mustUsePublicExportsOnly: true,
      mustUseRecipe: true,
    });
  });

  it("publishes only the canonical design-system contract spelling", () => {
    expect(AFENDA_PUBLIC_EXPORTS).toContain(
      "@repo/design-system/contracts/afenda-design-system"
    );
    expect(AFENDA_PUBLIC_EXPORTS).not.toContain(
      "@repo/design-system/contracts/afenda-desing-system"
    );
  });
});
