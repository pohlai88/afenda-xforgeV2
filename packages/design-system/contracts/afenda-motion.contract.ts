/**
 * Afenda Motion Contract
 *
 * Motion owns movement safety.
 *
 * Purpose:
 * - Define motion authority.
 * - Govern animation, transition, duration, easing, and reduced-motion behavior.
 * - Prevent components, recipes, variants, className, and examples from inventing motion.
 * - Keep motion predictable, tokenized, accessible, and safe for AI coding.
 *
 * This file must not contain component logic or business logic.
 */

export const AFENDA_MOTION_CONTRACT_ID = "afenda.motion" as const;

export const AFENDA_MOTION_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_MOTION_AUTHORITY_RULES = {
  motionOwnsMovementSafety: true,
  motionOwnsDurationVocabulary: true,
  motionOwnsEasingVocabulary: true,
  motionOwnsReducedMotionPolicy: true,
  motionOwnsAnimationSafety: true,
} as const;

export const AFENDA_MOTION_DURATIONS = [
  "instant",
  "fast",
  "normal",
  "slow",
] as const;

export type AfendaMotionDuration = (typeof AFENDA_MOTION_DURATIONS)[number];

export const AFENDA_MOTION_EASINGS = [
  "linear",
  "standard",
  "entrance",
  "exit",
  "emphasized",
] as const;

export type AfendaMotionEasing = (typeof AFENDA_MOTION_EASINGS)[number];

export const AFENDA_MOTION_USAGE_RULES = {
  motionMustUseTokens: true,
  durationMustUseContractVocabulary: true,
  easingMustUseContractVocabulary: true,
  reducedMotionMustBeSupported: true,
  animationMustBePurposeful: true,
  motionMustNotBlockInteraction: true,
} as const;

export const AFENDA_MOTION_FORBIDDEN_OWNERSHIP = {
  componentsMustNotDeclareMotionValues: true,
  recipesMustNotDeclareRawMotionValues: true,
  variantsMustNotDeclareMotionValues: true,
  classNameMustNotDeclareMotionValues: true,
  examplesMustNotDeclareMotionValues: true,
  motionMustNotOwnBusinessLogic: true,
} as const;

export const AFENDA_MOTION_RECIPE_RULES = {
  recipesMayComposeMotionTokens: true,
  recipesMustNotUseRawDurationValues: true,
  recipesMustNotUseRawEasingValues: true,
  recipesMustIncludeMotionReduceFallback: true,
} as const;

export const AFENDA_MOTION_COMPONENT_RULES = {
  componentsMayTriggerMotionState: true,
  componentsMustNotOwnMotionValues: true,
  componentsMustNotDependOnAnimationForMeaning: true,
  componentsMustRemainUsableWhenMotionReduced: true,
} as const;

export const AFENDA_MOTION_ACCESSIBILITY_RULES = {
  prefersReducedMotionMustBeRespected: true,
  essentialMotionMustHaveReducedAlternative: true,
  infiniteAnimationMustBeAvoidedUnlessNonEssential: true,
  flashingMotionIsForbidden: true,
  motionMustNotCauseLayoutInstability: true,
} as const;

export const AFENDA_MOTION_CLASS_NAME_RULES = {
  classNameMustNotOwnDuration: true,
  classNameMustNotOwnEasing: true,
  classNameMustNotOwnAnimation: true,
  transitionAllIsForbidden: true,
} as const;

export const AFENDA_MOTION_FORBIDDEN_PATTERNS = [
  "transition-all",
  "duration-[",
  "ease-[",
  "animate-[",
  "infinite",
  "cubic-bezier(",
  "ms]",
  "s]",
] as const;

export const AFENDA_MOTION_WARNING_PATTERNS = [
  "transition",
  "duration-",
  "ease-",
  "animate-",
  "animate-spin",
  "animate-pulse",
] as const;

export const AFENDA_MOTION_SOURCE_OF_TRUTH = [
  "afenda-motion.contract.ts",
  "afenda-token.contract.ts",
  "afenda-recipe.contract.ts",
] as const;

export const AFENDA_MOTION_PRINCIPLES = [
  "motion-owns-movement-safety",
  "motion-values-are-tokenized",
  "duration-uses-contract-vocabulary",
  "easing-uses-contract-vocabulary",
  "reduced-motion-is-required",
  "motion-must-not-carry-meaning-alone",
  "transition-all-is-forbidden",
] as const;

export const afendaMotionContract = {
  id: AFENDA_MOTION_CONTRACT_ID,
  version: AFENDA_MOTION_CONTRACT_VERSION,
  durations: AFENDA_MOTION_DURATIONS,
  easings: AFENDA_MOTION_EASINGS,
  authorityRules: AFENDA_MOTION_AUTHORITY_RULES,
  usageRules: AFENDA_MOTION_USAGE_RULES,
  forbiddenOwnership: AFENDA_MOTION_FORBIDDEN_OWNERSHIP,
  recipeRules: AFENDA_MOTION_RECIPE_RULES,
  componentRules: AFENDA_MOTION_COMPONENT_RULES,
  accessibilityRules: AFENDA_MOTION_ACCESSIBILITY_RULES,
  classNameRules: AFENDA_MOTION_CLASS_NAME_RULES,
  forbiddenPatterns: AFENDA_MOTION_FORBIDDEN_PATTERNS,
  warningPatterns: AFENDA_MOTION_WARNING_PATTERNS,
  sourceOfTruth: AFENDA_MOTION_SOURCE_OF_TRUTH,
  principles: AFENDA_MOTION_PRINCIPLES,
} as const;

export type AfendaMotionContract = typeof afendaMotionContract;
