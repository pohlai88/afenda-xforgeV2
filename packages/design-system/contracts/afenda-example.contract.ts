/**
 * Afenda Example Contract
 *
 * Example owns AI imitation.
 *
 * Purpose:
 * - Define example authority.
 * - Govern copy-paste safety.
 * - Ensure examples demonstrate canonical usage.
 * - Prevent examples from becoming a source of drift.
 *
 * This file must not contain component logic, styling values, or business logic.
 */

export const AFENDA_EXAMPLE_CONTRACT_ID = "afenda.example" as const;

export const AFENDA_EXAMPLE_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_EXAMPLE_AUTHORITY_RULES = {
  exampleOwnsAiImitation: true,
  exampleOwnsReferenceImplementation: true,
  exampleOwnsCopyPasteSafety: true,
  exampleOwnsCanonicalUsagePatterns: true,
} as const;

export const AFENDA_EXAMPLE_COPY_PASTE_RULES = {
  examplesMustBeCopyPasteSafe: true,
  examplesMustCompileWithoutModification: true,
  examplesMustUsePublicExportsOnly: true,
  examplesMustUseCanonicalImports: true,
  examplesMustUseCurrentContractVocabulary: true,
} as const;

export const AFENDA_EXAMPLE_COMPONENT_RULES = {
  examplesMustUseGovernedComponents: true,
  examplesMustNotUsePrivateComponents: true,
  examplesMustNotInventComponentNames: true,
  examplesMustDemonstrateCanonicalComposition: true,
} as const;

export const AFENDA_EXAMPLE_VARIANT_RULES = {
  examplesMustUseContractVariants: true,
  examplesMustNotInventVariants: true,
  examplesMustNotUseForbiddenAliases: true,
  examplesMustUseCanonicalVocabulary: true,
} as const;

export const AFENDA_EXAMPLE_SLOT_RULES = {
  examplesMustUseContractSlots: true,
  examplesMustNotInventSlots: true,
  examplesMustUseCanonicalDataSlots: true,
} as const;

export const AFENDA_EXAMPLE_RECIPE_RULES = {
  examplesMustUseRecipes: true,
  examplesMustNotInlineSemanticStyling: true,
  examplesMustNotReplaceRecipesWithClassNames: true,
} as const;

export const AFENDA_EXAMPLE_TOKEN_RULES = {
  examplesMustConsumeTokensIndirectly: true,
  examplesMustNotDeclareTokens: true,
  examplesMustNotUseRawValues: true,
  examplesMustNotInventCssVariables: true,
} as const;

export const AFENDA_EXAMPLE_ACCESS_RULES = {
  examplesMustUsePublicExportsOnly: true,
  examplesMustNotUsePrivateImports: true,
  examplesMustNotUseInternalPaths: true,
} as const;

export const AFENDA_EXAMPLE_VERSION_RULES = {
  examplesMustUseCurrentContractVersion: true,
  staleExamplesAreForbidden: true,
  deprecatedExamplesRequireReplacement: true,
  examplesMustTrackCanonicalContracts: true,
} as const;

export const AFENDA_EXAMPLE_VERSION_REGISTRY = {
  currentContractVersion: AFENDA_EXAMPLE_CONTRACT_VERSION,
  examplesMustUseCurrentContractVersion: true,
  staleExamplesAreForbidden: true,
} as const;

export const AFENDA_EXAMPLE_FORBIDDEN_OWNERSHIP = {
  examplesMustNotOwnBehavior: true,
  examplesMustNotOwnStyling: true,
  examplesMustNotOwnValues: true,
  examplesMustNotOwnVariants: true,
  examplesMustNotOwnSlots: true,
  examplesMustNotOwnBusinessLogic: true,
} as const;

export const AFENDA_EXAMPLE_FORBIDDEN_PATTERNS = [
  "as any",
  "Record<string, any>",
  "@repo/design-system/src/",
  "@repo/design-system/internal/",
  "../internal/",
  "./internal/",
  "bg-[#",
  "text-[#",
  "border-[#",
  "oklch(",
  "rgb(",
  "rgba(",
  "hsl(",
  "hsla(",
] as const;

export const AFENDA_EXAMPLE_WARNING_PATTERNS = [
  "TODO",
  "FIXME",
  "temporary",
  "placeholder",
  "mock",
] as const;

export const AFENDA_EXAMPLE_SOURCE_OF_TRUTH = [
  "afenda-example.contract.ts",
  "afenda-design-system.contract.ts",
  "afenda-component.contract.ts",
  "afenda-variant.contract.ts",
  "afenda-slot.contract.ts",
  "afenda-export.contract.ts",
] as const;

export const AFENDA_EXAMPLE_PRINCIPLES = [
  "example-owns-ai-imitation",
  "examples-are-copy-paste-safe",
  "examples-use-public-exports-only",
  "examples-use-canonical-vocabulary",
  "examples-demonstrate-governed-usage",
  "examples-must-not-create-drift",
  "stale-examples-are-forbidden",
] as const;

export const afendaExampleContract = {
  id: AFENDA_EXAMPLE_CONTRACT_ID,
  version: AFENDA_EXAMPLE_CONTRACT_VERSION,
  authorityRules: AFENDA_EXAMPLE_AUTHORITY_RULES,
  copyPasteRules: AFENDA_EXAMPLE_COPY_PASTE_RULES,
  componentRules: AFENDA_EXAMPLE_COMPONENT_RULES,
  variantRules: AFENDA_EXAMPLE_VARIANT_RULES,
  slotRules: AFENDA_EXAMPLE_SLOT_RULES,
  recipeRules: AFENDA_EXAMPLE_RECIPE_RULES,
  tokenRules: AFENDA_EXAMPLE_TOKEN_RULES,
  accessRules: AFENDA_EXAMPLE_ACCESS_RULES,
  versionRules: AFENDA_EXAMPLE_VERSION_RULES,
  versionRegistry: AFENDA_EXAMPLE_VERSION_REGISTRY,
  forbiddenOwnership: AFENDA_EXAMPLE_FORBIDDEN_OWNERSHIP,
  forbiddenPatterns: AFENDA_EXAMPLE_FORBIDDEN_PATTERNS,
  warningPatterns: AFENDA_EXAMPLE_WARNING_PATTERNS,
  sourceOfTruth: AFENDA_EXAMPLE_SOURCE_OF_TRUTH,
  principles: AFENDA_EXAMPLE_PRINCIPLES,
} as const;

export type AfendaExampleContract = typeof afendaExampleContract;
