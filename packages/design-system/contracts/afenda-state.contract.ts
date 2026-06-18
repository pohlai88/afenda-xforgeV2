/**
 * Afenda State Contract
 *
 * State owns lifecycle condition.
 *
 * Purpose:
 * - Define state vocabulary.
 * - Govern interaction, validation, loading, visibility, and lifecycle states.
 * - Prevent components, variants, recipes, slots, and examples from inventing local states.
 * - Keep state names deterministic for styling, accessibility, testing, and AI coding.
 *
 * This file must not contain styling values, component logic, or business logic.
 */

export const AFENDA_STATE_CONTRACT_ID = "afenda.state" as const;

export const AFENDA_STATE_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_STATES = [
  "default",
  "hover",
  "focus",
  "active",
  "selected",
  "checked",
  "indeterminate",
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

export type AfendaState = (typeof AFENDA_STATES)[number];

export const AFENDA_STATE_AUTHORITY_RULES = {
  stateOwnsLifecycleCondition: true,
  stateOwnsInteractionVocabulary: true,
  stateOwnsValidationVocabulary: true,
  stateOwnsVisibilityVocabulary: true,
  stateOwnsAsyncVocabulary: true,
} as const;

export const AFENDA_STATE_FORBIDDEN_OWNERSHIP = {
  componentsMustNotInventStates: true,
  variantsMustNotInventStates: true,
  recipesMustNotInventStates: true,
  slotsMustNotInventStates: true,
  examplesMustNotInventStates: true,
  statesMustNotOwnStyling: true,
  statesMustNotOwnValues: true,
  statesMustNotOwnBusinessLogic: true,
} as const;

export const AFENDA_STATE_NAMING_RULES = {
  stateNamesMustUseContractVocabulary: true,
  stateNamesMustUseKebabCaseWhenSerialized: true,
  stateNamesMustNotEncodeStyling: true,
  stateNamesMustNotEncodeBusinessMeaning: true,
  unknownStateIsHardFail: true,
} as const;

export const AFENDA_STATE_COMPONENT_RULES = {
  componentsMayExposeStateProps: true,
  componentsMustUseContractStates: true,
  componentsMustReflectStateThroughDataAttributes: true,
  componentsMustReflectInvalidStateThroughAriaInvalid: true,
  componentsMustReflectDisabledStateThroughNativeDisabledWhenPossible: true,
  componentsMustNotCreateLocalStateVocabulary: true,
} as const;

export const AFENDA_STATE_RECIPE_RULES = {
  recipesMayTargetContractStates: true,
  recipesMustNotInventStates: true,
  recipesMustNotOwnStateMeaning: true,
  stateStylingMustComeFromRecipes: true,
} as const;

export const AFENDA_STATE_VARIANT_RULES = {
  variantsMustNotReplaceStates: true,
  variantsMustNotEncodeLifecycleCondition: true,
  stateAndVariantMustRemainSeparate: true,
} as const;

export const AFENDA_STATE_ACCESSIBILITY_RULES = {
  invalidStateMustMapToAriaInvalid: true,
  expandedStateMustMapToAriaExpandedWhenApplicable: true,
  selectedStateMustMapToAriaSelectedWhenApplicable: true,
  disabledStateMustBeProgrammaticallyDisabledWhenPossible: true,
  loadingStateMustExposeBusyWhenApplicable: true,
} as const;

export const AFENDA_STATE_FORBIDDEN_ALIASES = {
  readonly: ["read-only", "locked"],
  disabled: ["inactive", "blocked"],
  loading: ["pending", "fetching", "submitting"],
  invalid: ["error-state", "wrong"],
  empty: ["blank", "none"],
} as const;

export const AFENDA_STATE_FORBIDDEN_PATTERNS = [
  "isBlocked",
  "isLocked",
  "read-only",
  "error-state",
] as const;

export const AFENDA_STATE_WARNING_PATTERNS = [
  "isPending",
  "isFetching",
  "isSubmitting",
] as const;

export const AFENDA_STATE_SOURCE_OF_TRUTH = [
  "afenda-state.contract.ts",
  "afenda-component.contract.ts",
  "afenda-accessibility.contract.ts",
  "afenda-recipe.contract.ts",
] as const;

export const AFENDA_STATE_PRINCIPLES = [
  "state-owns-lifecycle-condition",
  "state-vocabulary-is-canonical",
  "state-does-not-own-styling",
  "state-does-not-own-token-values",
  "state-and-variant-remain-separate",
  "state-is-reflected-through-data-attributes",
  "accessibility-state-must-remain-synchronized",
  "unknown-state-is-hard-fail",
] as const;

export const afendaStateContract = {
  id: AFENDA_STATE_CONTRACT_ID,
  version: AFENDA_STATE_CONTRACT_VERSION,
  states: AFENDA_STATES,
  authorityRules: AFENDA_STATE_AUTHORITY_RULES,
  forbiddenOwnership: AFENDA_STATE_FORBIDDEN_OWNERSHIP,
  namingRules: AFENDA_STATE_NAMING_RULES,
  componentRules: AFENDA_STATE_COMPONENT_RULES,
  recipeRules: AFENDA_STATE_RECIPE_RULES,
  variantRules: AFENDA_STATE_VARIANT_RULES,
  accessibilityRules: AFENDA_STATE_ACCESSIBILITY_RULES,
  forbiddenAliases: AFENDA_STATE_FORBIDDEN_ALIASES,
  forbiddenPatterns: AFENDA_STATE_FORBIDDEN_PATTERNS,
  warningPatterns: AFENDA_STATE_WARNING_PATTERNS,
  sourceOfTruth: AFENDA_STATE_SOURCE_OF_TRUTH,
  principles: AFENDA_STATE_PRINCIPLES,
} as const;

export type AfendaStateContract = typeof afendaStateContract;
