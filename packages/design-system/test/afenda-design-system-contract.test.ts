import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AFENDA_AI_DRIFT_SCORE_GATE,
  AFENDA_AI_HARD_FAIL_RULES,
  AFENDA_AI_REQUIRED_CONTRACTS,
  AFENDA_AI_VIBE_CODING_GATE,
  AFENDA_AUTHORITY_RULES,
  AFENDA_REGISTRY_AUTHORITY_RULES,
  AFENDA_REQUIRED_AI_SAFETY_CONTRACTS,
  AFENDA_REQUIRED_CORE_CONTRACTS,
  AFENDA_SOURCE_OF_TRUTH_PRIORITY,
  afendaDesignSystemContract,
} from "../contracts/afenda-design-system.contract";
import {
  AFENDA_ACCESSIBILITY_ARIA_RULES,
  AFENDA_ACCESSIBILITY_AUTHORITY_RULES,
  AFENDA_ACCESSIBILITY_COMPONENT_RULES,
  AFENDA_ACCESSIBILITY_FORBIDDEN_PATTERNS,
  AFENDA_ACCESSIBILITY_FOCUS_RULES,
  AFENDA_ACCESSIBILITY_KEYBOARD_RULES,
  AFENDA_ACCESSIBILITY_WARNING_PATTERNS,
} from "../contracts/afenda-accessibility.contract";
import {
  AFENDA_CLASS_NAME_AUTHORITY_RULES,
  AFENDA_CLASS_NAME_ESCAPE_HATCH_RULES,
  AFENDA_CLASS_NAME_FORBIDDEN_OWNERSHIP,
} from "../contracts/afenda-class-name-policy.contract";
import {
  AFENDA_COMPONENT_AUTHORITY_RULES,
  AFENDA_COMPONENT_BOUNDARY_RULES,
  AFENDA_COMPONENT_FORBIDDEN_OWNERSHIP,
  AFENDA_COMPONENT_RECIPE_RULES,
  AFENDA_COMPONENT_SLOT_RULES,
  AFENDA_COMPONENT_VARIANT_RULES,
} from "../contracts/afenda-component.contract";
import {
  AFENDA_EXAMPLE_ACCESS_RULES,
  AFENDA_EXAMPLE_AUTHORITY_RULES,
  AFENDA_EXAMPLE_COMPONENT_RULES,
  AFENDA_EXAMPLE_COPY_PASTE_RULES,
  AFENDA_EXAMPLE_FORBIDDEN_OWNERSHIP,
  AFENDA_EXAMPLE_RECIPE_RULES,
  AFENDA_EXAMPLE_SLOT_RULES,
  AFENDA_EXAMPLE_TOKEN_RULES,
  AFENDA_EXAMPLE_VARIANT_RULES,
  AFENDA_EXAMPLE_VERSION_RULES,
} from "../contracts/afenda-example.contract";
import {
  AFENDA_EXPORT_AUTHORITY_RULES,
  AFENDA_EXPORT_COMPATIBILITY_RULES,
  AFENDA_EXPORT_FORBIDDEN_OWNERSHIP,
  AFENDA_EXPORT_IMPORT_RULES,
  AFENDA_EXPORT_NAMING_RULES,
  AFENDA_PUBLIC_EXPORTS,
} from "../contracts/afenda-export.contract";
import {
  AFENDA_MOTION_ACCESSIBILITY_RULES,
  AFENDA_MOTION_AUTHORITY_RULES,
  AFENDA_MOTION_CLASS_NAME_RULES,
  AFENDA_MOTION_FORBIDDEN_PATTERNS,
  AFENDA_MOTION_FORBIDDEN_OWNERSHIP,
  AFENDA_MOTION_RECIPE_RULES,
  AFENDA_MOTION_USAGE_RULES,
  AFENDA_MOTION_WARNING_PATTERNS,
} from "../contracts/afenda-motion.contract";
import {
  AFENDA_RECIPE_AUTHORITY_RULES,
  AFENDA_RECIPE_COMPONENT_RULES,
  AFENDA_RECIPE_IMPORT_RULES,
} from "../contracts/afenda-recipe.contract";
import {
  AFENDA_SLOT_AUTHORITY_RULES,
  AFENDA_SLOT_FORBIDDEN_OWNERSHIP,
  AFENDA_SLOT_USAGE_RULES,
} from "../contracts/afenda-slot.contract";
import {
  AFENDA_STATE_ACCESSIBILITY_RULES,
  AFENDA_STATE_AUTHORITY_RULES,
  AFENDA_STATE_COMPONENT_RULES,
  AFENDA_STATE_FORBIDDEN_ALIASES,
  AFENDA_STATE_FORBIDDEN_PATTERNS,
  AFENDA_STATE_FORBIDDEN_OWNERSHIP,
  AFENDA_STATE_NAMING_RULES,
  AFENDA_STATE_VARIANT_RULES,
  AFENDA_STATE_WARNING_PATTERNS,
} from "../contracts/afenda-state.contract";
import {
  AFENDA_FORBIDDEN_VARIANT_ALIASES,
  AFENDA_VARIANT_ALIAS_RULES,
  AFENDA_VARIANT_AUTHORITY_RULES,
  AFENDA_VARIANT_COMPONENT_RULES,
  AFENDA_VARIANT_FORBIDDEN_OWNERSHIP,
  AFENDA_VARIANT_RECIPE_RULES,
} from "../contracts/afenda-variant.contract";

describe("afenda design-system anti-drift contract", () => {
  it("keeps the master contract as wall authority only", () => {
    expect(afendaDesignSystemContract.principles).toContain(
      "design-system-owns-the-wall"
    );
    expect(afendaDesignSystemContract).not.toHaveProperty("vocabularies");
    expect(afendaDesignSystemContract).not.toHaveProperty("styling");
    expect(afendaDesignSystemContract).not.toHaveProperty("slots");

    const source = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "..",
        "contracts",
        "afenda-design-system.contract.ts"
      ),
      "utf8"
    );
    expect(source).not.toContain('from "zod"');
    expect(source).not.toContain(".parse(");
  });

  it("keeps AI IDE authority rules sealed", () => {
    expect(afendaDesignSystemContract.authorityRules).toBe(
      AFENDA_AUTHORITY_RULES
    );
    expect(Object.keys(afendaDesignSystemContract)).toEqual([
      "id",
      "version",
      "packageName",
      "authorityRules",
      "aiRequiredContracts",
      "aiHardFailRules",
      "aiVibeCodingGate",
      "requiredContracts",
      "aiDriftScoreGate",
      "registryAuthority",
      "sourceOfTruthPriority",
      "principles",
    ]);
    expect(Object.values(AFENDA_AUTHORITY_RULES)).toEqual([
      true,
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
      "afenda-design-system.contract.ts",
      "afenda-token.contract.ts",
      "afenda-recipe.contract.ts",
      "afenda-component.contract.ts",
      "afenda-slot.contract.ts",
      "afenda-variant.contract.ts",
      "afenda-class-name-policy.contract.ts",
      "afenda-export.contract.ts",
      "afenda-accessibility.contract.ts",
      "afenda-motion.contract.ts",
      "afenda-state.contract.ts",
      "afenda-example.contract.ts",
    ]);
    expect(AFENDA_REQUIRED_CORE_CONTRACTS).toContain("afenda-recipe.contract.ts");
    expect(AFENDA_REQUIRED_CORE_CONTRACTS).toContain("afenda-variant.contract.ts");
    expect(AFENDA_REQUIRED_CORE_CONTRACTS).toContain(
      "afenda-class-name-policy.contract.ts"
    );
    expect(AFENDA_REQUIRED_AI_SAFETY_CONTRACTS).toContain(
      "afenda-example.contract.ts"
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
    expect(AFENDA_VARIANT_AUTHORITY_RULES).toMatchObject({
      variantOwnsMeaning: true,
      variantOwnsSemanticVocabulary: true,
    });
    expect(AFENDA_VARIANT_FORBIDDEN_OWNERSHIP).toMatchObject({
      variantsMustNotDeclareRecipes: true,
      variantsMustNotDeclareTokens: true,
      variantsMustNotOwnStyling: true,
    });
    expect(AFENDA_VARIANT_RECIPE_RULES).toMatchObject({
      variantsMustMapToRecipes: true,
      variantsSelectRecipeMeaning: true,
      ungovernedVariantStylingIsHardFail: true,
    });
    expect(AFENDA_VARIANT_COMPONENT_RULES).toMatchObject({
      componentsMustNotInventVariants: true,
      componentVariantPropsMustUseContractVocabulary: true,
      unknownVariantIsHardFail: true,
    });
    expect(AFENDA_CLASS_NAME_ESCAPE_HATCH_RULES).toMatchObject({
      classNameMayExtendLayoutOnly: true,
      classNameMustNotOverrideSemanticIdentity: true,
      arbitraryValuesRequireTokenReference: true,
      bracketColorValuesAreHardFail: true,
      bracketSpacingValuesAreHardFailUnlessTokenized: true,
    });
    expect(AFENDA_CLASS_NAME_AUTHORITY_RULES).toMatchObject({
      classNameOwnsLayoutOnly: true,
      classNameOwnsResponsiveLayoutOnly: true,
    });
    expect(AFENDA_CLASS_NAME_FORBIDDEN_OWNERSHIP).toMatchObject({
      classNameMustNotOwnBehavior: true,
      classNameMustNotOwnRecipe: true,
      classNameMustNotOwnSemanticStyling: true,
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
    expect(AFENDA_COMPONENT_AUTHORITY_RULES).toMatchObject({
      componentOwnsBehavior: true,
      componentOwnsPublicProps: true,
    });
    expect(AFENDA_COMPONENT_FORBIDDEN_OWNERSHIP).toMatchObject({
      componentsMustNotDeclareRecipes: true,
      componentsMustNotDeclareVariants: true,
      componentsMustNotOwnBusinessLogic: true,
    });
    expect(AFENDA_COMPONENT_RECIPE_RULES).toMatchObject({
      componentsMustUseRecipesForStyling: true,
      componentWithoutRecipeIsHardFail: true,
    });
    expect(AFENDA_COMPONENT_VARIANT_RULES).toMatchObject({
      variantsMustComeFromVariantContract: true,
      ungovernedVariantPropIsHardFail: true,
    });
    expect(AFENDA_COMPONENT_SLOT_RULES).toMatchObject({
      componentsMustExposeDataSlot: true,
      unknownSlotIsHardFail: true,
    });
    expect(AFENDA_COMPONENT_BOUNDARY_RULES).toMatchObject({
      componentsMustNotOwnDataFetching: true,
      componentsMustNotReadEnvironmentVariables: true,
    });
    expect(AFENDA_RECIPE_IMPORT_RULES).toMatchObject({
      recipeRegistryOwnsRecipeIdentity: true,
      privateRecipeImportsAreHardFail: true,
    });
    expect(AFENDA_RECIPE_AUTHORITY_RULES).toMatchObject({
      recipeOwnsStyling: true,
      examplesMustNotOwnStyling: true,
    });
    expect(AFENDA_RECIPE_COMPONENT_RULES).toMatchObject({
      componentsMustUseRecipesForStyling: true,
      componentWithoutRecipeIsHardFail: true,
      recipesMustNotOwnBehavior: true,
    });
    expect(AFENDA_SLOT_AUTHORITY_RULES).toMatchObject({
      slotOwnsStructure: true,
      slotOwnsDataSlotIdentity: true,
    });
    expect(AFENDA_SLOT_USAGE_RULES).toMatchObject({
      componentsMustUseContractSlots: true,
      examplesMustUseContractSlotsOnly: true,
      unknownSlotIsHardFail: true,
    });
    expect(AFENDA_SLOT_FORBIDDEN_OWNERSHIP).toMatchObject({
      componentsMustNotInventSlots: true,
      examplesMustNotInventSlots: true,
      slotsMustNotOwnStyling: true,
    });
  });

  it("blocks unregistered variant aliases", () => {
    expect(AFENDA_VARIANT_ALIAS_RULES).toMatchObject({
      aliasesMustResolveToCanonicalVariant: true,
      canonicalVocabularyWinsOverSynonyms: true,
      unregisteredVariantAliasIsHardFail: true,
    });
    expect(AFENDA_FORBIDDEN_VARIANT_ALIASES.critical).toEqual([
      "danger",
      "destructive",
      "error",
      "negative",
    ]);
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
      deprecatedExamplesRequireReplacement: true,
      examplesMustTrackCanonicalContracts: true,
      examplesMustUseCurrentContractVersion: true,
      staleExamplesAreForbidden: true,
    });
  });

  it("keeps examples safe for AI imitation", () => {
    expect(AFENDA_EXAMPLE_AUTHORITY_RULES).toMatchObject({
      exampleOwnsAiImitation: true,
      exampleOwnsCanonicalUsagePatterns: true,
      exampleOwnsCopyPasteSafety: true,
    });
    expect(AFENDA_EXAMPLE_COPY_PASTE_RULES).toMatchObject({
      examplesMustBeCopyPasteSafe: true,
      examplesMustCompileWithoutModification: true,
      examplesMustUseCanonicalImports: true,
      examplesMustUseCurrentContractVocabulary: true,
      examplesMustUsePublicExportsOnly: true,
    });
    expect(AFENDA_EXAMPLE_COMPONENT_RULES).toMatchObject({
      examplesMustNotInventComponentNames: true,
      examplesMustUseGovernedComponents: true,
    });
    expect(AFENDA_EXAMPLE_VARIANT_RULES).toMatchObject({
      examplesMustNotInventVariants: true,
      examplesMustNotUseForbiddenAliases: true,
      examplesMustUseContractVariants: true,
    });
    expect(AFENDA_EXAMPLE_SLOT_RULES).toMatchObject({
      examplesMustNotInventSlots: true,
      examplesMustUseCanonicalDataSlots: true,
      examplesMustUseContractSlots: true,
    });
    expect(AFENDA_EXAMPLE_RECIPE_RULES).toMatchObject({
      examplesMustNotInlineSemanticStyling: true,
      examplesMustNotReplaceRecipesWithClassNames: true,
      examplesMustUseRecipes: true,
    });
    expect(AFENDA_EXAMPLE_TOKEN_RULES).toMatchObject({
      examplesMustConsumeTokensIndirectly: true,
      examplesMustNotDeclareTokens: true,
      examplesMustNotInventCssVariables: true,
      examplesMustNotUseRawValues: true,
    });
    expect(AFENDA_EXAMPLE_ACCESS_RULES).toMatchObject({
      examplesMustNotUseInternalPaths: true,
      examplesMustNotUsePrivateImports: true,
      examplesMustUsePublicExportsOnly: true,
    });
    expect(AFENDA_EXAMPLE_FORBIDDEN_OWNERSHIP).toMatchObject({
      examplesMustNotOwnBehavior: true,
      examplesMustNotOwnBusinessLogic: true,
      examplesMustNotOwnSlots: true,
      examplesMustNotOwnStyling: true,
      examplesMustNotOwnValues: true,
      examplesMustNotOwnVariants: true,
    });
  });

  it("keeps accessibility as usable interaction safety authority", () => {
    expect(AFENDA_ACCESSIBILITY_AUTHORITY_RULES).toMatchObject({
      accessibilityOwnsAriaRelationshipSafety: true,
      accessibilityOwnsFocusSafety: true,
      accessibilityOwnsKeyboardSafety: true,
      accessibilityOwnsUsableInteractionSafety: true,
    });
    expect(AFENDA_ACCESSIBILITY_KEYBOARD_RULES).toMatchObject({
      enterAndSpaceMustActivateButtonLikeControls: true,
      interactiveElementsMustBeKeyboardReachable: true,
    });
    expect(AFENDA_ACCESSIBILITY_FOCUS_RULES).toMatchObject({
      focusMustNotBeRemovedWithoutReplacement: true,
      focusMustReturnToTriggerAfterDismiss: true,
    });
    expect(AFENDA_ACCESSIBILITY_ARIA_RULES).toMatchObject({
      ariaDescribedByMustReferenceExistingElement: true,
      ariaHiddenMustNotHideFocusableContent: true,
    });
    expect(AFENDA_ACCESSIBILITY_COMPONENT_RULES).toMatchObject({
      componentsMustForwardAriaAttributes: true,
      componentsMustNotBreakPrimitiveAccessibility: true,
    });
    expect(AFENDA_ACCESSIBILITY_FORBIDDEN_PATTERNS).toContain("outline-none");
    expect(AFENDA_ACCESSIBILITY_FORBIDDEN_PATTERNS).not.toContain(
      'aria-hidden="true"'
    );
    expect(AFENDA_ACCESSIBILITY_WARNING_PATTERNS).toEqual([
      'aria-hidden="true"',
      'role="button"',
      "onClick={",
    ]);
  });

  it("keeps motion as tokenized movement safety authority", () => {
    expect(AFENDA_MOTION_AUTHORITY_RULES).toMatchObject({
      motionOwnsAnimationSafety: true,
      motionOwnsMovementSafety: true,
      motionOwnsReducedMotionPolicy: true,
    });
    expect(AFENDA_MOTION_USAGE_RULES).toMatchObject({
      durationMustUseContractVocabulary: true,
      easingMustUseContractVocabulary: true,
      motionMustUseTokens: true,
      reducedMotionMustBeSupported: true,
    });
    expect(AFENDA_MOTION_FORBIDDEN_OWNERSHIP).toMatchObject({
      classNameMustNotDeclareMotionValues: true,
      componentsMustNotDeclareMotionValues: true,
      examplesMustNotDeclareMotionValues: true,
    });
    expect(AFENDA_MOTION_RECIPE_RULES).toMatchObject({
      recipesMustIncludeMotionReduceFallback: true,
      recipesMustNotUseRawDurationValues: true,
      recipesMustNotUseRawEasingValues: true,
    });
    expect(AFENDA_MOTION_ACCESSIBILITY_RULES).toMatchObject({
      flashingMotionIsForbidden: true,
      prefersReducedMotionMustBeRespected: true,
    });
    expect(AFENDA_MOTION_CLASS_NAME_RULES).toMatchObject({
      classNameMustNotOwnAnimation: true,
      transitionAllIsForbidden: true,
    });
    expect(AFENDA_MOTION_FORBIDDEN_PATTERNS).toContain("transition-all");
    expect(AFENDA_MOTION_FORBIDDEN_PATTERNS).not.toContain("animate-spin");
    expect(AFENDA_MOTION_WARNING_PATTERNS).toEqual([
      "transition",
      "duration-",
      "ease-",
      "animate-",
      "animate-spin",
      "animate-pulse",
    ]);
  });

  it("keeps state as lifecycle condition authority", () => {
    expect(AFENDA_STATE_AUTHORITY_RULES).toMatchObject({
      stateOwnsAsyncVocabulary: true,
      stateOwnsInteractionVocabulary: true,
      stateOwnsLifecycleCondition: true,
      stateOwnsValidationVocabulary: true,
    });
    expect(AFENDA_STATE_FORBIDDEN_OWNERSHIP).toMatchObject({
      componentsMustNotInventStates: true,
      examplesMustNotInventStates: true,
      statesMustNotOwnBusinessLogic: true,
      statesMustNotOwnStyling: true,
    });
    expect(AFENDA_STATE_NAMING_RULES).toMatchObject({
      stateNamesMustUseContractVocabulary: true,
      unknownStateIsHardFail: true,
    });
    expect(AFENDA_STATE_COMPONENT_RULES).toMatchObject({
      componentsMustReflectInvalidStateThroughAriaInvalid: true,
      componentsMustUseContractStates: true,
    });
    expect(AFENDA_STATE_VARIANT_RULES).toMatchObject({
      stateAndVariantMustRemainSeparate: true,
      variantsMustNotReplaceStates: true,
    });
    expect(AFENDA_STATE_ACCESSIBILITY_RULES).toMatchObject({
      disabledStateMustBeProgrammaticallyDisabledWhenPossible: true,
      invalidStateMustMapToAriaInvalid: true,
      loadingStateMustExposeBusyWhenApplicable: true,
    });
    expect(AFENDA_STATE_FORBIDDEN_ALIASES.loading).toEqual([
      "pending",
      "fetching",
      "submitting",
    ]);
    expect(AFENDA_STATE_FORBIDDEN_PATTERNS).not.toContain("isPending");
    expect(AFENDA_STATE_WARNING_PATTERNS).toEqual([
      "isPending",
      "isFetching",
      "isSubmitting",
    ]);
  });

  it("publishes only the canonical design-system contract spelling", () => {
    expect(AFENDA_EXPORT_AUTHORITY_RULES).toMatchObject({
      exportOwnsAccess: true,
      exportOwnsImportBoundary: true,
      exportOwnsPublicSurface: true,
    });
    expect(AFENDA_EXPORT_IMPORT_RULES).toMatchObject({
      consumersMustUsePublicExportsOnly: true,
      deepImportsAreHardFailUnlessPubliclyDeclared: true,
      privateImportsAreHardFail: true,
    });
    expect(AFENDA_EXPORT_COMPATIBILITY_RULES).toMatchObject({
      compatibilityAliasesMustPointToCanonicalExport: true,
      legacyExportsAreMigrationInputOnly: true,
    });
    expect(AFENDA_EXPORT_FORBIDDEN_OWNERSHIP).toMatchObject({
      consumersMustNotDefineAccessSurface: true,
      legacyContractsMustNotBecomeAuthority: true,
    });
    expect(AFENDA_EXPORT_NAMING_RULES).toMatchObject({
      contractExportPathsMustUseAfendaPrefix: true,
      publicExportNamesMustUseAfendaPrefix: true,
    });
    expect(AFENDA_PUBLIC_EXPORTS).toContain(
      "@repo/design-system/contracts/afenda-design-system"
    );
    expect(AFENDA_PUBLIC_EXPORTS).toEqual(
      expect.arrayContaining([
        "@repo/design-system/contracts/afenda-accessibility",
        "@repo/design-system/contracts/afenda-class-name-policy",
        "@repo/design-system/contracts/afenda-component",
        "@repo/design-system/contracts/afenda-example",
        "@repo/design-system/contracts/afenda-export",
        "@repo/design-system/contracts/afenda-motion",
        "@repo/design-system/contracts/afenda-recipe",
        "@repo/design-system/contracts/afenda-slot",
        "@repo/design-system/contracts/afenda-state",
        "@repo/design-system/contracts/afenda-token",
        "@repo/design-system/contracts/afenda-variant",
      ])
    );
    expect(
      AFENDA_PUBLIC_EXPORTS.every(
        (entry) =>
          entry.includes("/afenda-") || !entry.includes("/contracts/")
      )
    ).toBe(true);
    expect(AFENDA_PUBLIC_EXPORTS).not.toContain(
      "@repo/design-system/contracts/afenda-desing-system"
    );
  });
});
