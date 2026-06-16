/**
 * Afenda Design System Master Contract
 *
 * Owns the anti-drift wall only.
 * Owner contracts own token, recipe, component, slot, variant, className,
 * export, accessibility, motion, state, and example rules.
 */

export const AFENDA_DESIGN_SYSTEM_CONTRACT_ID =
  "afenda.design-system" as const;

export const AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_DESIGN_SYSTEM_PACKAGE_NAME =
  "@repo/design-system" as const;

export const AFENDA_AUTHORITY_RULES = {
  tokenOwnsValue: true,
  variantOwnsMeaning: true,
  recipeOwnsStyling: true,
  componentOwnsBehavior: true,
  slotOwnsStructure: true,
  classNameOwnsLayoutOnly: true,
  exportOwnsAccess: true,
  exampleOwnsAiImitation: true,
  designSystemOwnsTheWall: true,
} as const;

export const AFENDA_REQUIRED_CORE_CONTRACTS = [
  "afenda-design-system.contract.ts",
  "afenda-token.contract.ts",
  "afenda-recipe.contract.ts",
  "afenda-component.contract.ts",
  "afenda-slot.contract.ts",
  "afenda-variant.contract.ts",
  "afenda-class-name-policy.contract.ts",
  "afenda-export.contract.ts",
] as const;

export const AFENDA_REQUIRED_AI_SAFETY_CONTRACTS = [
  "afenda-accessibility.contract.ts",
  "afenda-motion.contract.ts",
  "afenda-state.contract.ts",
  "afenda-example.contract.ts",
] as const;

export const AFENDA_AI_REQUIRED_CONTRACTS = [
  ...AFENDA_REQUIRED_CORE_CONTRACTS,
  ...AFENDA_REQUIRED_AI_SAFETY_CONTRACTS,
] as const;

export const AFENDA_AI_HARD_FAIL_RULES = [
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
] as const;

export const AFENDA_AI_DRIFT_SCORE_GATE = {
  minimumScore: 95,
  failOnRawSemanticTailwind: true,
  failOnUngovernedVariant: true,
  failOnMissingDataSlot: true,
  failOnPrivateImport: true,
  failOnBusinessLogic: true,
  failOnUnsafeExample: true,
} as const;

export const AFENDA_AI_VIBE_CODING_GATE = {
  minimumScore: 95,
  hardFailOverridesScore: true,
  requirePublicExportsOnly: true,
  requireGovernedVariantsOnly: true,
  requireRecipeForSlots: true,
  requireExamplesCopyPasteSafe: true,
  requireRegistryKnownComponents: true,
  requireRegistryKnownRecipes: true,
  requireContractKnownSlots: true,
  forbidUnregisteredSemanticAliases: true,
  forbidLocalVocabularyDeclarations: true,
  requireCurrentExampleContractVersion: true,
} as const;

export const AFENDA_REGISTRY_AUTHORITY_RULES = {
  registryOwnsVocabulary: true,
  registryOwnsComponentIdentity: true,
  registryOwnsRecipeIdentity: true,
  registryOwnsVariantIdentity: true,
  registryOwnsSlotIdentity: true,
} as const;

export const AFENDA_SOURCE_OF_TRUTH_PRIORITY = [
  "registry",
  "contract",
  "token",
  "recipe",
  "component",
  "example",
] as const;

export const AFENDA_DESIGN_SYSTEM_WALL_PRINCIPLES = [
  "token-owns-value",
  "variant-owns-meaning",
  "recipe-owns-styling",
  "component-owns-behavior",
  "slot-owns-structure",
  "class-name-owns-layout-only",
  "export-owns-access",
  "example-owns-ai-imitation",
  "design-system-owns-the-wall",
] as const;

export const afendaDesignSystemContract = {
  id: AFENDA_DESIGN_SYSTEM_CONTRACT_ID,
  version: AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION,
  packageName: AFENDA_DESIGN_SYSTEM_PACKAGE_NAME,
  authorityRules: AFENDA_AUTHORITY_RULES,
  aiRequiredContracts: AFENDA_AI_REQUIRED_CONTRACTS,
  aiHardFailRules: AFENDA_AI_HARD_FAIL_RULES,
  aiVibeCodingGate: AFENDA_AI_VIBE_CODING_GATE,
  requiredContracts: {
    core: AFENDA_REQUIRED_CORE_CONTRACTS,
    aiSafety: AFENDA_REQUIRED_AI_SAFETY_CONTRACTS,
  },
  aiDriftScoreGate: AFENDA_AI_DRIFT_SCORE_GATE,
  registryAuthority: AFENDA_REGISTRY_AUTHORITY_RULES,
  sourceOfTruthPriority: AFENDA_SOURCE_OF_TRUTH_PRIORITY,
  principles: AFENDA_DESIGN_SYSTEM_WALL_PRINCIPLES,
} as const;

export type AfendaDesignSystemContract = typeof afendaDesignSystemContract;
