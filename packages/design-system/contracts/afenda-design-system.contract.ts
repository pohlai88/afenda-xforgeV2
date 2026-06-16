import { z } from "zod";

/**
 * Afenda Design System Master Contract
 *
 * Purpose:
 * - Own the design-system boundary.
 * - Define allowed vocabulary.
 * - Prevent AI / developer drift.
 * - Keep styling authority inside tokens, recipes, and governed components.
 *
 * This file must not contain business logic.
 */

export const AFENDA_DESIGN_SYSTEM_CONTRACT_ID =
  "afenda.design-system" as const;

export const AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_DESIGN_SYSTEM_PACKAGE_NAME =
  "@repo/design-system" as const;

const stringArraySchema = z.array(z.string()).readonly();

/* -------------------------------------------------------------------------------------------------
 * AI IDE authority rules
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_AI_AUTHORITY_RULES = {
  tokenOwnsValue: true,
  variantOwnsMeaning: true,
  recipeOwnsStyling: true,
  componentOwnsBehavior: true,
  slotOwnsStructure: true,
  classNameOwnsLayoutOnly: true,
  exportOwnsAccess: true,
  exampleOwnsAiImitation: true,
} as const;

export const AFENDA_AUTHORITY_RULES = AFENDA_AI_AUTHORITY_RULES;

export const afendaAuthorityRulesSchema = z.object({
  tokenOwnsValue: z.literal(true),
  variantOwnsMeaning: z.literal(true),
  recipeOwnsStyling: z.literal(true),
  componentOwnsBehavior: z.literal(true),
  slotOwnsStructure: z.literal(true),
  classNameOwnsLayoutOnly: z.literal(true),
  exportOwnsAccess: z.literal(true),
  exampleOwnsAiImitation: z.literal(true),
});

export type AfendaAuthorityRules = z.infer<typeof afendaAuthorityRulesSchema>;

/* -------------------------------------------------------------------------------------------------
 * Required anti-drift wall
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_REQUIRED_CORE_CONTRACTS = [
  "afenda-design-system.contract.ts",
  "token.contract.ts",
  "recipe.contract.ts",
  "component.contract.ts",
  "slot.contract.ts",
  "variant.contract.ts",
  "class-name-policy.contract.ts",
  "export.contract.ts",
] as const;

export const AFENDA_REQUIRED_AI_SAFETY_CONTRACTS = [
  "accessibility.contract.ts",
  "motion.contract.ts",
  "state.contract.ts",
  "example.contract.ts",
] as const;

export const AFENDA_AI_REQUIRED_CONTRACTS = [
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
] as const;

/* -------------------------------------------------------------------------------------------------
 * AI hard-fail rules
 * -----------------------------------------------------------------------------------------------*/

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

export const afendaAiHardFailRuleSchema = z.enum(AFENDA_AI_HARD_FAIL_RULES);

export type AfendaAiHardFailRule = z.infer<
  typeof afendaAiHardFailRuleSchema
>;

/* -------------------------------------------------------------------------------------------------
 * AI IDE drift gate
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_AI_DRIFT_SCORE_GATE = {
  minimumScore: 95,
  failOnRawSemanticTailwind: true,
  failOnUngovernedVariant: true,
  failOnMissingDataSlot: true,
  failOnPrivateImport: true,
  failOnBusinessLogic: true,
  failOnUnsafeExample: true,
} as const;

export const afendaAiDriftScoreGateSchema = z.object({
  minimumScore: z.literal(95),
  failOnRawSemanticTailwind: z.literal(true),
  failOnUngovernedVariant: z.literal(true),
  failOnMissingDataSlot: z.literal(true),
  failOnPrivateImport: z.literal(true),
  failOnBusinessLogic: z.literal(true),
  failOnUnsafeExample: z.literal(true),
});

export type AfendaAiDriftScoreGate = z.infer<
  typeof afendaAiDriftScoreGateSchema
>;

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

export const afendaAiVibeCodingGateSchema = z.object({
  minimumScore: z.literal(95),
  hardFailOverridesScore: z.literal(true),
  requirePublicExportsOnly: z.literal(true),
  requireGovernedVariantsOnly: z.literal(true),
  requireRecipeForSlots: z.literal(true),
  requireExamplesCopyPasteSafe: z.literal(true),
  requireRegistryKnownComponents: z.literal(true),
  requireRegistryKnownRecipes: z.literal(true),
  requireContractKnownSlots: z.literal(true),
  forbidUnregisteredSemanticAliases: z.literal(true),
  forbidLocalVocabularyDeclarations: z.literal(true),
  requireCurrentExampleContractVersion: z.literal(true),
});

export type AfendaAiVibeCodingGate = z.infer<
  typeof afendaAiVibeCodingGateSchema
>;

/* -------------------------------------------------------------------------------------------------
 * AI-safe example rules
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_EXAMPLE_RULES = {
  mustBeCopyPasteSafe: true,
  mustUsePublicExportsOnly: true,
  mustUseRecipe: true,
  mustUseDataSlot: true,
  mustNotUseRawSemanticTailwind: true,
  mustNotContainBusinessLogic: true,
} as const;

export const afendaExampleRulesSchema = z.object({
  mustBeCopyPasteSafe: z.literal(true),
  mustUsePublicExportsOnly: z.literal(true),
  mustUseRecipe: z.literal(true),
  mustUseDataSlot: z.literal(true),
  mustNotUseRawSemanticTailwind: z.literal(true),
  mustNotContainBusinessLogic: z.literal(true),
});

export type AfendaExampleRules = z.infer<typeof afendaExampleRulesSchema>;

/* -------------------------------------------------------------------------------------------------
 * Variant governance
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_VARIANT_GOVERNANCE_RULES = {
  variantsMustBeDeclaredInContract: true,
  variantsMustMapToRecipes: true,
  variantsMustNotEncodeRawColor: true,
  variantsMustNotBeInventedInAppCode: true,
  variantNamesMustUseSemanticVocabulary: true,
  unrecognizedVariantIsHardFail: true,
} as const;

export const afendaVariantGovernanceRulesSchema = z.object({
  variantsMustBeDeclaredInContract: z.literal(true),
  variantsMustMapToRecipes: z.literal(true),
  variantsMustNotEncodeRawColor: z.literal(true),
  variantsMustNotBeInventedInAppCode: z.literal(true),
  variantNamesMustUseSemanticVocabulary: z.literal(true),
  unrecognizedVariantIsHardFail: z.literal(true),
});

export type AfendaVariantGovernanceRules = z.infer<
  typeof afendaVariantGovernanceRulesSchema
>;

/* -------------------------------------------------------------------------------------------------
 * className escape-hatch guardrails
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_CLASS_NAME_ESCAPE_HATCH_RULES = {
  allowedPrefixesNeverOverrideSemanticIdentity: true,
  arbitraryValuesRequireTokenReference: true,
  bracketColorValuesAreHardFail: true,
  bracketSpacingValuesAreHardFailUnlessTokenized: true,
  allowedLayoutClassesMustStayOutsideRecipes: false,
} as const;

export const afendaClassNameEscapeHatchRulesSchema = z.object({
  allowedPrefixesNeverOverrideSemanticIdentity: z.literal(true),
  arbitraryValuesRequireTokenReference: z.literal(true),
  bracketColorValuesAreHardFail: z.literal(true),
  bracketSpacingValuesAreHardFailUnlessTokenized: z.literal(true),
  allowedLayoutClassesMustStayOutsideRecipes: z.literal(false),
});

export type AfendaClassNameEscapeHatchRules = z.infer<
  typeof afendaClassNameEscapeHatchRulesSchema
>;

/* -------------------------------------------------------------------------------------------------
 * Registry and identity authority
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_REGISTRY_AUTHORITY_RULES = {
  registryOwnsVocabulary: true,
  registryOwnsComponentIdentity: true,
  registryOwnsRecipeIdentity: true,
  registryOwnsVariantIdentity: true,
  registryOwnsSlotIdentity: true,
} as const;

export const afendaRegistryAuthorityRulesSchema = z.object({
  registryOwnsVocabulary: z.literal(true),
  registryOwnsComponentIdentity: z.literal(true),
  registryOwnsRecipeIdentity: z.literal(true),
  registryOwnsVariantIdentity: z.literal(true),
  registryOwnsSlotIdentity: z.literal(true),
});

export type AfendaRegistryAuthorityRules = z.infer<
  typeof afendaRegistryAuthorityRulesSchema
>;

export const AFENDA_COMPONENT_IDENTITY_RULES = {
  componentNamesMustExistInRegistry: true,
  unknownComponentNameIsHardFail: true,
  componentAliasesMustResolveToRegistry: true,
} as const;

export const afendaComponentIdentityRulesSchema = z.object({
  componentNamesMustExistInRegistry: z.literal(true),
  unknownComponentNameIsHardFail: z.literal(true),
  componentAliasesMustResolveToRegistry: z.literal(true),
});

export type AfendaComponentIdentityRules = z.infer<
  typeof afendaComponentIdentityRulesSchema
>;

export const AFENDA_RECIPE_IDENTITY_RULES = {
  recipeNamesMustExistInRegistry: true,
  unknownRecipeIsHardFail: true,
  recipeAliasesMustResolveToRegistry: true,
} as const;

export const afendaRecipeIdentityRulesSchema = z.object({
  recipeNamesMustExistInRegistry: z.literal(true),
  unknownRecipeIsHardFail: z.literal(true),
  recipeAliasesMustResolveToRegistry: z.literal(true),
});

export type AfendaRecipeIdentityRules = z.infer<
  typeof afendaRecipeIdentityRulesSchema
>;

export const AFENDA_SLOT_IDENTITY_RULES = {
  slotNamesMustExistInContract: true,
  unknownSlotIsHardFail: true,
  slotAliasesMustResolveToContract: true,
} as const;

export const afendaSlotIdentityRulesSchema = z.object({
  slotNamesMustExistInContract: z.literal(true),
  unknownSlotIsHardFail: z.literal(true),
  slotAliasesMustResolveToContract: z.literal(true),
});

export type AfendaSlotIdentityRules = z.infer<
  typeof afendaSlotIdentityRulesSchema
>;

/* -------------------------------------------------------------------------------------------------
 * Semantic alias and local vocabulary drift
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_SEMANTIC_ALIAS_RULES = {
  unregisteredSemanticAliasIsHardFail: true,
  aliasesMustResolveToCanonicalVocabulary: true,
  canonicalVocabularyWinsOverSynonyms: true,
} as const;

export const afendaSemanticAliasRulesSchema = z.object({
  unregisteredSemanticAliasIsHardFail: z.literal(true),
  aliasesMustResolveToCanonicalVocabulary: z.literal(true),
  canonicalVocabularyWinsOverSynonyms: z.literal(true),
});

export type AfendaSemanticAliasRules = z.infer<
  typeof afendaSemanticAliasRulesSchema
>;

export const AFENDA_FORBIDDEN_SEMANTIC_ALIASES = {
  critical: ["danger", "destructive", "error", "negative"],
  info: ["notice", "informational"],
  neutral: ["default", "base", "plain"],
  success: ["approved", "good", "positive"],
  warning: ["caution", "pending"],
} as const;

export const AFENDA_LOCAL_VOCABULARY_RULES = {
  localVocabularyDeclarationsAreForbidden: true,
  localEnumsMustReferenceContract: true,
  localVariantArraysAreHardFail: true,
  localToneArraysAreHardFail: true,
  localStateArraysAreHardFail: true,
} as const;

export const afendaLocalVocabularyRulesSchema = z.object({
  localVocabularyDeclarationsAreForbidden: z.literal(true),
  localEnumsMustReferenceContract: z.literal(true),
  localVariantArraysAreHardFail: z.literal(true),
  localToneArraysAreHardFail: z.literal(true),
  localStateArraysAreHardFail: z.literal(true),
});

export type AfendaLocalVocabularyRules = z.infer<
  typeof afendaLocalVocabularyRulesSchema
>;

/* -------------------------------------------------------------------------------------------------
 * Source-of-truth priority and example versioning
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_SOURCE_OF_TRUTH_PRIORITY = [
  "registry",
  "contract",
  "token",
  "recipe",
  "component",
  "example",
] as const;

export const afendaSourceOfTruthLayerSchema = z.enum(
  AFENDA_SOURCE_OF_TRUTH_PRIORITY
);

export type AfendaSourceOfTruthLayer = z.infer<
  typeof afendaSourceOfTruthLayerSchema
>;

export const AFENDA_EXAMPLE_VERSION_RULES = {
  examplesMustDeclareContractVersion: true,
  staleExamplesAreHardFail: true,
  examplesMustImportCurrentContract: true,
} as const;

export const afendaExampleVersionRulesSchema = z.object({
  examplesMustDeclareContractVersion: z.literal(true),
  staleExamplesAreHardFail: z.literal(true),
  examplesMustImportCurrentContract: z.literal(true),
});

export type AfendaExampleVersionRules = z.infer<
  typeof afendaExampleVersionRulesSchema
>;

/* -------------------------------------------------------------------------------------------------
 * Layers
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_DESIGN_SYSTEM_LAYERS = [
  "registry",
  "contract",
  "token",
  "recipe",
  "component",
  "primitive",
  "pattern",
  "documentation",
] as const;

export const afendaDesignSystemLayerSchema = z.enum(
  AFENDA_DESIGN_SYSTEM_LAYERS
);

export type AfendaDesignSystemLayer = z.infer<
  typeof afendaDesignSystemLayerSchema
>;

/* -------------------------------------------------------------------------------------------------
 * Token domains
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_TOKEN_DOMAINS = [
  "color",
  "typography",
  "spacing",
  "radius",
  "shadow",
  "border",
  "motion",
  "duration",
  "easing",
  "z-index",
  "breakpoint",
  "density",
  "opacity",
  "layout",
] as const;

export const afendaTokenDomainSchema = z.enum(AFENDA_TOKEN_DOMAINS);

export type AfendaTokenDomain = z.infer<typeof afendaTokenDomainSchema>;

/* -------------------------------------------------------------------------------------------------
 * Component categories
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_COMPONENT_CATEGORIES = [
  "primitive",
  "form",
  "feedback",
  "navigation",
  "overlay",
  "data-display",
  "layout",
  "surface",
  "disclosure",
  "composition",
] as const;

export const afendaComponentCategorySchema = z.enum(
  AFENDA_COMPONENT_CATEGORIES
);

export type AfendaComponentCategory = z.infer<
  typeof afendaComponentCategorySchema
>;

/* -------------------------------------------------------------------------------------------------
 * Shared semantic vocabularies
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_TONES = [
  "neutral",
  "info",
  "success",
  "warning",
  "critical",
] as const;

export const afendaToneSchema = z.enum(AFENDA_TONES);

export type AfendaTone = z.infer<typeof afendaToneSchema>;

export const AFENDA_DENSITIES = [
  "compact",
  "default",
  "comfortable",
] as const;

export const afendaDensitySchema = z.enum(AFENDA_DENSITIES);

export type AfendaDensity = z.infer<typeof afendaDensitySchema>;

export const AFENDA_EMPHASIS = ["low", "medium", "high"] as const;

export const afendaEmphasisSchema = z.enum(AFENDA_EMPHASIS);

export type AfendaEmphasis = z.infer<typeof afendaEmphasisSchema>;

export const AFENDA_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const afendaSizeSchema = z.enum(AFENDA_SIZES);

export type AfendaSize = z.infer<typeof afendaSizeSchema>;

export const AFENDA_STATES = [
  "default",
  "hover",
  "focus",
  "active",
  "selected",
  "open",
  "closed",
  "disabled",
  "loading",
  "readonly",
  "invalid",
  "empty",
  "error",
  "success",
  "warning",
] as const;

export const afendaStateSchema = z.enum(AFENDA_STATES);

export type AfendaState = z.infer<typeof afendaStateSchema>;

/* -------------------------------------------------------------------------------------------------
 * Styling authority
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_STYLE_AUTHORITIES = [
  "token",
  "recipe",
  "component-prop",
  "slot",
  "class-name-layout-only",
] as const;

export const afendaStyleAuthoritySchema = z.enum(AFENDA_STYLE_AUTHORITIES);

export type AfendaStyleAuthority = z.infer<
  typeof afendaStyleAuthoritySchema
>;

export const AFENDA_CLASS_NAME_POLICIES = [
  "none",
  "layout-only",
  "safe-extension",
  "internal-only",
] as const;

export const afendaClassNamePolicySchema = z.enum(
  AFENDA_CLASS_NAME_POLICIES
);

export type AfendaClassNamePolicy = z.infer<
  typeof afendaClassNamePolicySchema
>;

/**
 * className may adjust placement/layout.
 * className must not redefine semantic identity.
 */
export const AFENDA_ALLOWED_CLASS_NAME_PREFIXES = [
  "w-",
  "min-w-",
  "max-w-",
  "h-",
  "min-h-",
  "max-h-",
  "flex",
  "grid",
  "block",
  "inline",
  "hidden",
  "relative",
  "absolute",
  "sticky",
  "fixed",
  "static",
  "inset-",
  "top-",
  "right-",
  "bottom-",
  "left-",
  "z-",
  "overflow-",
  "object-",
  "aspect-",
  "order-",
  "col-",
  "row-",
  "self-",
  "items-",
  "justify-",
  "place-",
  "content-",
  "mt-",
  "mr-",
  "mb-",
  "ml-",
  "mx-",
  "my-",
] as const;

export const AFENDA_FORBIDDEN_CLASS_NAME_PREFIXES = [
  "bg-",
  "text-",
  "border-",
  "shadow",
  "rounded",
  "ring-",
  "outline-",
  "p-",
  "px-",
  "py-",
  "pt-",
  "pr-",
  "pb-",
  "pl-",
  "gap-",
  "font-",
  "leading-",
  "tracking-",
  "opacity-",
  "duration-",
  "ease-",
  "animate-",
  "transition",
] as const;

/* -------------------------------------------------------------------------------------------------
 * Slots
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_SLOT_POLICY = {
  requiredDataSlot: true,
  slotNamesUseKebabCase: true,
  slotClassNameMustUseRecipe: true,
  slotMayExposeClassName: true,
  slotClassNamePolicy: "layout-only",
} as const satisfies {
  readonly requiredDataSlot: boolean;
  readonly slotNamesUseKebabCase: boolean;
  readonly slotClassNameMustUseRecipe: boolean;
  readonly slotMayExposeClassName: boolean;
  readonly slotClassNamePolicy: AfendaClassNamePolicy;
};

/* -------------------------------------------------------------------------------------------------
 * Import / export boundaries
 * -----------------------------------------------------------------------------------------------*/

export const AFENDA_PUBLIC_EXPORTS = [
  "@repo/design-system",
  "@repo/design-system/design-system",
  "@repo/design-system/contracts/afenda-design-system",
  "@repo/design-system/contracts/component-scorecards",
  "@repo/design-system/contracts/contribution-lifecycle",
  "@repo/design-system/contracts/enterprise-screen-patterns",
  "@repo/design-system/contracts/pattern-library",
  "@repo/design-system/lib/utils",
  "@repo/design-system/styles/globals.css",
  "@repo/design-system/tokens/token-usage.policy",
  "@repo/design-system/tokens/tokens.json",
] as const;

export const AFENDA_FORBIDDEN_IMPORT_PATTERNS = [
  "@repo/design-system/src/",
  "@repo/design-system/internal/",
  "@repo/design-system/components/internal/",
  "@repo/design-system/components/ui/",
  "../internal/",
  "./internal/",
] as const;

/* -------------------------------------------------------------------------------------------------
 * Component governance entry
 * -----------------------------------------------------------------------------------------------*/

export const afendaComponentGovernanceSchema = z.object({
  id: z.string().min(1),
  category: afendaComponentCategorySchema,
  status: z.enum(["active", "experimental", "deprecated", "removed"]),
  ownerLayer: afendaDesignSystemLayerSchema,
  allowedTones: z.array(afendaToneSchema).readonly().default(["neutral"]),
  allowedDensities: z
    .array(afendaDensitySchema)
    .readonly()
    .default(["default"]),
  allowedEmphasis: z
    .array(afendaEmphasisSchema)
    .readonly()
    .default(["medium"]),
  allowedSizes: z.array(afendaSizeSchema).readonly().default(["md"]),
  classNamePolicy: afendaClassNamePolicySchema.default("layout-only"),
  requiresDataSlot: z.boolean().default(true),
  requiresRecipe: z.boolean().default(true),
  allowsRawTailwind: z.boolean().default(false),
  allowsBusinessLogic: z.boolean().default(false),
});

export type AfendaComponentGovernance = z.infer<
  typeof afendaComponentGovernanceSchema
>;

/* -------------------------------------------------------------------------------------------------
 * Master contract
 * -----------------------------------------------------------------------------------------------*/

export const afendaDesignSystemContractSchema = z.object({
  id: z.literal(AFENDA_DESIGN_SYSTEM_CONTRACT_ID),
  version: z.literal(AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION),
  packageName: z.literal(AFENDA_DESIGN_SYSTEM_PACKAGE_NAME),

  authorityRules: afendaAuthorityRulesSchema,
  aiAuthorityRules: afendaAuthorityRulesSchema,
  aiRequiredContracts: stringArraySchema,
  aiHardFailRules: z.array(afendaAiHardFailRuleSchema).readonly(),
  aiVibeCodingGate: afendaAiVibeCodingGateSchema,
  requiredContracts: z.object({
    core: stringArraySchema,
    aiSafety: stringArraySchema,
  }),
  aiDriftScoreGate: afendaAiDriftScoreGateSchema,
  variantGovernance: afendaVariantGovernanceRulesSchema,
  registryAuthority: afendaRegistryAuthorityRulesSchema,
  componentIdentity: afendaComponentIdentityRulesSchema,
  recipeIdentity: afendaRecipeIdentityRulesSchema,
  slotIdentity: afendaSlotIdentityRulesSchema,
  semanticAliasRules: afendaSemanticAliasRulesSchema,
  forbiddenSemanticAliases: z.record(z.string(), stringArraySchema),
  localVocabularyRules: afendaLocalVocabularyRulesSchema,
  sourceOfTruthPriority: z.array(afendaSourceOfTruthLayerSchema).readonly(),
  exampleVersionRules: afendaExampleVersionRulesSchema,

  layers: z.array(afendaDesignSystemLayerSchema).readonly(),
  tokenDomains: z.array(afendaTokenDomainSchema).readonly(),
  componentCategories: z.array(afendaComponentCategorySchema).readonly(),

  vocabularies: z.object({
    tones: z.array(afendaToneSchema).readonly(),
    densities: z.array(afendaDensitySchema).readonly(),
    emphasis: z.array(afendaEmphasisSchema).readonly(),
    sizes: z.array(afendaSizeSchema).readonly(),
    states: z.array(afendaStateSchema).readonly(),
  }),

  styling: z.object({
    authorities: z.array(afendaStyleAuthoritySchema).readonly(),
    defaultClassNamePolicy: afendaClassNamePolicySchema,
    allowedClassNamePrefixes: stringArraySchema,
    forbiddenClassNamePrefixes: stringArraySchema,
    classNameEscapeHatchRules: afendaClassNameEscapeHatchRulesSchema,
  }),

  slots: z.object({
    requiredDataSlot: z.boolean(),
    slotNamesUseKebabCase: z.boolean(),
    slotClassNameMustUseRecipe: z.boolean(),
    slotMayExposeClassName: z.boolean(),
    slotClassNamePolicy: afendaClassNamePolicySchema,
  }),

  examples: afendaExampleRulesSchema,

  boundaries: z.object({
    publicExports: stringArraySchema,
    forbiddenImportPatterns: stringArraySchema,
  }),

  principles: stringArraySchema,
});

export type AfendaDesignSystemContract = z.infer<
  typeof afendaDesignSystemContractSchema
>;

export const afendaDesignSystemContract = {
  id: AFENDA_DESIGN_SYSTEM_CONTRACT_ID,
  version: AFENDA_DESIGN_SYSTEM_CONTRACT_VERSION,
  packageName: AFENDA_DESIGN_SYSTEM_PACKAGE_NAME,

  authorityRules: AFENDA_AI_AUTHORITY_RULES,
  aiAuthorityRules: AFENDA_AI_AUTHORITY_RULES,
  aiRequiredContracts: AFENDA_AI_REQUIRED_CONTRACTS,
  aiHardFailRules: AFENDA_AI_HARD_FAIL_RULES,
  aiVibeCodingGate: AFENDA_AI_VIBE_CODING_GATE,
  requiredContracts: {
    core: AFENDA_REQUIRED_CORE_CONTRACTS,
    aiSafety: AFENDA_REQUIRED_AI_SAFETY_CONTRACTS,
  },
  aiDriftScoreGate: AFENDA_AI_DRIFT_SCORE_GATE,
  variantGovernance: AFENDA_VARIANT_GOVERNANCE_RULES,
  registryAuthority: AFENDA_REGISTRY_AUTHORITY_RULES,
  componentIdentity: AFENDA_COMPONENT_IDENTITY_RULES,
  recipeIdentity: AFENDA_RECIPE_IDENTITY_RULES,
  slotIdentity: AFENDA_SLOT_IDENTITY_RULES,
  semanticAliasRules: AFENDA_SEMANTIC_ALIAS_RULES,
  forbiddenSemanticAliases: AFENDA_FORBIDDEN_SEMANTIC_ALIASES,
  localVocabularyRules: AFENDA_LOCAL_VOCABULARY_RULES,
  sourceOfTruthPriority: AFENDA_SOURCE_OF_TRUTH_PRIORITY,
  exampleVersionRules: AFENDA_EXAMPLE_VERSION_RULES,

  layers: AFENDA_DESIGN_SYSTEM_LAYERS,
  tokenDomains: AFENDA_TOKEN_DOMAINS,
  componentCategories: AFENDA_COMPONENT_CATEGORIES,

  vocabularies: {
    tones: AFENDA_TONES,
    densities: AFENDA_DENSITIES,
    emphasis: AFENDA_EMPHASIS,
    sizes: AFENDA_SIZES,
    states: AFENDA_STATES,
  },

  styling: {
    authorities: AFENDA_STYLE_AUTHORITIES,
    defaultClassNamePolicy: "layout-only",
    allowedClassNamePrefixes: AFENDA_ALLOWED_CLASS_NAME_PREFIXES,
    forbiddenClassNamePrefixes: AFENDA_FORBIDDEN_CLASS_NAME_PREFIXES,
    classNameEscapeHatchRules: AFENDA_CLASS_NAME_ESCAPE_HATCH_RULES,
  },

  slots: AFENDA_SLOT_POLICY,

  examples: AFENDA_EXAMPLE_RULES,

  boundaries: {
    publicExports: AFENDA_PUBLIC_EXPORTS,
    forbiddenImportPatterns: AFENDA_FORBIDDEN_IMPORT_PATTERNS,
  },

  principles: [
    "contracts-own-vocabulary",
    "tokens-own-values",
    "recipes-own-presentation",
    "components-own-behavior",
    "slots-own-structure",
    "class-name-is-layout-only",
    "business-logic-is-forbidden-in-design-system",
    "raw-tailwind-must-not-create-semantic-meaning",
    "public-exports-are-the-only-supported-import-surface",
    "examples-must-be-copy-paste-safe-for-ai-agents",
  ],
} as const satisfies AfendaDesignSystemContract;

/* -------------------------------------------------------------------------------------------------
 * Runtime assertion
 * -----------------------------------------------------------------------------------------------*/

export function assertAfendaDesignSystemContract(
  value: unknown
): AfendaDesignSystemContract {
  return afendaDesignSystemContractSchema.parse(value);
}

export const parsedAfendaDesignSystemContract =
  assertAfendaDesignSystemContract(afendaDesignSystemContract);
