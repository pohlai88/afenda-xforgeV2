/**
 * Afenda Variant Contract
 *
 * Variant owns meaning.
 *
 * Purpose:
 * - Define semantic variant vocabulary.
 * - Govern tones, sizes, density, emphasis, and intent.
 * - Prevent variants from owning token values, recipes, slots, or behavior.
 * - Keep variant meaning stable across components, recipes, examples, and AI coding.
 *
 * This file must not contain styling values or component logic.
 */

export const AFENDA_VARIANT_CONTRACT_ID = "afenda.variant" as const;

export const AFENDA_VARIANT_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_TONES = [
  "neutral",
  "info",
  "success",
  "warning",
  "critical",
] as const;

export type AfendaTone = (typeof AFENDA_TONES)[number];

export const AFENDA_DENSITIES = [
  "compact",
  "default",
  "comfortable",
] as const;

export type AfendaDensity = (typeof AFENDA_DENSITIES)[number];

export const AFENDA_EMPHASIS = ["low", "medium", "high"] as const;

export type AfendaEmphasis = (typeof AFENDA_EMPHASIS)[number];

export const AFENDA_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export type AfendaSize = (typeof AFENDA_SIZES)[number];

export const AFENDA_ACTION_VARIANTS = [
  "primary",
  "secondary",
  "quiet",
  "critical",
  "link",
] as const;

export type AfendaActionVariant = (typeof AFENDA_ACTION_VARIANTS)[number];

export const AFENDA_STRUCTURAL_VARIANTS = [
  "default",
  "icon",
  "icon-sm",
  "label",
  "legend",
  "panel",
  "plain",
  "sidebar",
  "floating",
  "inset",
  "outline",
  "soft",
  "solid",
] as const;

export type AfendaStructuralVariant =
  (typeof AFENDA_STRUCTURAL_VARIANTS)[number];

export const AFENDA_VARIANT_IDENTITY_REGISTRY = {
  actionVariants: AFENDA_ACTION_VARIANTS,
  densities: AFENDA_DENSITIES,
  structuralVariants: AFENDA_STRUCTURAL_VARIANTS,
  tones: AFENDA_TONES,
} as const;

export const AFENDA_VARIANT_AUTHORITY_RULES = {
  variantOwnsMeaning: true,
  variantOwnsSemanticVocabulary: true,
  variantOwnsIntentNames: true,
  variantOwnsToneNames: true,
  variantOwnsSizeNames: true,
  variantOwnsDensityNames: true,
  variantOwnsEmphasisNames: true,
} as const;

export const AFENDA_VARIANT_FORBIDDEN_OWNERSHIP = {
  variantsMustNotOwnRawValues: true,
  variantsMustNotDeclareTokens: true,
  variantsMustNotDeclareRecipes: true,
  variantsMustNotDeclareSlots: true,
  variantsMustNotOwnStyling: true,
  variantsMustNotOwnBehavior: true,
  variantsMustNotOwnBusinessLogic: true,
} as const;

export const AFENDA_VARIANT_RECIPE_RULES = {
  variantsMustMapToRecipes: true,
  variantsSelectRecipeMeaning: true,
  variantsMustNotInlineClassNames: true,
  ungovernedVariantStylingIsHardFail: true,
} as const;

export const AFENDA_VARIANT_COMPONENT_RULES = {
  componentsMayAcceptGovernedVariants: true,
  componentsMustNotInventVariants: true,
  componentVariantPropsMustUseContractVocabulary: true,
  unknownVariantIsHardFail: true,
} as const;

export const AFENDA_VARIANT_NAMING_RULES = {
  variantNamesMustUseCamelCase: true,
  variantValuesMustUseKebabCase: true,
  toneNamesMustUseContractVocabulary: true,
  sizeNamesMustUseContractVocabulary: true,
  densityNamesMustUseContractVocabulary: true,
  emphasisNamesMustUseContractVocabulary: true,
  variantNamesMustNotEncodeRawValues: true,
  variantNamesMustNotEncodeStylingClasses: true,
} as const;

export const AFENDA_VARIANT_ALIAS_RULES = {
  aliasesMustResolveToCanonicalVariant: true,
  unregisteredVariantAliasIsHardFail: true,
  canonicalVocabularyWinsOverSynonyms: true,
} as const;

export const AFENDA_FORBIDDEN_VARIANT_ALIASES = {
  critical: ["danger", "destructive", "error", "negative"],
  info: ["notice", "informational"],
  neutral: ["base", "plain"],
  success: ["approved", "good", "positive"],
  warning: ["caution", "pending"],
} as const;

export const AFENDA_VARIANT_FORBIDDEN_PATTERNS = [
  "danger",
  "destructive",
  "error",
  "negative",
  "notice",
  "informational",
  "approved",
  "good",
  "positive",
  "caution",
  "pending",
] as const;

export const AFENDA_VARIANT_SOURCE_OF_TRUTH = [
  "afenda-variant.contract.ts",
  "afenda-recipe.contract.ts",
  "afenda-component.contract.ts",
] as const;

export const AFENDA_VARIANT_PRINCIPLES = [
  "variant-owns-meaning",
  "variant-does-not-own-value",
  "variant-does-not-own-styling",
  "variant-selects-recipe-meaning",
  "variant-vocabulary-is-canonical",
  "variant-aliases-must-resolve-to-canonical-vocabulary",
  "unknown-variant-is-hard-fail",
] as const;

export const afendaVariantContract = {
  id: AFENDA_VARIANT_CONTRACT_ID,
  version: AFENDA_VARIANT_CONTRACT_VERSION,
  tones: AFENDA_TONES,
  densities: AFENDA_DENSITIES,
  emphasis: AFENDA_EMPHASIS,
  sizes: AFENDA_SIZES,
  actionVariants: AFENDA_ACTION_VARIANTS,
  structuralVariants: AFENDA_STRUCTURAL_VARIANTS,
  variantIdentityRegistry: AFENDA_VARIANT_IDENTITY_REGISTRY,
  authorityRules: AFENDA_VARIANT_AUTHORITY_RULES,
  forbiddenOwnership: AFENDA_VARIANT_FORBIDDEN_OWNERSHIP,
  recipeRules: AFENDA_VARIANT_RECIPE_RULES,
  componentRules: AFENDA_VARIANT_COMPONENT_RULES,
  namingRules: AFENDA_VARIANT_NAMING_RULES,
  aliasRules: AFENDA_VARIANT_ALIAS_RULES,
  forbiddenVariantAliases: AFENDA_FORBIDDEN_VARIANT_ALIASES,
  forbiddenPatterns: AFENDA_VARIANT_FORBIDDEN_PATTERNS,
  sourceOfTruth: AFENDA_VARIANT_SOURCE_OF_TRUTH,
  principles: AFENDA_VARIANT_PRINCIPLES,
} as const;

export type AfendaVariantContract = typeof afendaVariantContract;
