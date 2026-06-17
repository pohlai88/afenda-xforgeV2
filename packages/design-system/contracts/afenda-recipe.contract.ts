/**
 * Afenda Recipe Contract
 *
 * Recipe owns styling.
 *
 * Purpose:
 * - Define recipe authority.
 * - Govern styling composition.
 * - Prevent components, variants, slots, and examples from owning styling.
 * - Ensure recipes consume tokens and expose stable styling names.
 *
 * This file must not contain component logic.
 */

export const AFENDA_RECIPE_CONTRACT_ID = "afenda.recipe" as const;

export const AFENDA_RECIPE_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_RECIPE_KINDS = [
  "layout",
  "surface",
  "typography",
  "interaction",
  "motion",
  "state",
  "slot",
  "component",
  "composition",
] as const;

export type AfendaRecipeKind = (typeof AFENDA_RECIPE_KINDS)[number];

export const AFENDA_RECIPE_IDENTITY_REGISTRY = [
  "bodyText",
  "bodyMediumText",
  "controlText",
  "buttonText",
  "labelText",
  "titleText",
  "captionText",
  "metadataText",
  "badgeText",
  "shortcutText",
  "focusRing",
  "focusRingOnly",
  "invalidState",
  "disabledAction",
  "disabledControl",
  "readOnlyControl",
  "motionReduce",
  "colorTransition",
  "interactiveTransition",
  "controlSurface",
  "flatControlSurface",
  "overlaySurface",
  "panelSurface",
  "modalSurface",
  "controlDefaultSize",
  "controlCompactSize",
  "controlLargeSize",
  "rowItem",
  "rowInset",
  "rowHighlight",
  "rowDisabled",
  "rowCritical",
  "rowCheckboxPadding",
  "rowIcon",
  "rowCriticalIcon",
  "controlIcon",
  "mutedControlIcon",
  "overlayMotion",
  "popoverOrigin",
  "dropdownOrigin",
  "selectOrigin",
  "modalBackdrop",
  "modalHeader",
  "modalFooter",
  "dismissButton",
  "menuLabelInset",
  "menuSeparator",
  "menuSeparatorInset",
  "itemIndicator",
  "itemIndicatorMuted",
  "overlayScrollButton",
  "overlayPadding",
  "menuPadding",
  "panelPadding",
  "modalPadding",
  "fieldGap",
  "sectionGap",
] as const;

export type AfendaRecipeIdentity =
  (typeof AFENDA_RECIPE_IDENTITY_REGISTRY)[number];

export const AFENDA_BLOCK_RECIPE_IDENTITY_REGISTRY = [
  "blockShell",
  "blockStack",
  "blockHeader",
  "blockHeaderContent",
  "blockTitle",
  "blockDescription",
  "blockToolbar",
  "blockPanel",
  "blockPanelPadding",
  "blockSection",
  "blockSectionDivider",
  "blockMetric",
  "blockMetricLabel",
  "blockEmpty",
  "blockCompact",
  "blockComfortable",
  "blockChrome",
  "blockRail",
  "blockStage",
] as const;

export type AfendaBlockRecipeIdentity =
  (typeof AFENDA_BLOCK_RECIPE_IDENTITY_REGISTRY)[number];

export const AFENDA_RECIPE_AUTHORITY_RULES = {
  recipeOwnsStyling: true,
  recipeOwnsClassComposition: true,
  recipeOwnsTokenConsumption: true,
  recipeOwnsSlotStyling: true,
  recipeOwnsStateStyling: true,
  examplesMustNotOwnStyling: true,
} as const;

export const AFENDA_RECIPE_TOKEN_RULES = {
  recipesMustConsumeTokens: true,
  recipesMustNotDeclareTokens: true,
  recipesMustNotUseRawColorValues: true,
  recipesMustNotUseRawSpacingValues: true,
  recipesMustNotUseRawRadiusValues: true,
  recipesMustNotUseRawShadowValues: true,
  recipesMustNotUseRawMotionValues: true,
} as const;

export const AFENDA_RECIPE_VARIANT_RULES = {
  variantsSelectRecipeMeaning: true,
  variantsMustNotOwnStyling: true,
  variantsMustMapToRecipes: true,
  ungovernedVariantStylingIsHardFail: true,
} as const;

export const AFENDA_RECIPE_COMPONENT_RULES = {
  componentsMustUseRecipesForStyling: true,
  componentsMustNotOwnSemanticStyling: true,
  componentsMayOwnBehaviorOnly: true,
  recipesMustNotOwnBehavior: true,
  componentWithoutRecipeIsHardFail: true,
} as const;

export const AFENDA_RECIPE_SLOT_RULES = {
  slotsMustUseRecipeClassNames: true,
  slotsMustNotDeclareStylingMeaning: true,
  slotWithoutRecipeIsHardFail: true,
} as const;

export const AFENDA_RECIPE_CLASS_NAME_RULES = {
  classNameMayExtendLayoutOnly: true,
  classNameMustNotOverrideRecipeMeaning: true,
  classNameMustNotReplaceRecipe: true,
  semanticClassNameOutsideRecipeIsHardFail: true,
} as const;

export const AFENDA_RECIPE_NAMING_RULES = {
  recipeNamesMustUseCamelCase: true,
  recipeNamesMustBeStable: true,
  recipeNamesMustNotEncodeRawValues: true,
  recipeNamesMustUseSemanticMeaning: true,
} as const;

export const AFENDA_RECIPE_IMPORT_RULES = {
  recipesMustBeImportedFromPublicSurface: true,
  privateRecipeImportsAreHardFail: true,
  recipeRegistryOwnsRecipeIdentity: true,
} as const;

export const AFENDA_RECIPE_FORBIDDEN_PATTERNS = [
  "bg-[#",
  "text-[#",
  "border-[#",
  "shadow-[",
  "rounded-[",
  "p-[",
  "m-[",
  "gap-[",
  "duration-[",
  "ease-[",
  "transition-all",
] as const;

export const AFENDA_RECIPE_SOURCE_OF_TRUTH = [
  "afenda-recipe.contract.ts",
  "recipes.ts",
  "tokens.json",
  "globals.css",
] as const;

export const AFENDA_RECIPE_PRINCIPLES = [
  "recipe-owns-styling",
  "recipe-consumes-tokens",
  "variant-selects-meaning",
  "component-owns-behavior-not-styling",
  "slot-owns-structure-not-styling",
  "class-name-extends-layout-only",
  "raw-values-are-forbidden-in-recipes",
] as const;

export const afendaRecipeContract = {
  id: AFENDA_RECIPE_CONTRACT_ID,
  version: AFENDA_RECIPE_CONTRACT_VERSION,
  kinds: AFENDA_RECIPE_KINDS,
  recipeIdentityRegistry: AFENDA_RECIPE_IDENTITY_REGISTRY,
  blockRecipeIdentityRegistry: AFENDA_BLOCK_RECIPE_IDENTITY_REGISTRY,
  authorityRules: AFENDA_RECIPE_AUTHORITY_RULES,
  tokenRules: AFENDA_RECIPE_TOKEN_RULES,
  variantRules: AFENDA_RECIPE_VARIANT_RULES,
  componentRules: AFENDA_RECIPE_COMPONENT_RULES,
  slotRules: AFENDA_RECIPE_SLOT_RULES,
  classNameRules: AFENDA_RECIPE_CLASS_NAME_RULES,
  namingRules: AFENDA_RECIPE_NAMING_RULES,
  importRules: AFENDA_RECIPE_IMPORT_RULES,
  forbiddenPatterns: AFENDA_RECIPE_FORBIDDEN_PATTERNS,
  sourceOfTruth: AFENDA_RECIPE_SOURCE_OF_TRUTH,
  principles: AFENDA_RECIPE_PRINCIPLES,
} as const;

export type AfendaRecipeContract = typeof afendaRecipeContract;
