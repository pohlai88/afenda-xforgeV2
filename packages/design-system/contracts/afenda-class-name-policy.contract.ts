/**
 * Afenda ClassName Policy Contract
 *
 * ClassName owns layout only.
 *
 * Purpose:
 * - Define className escape-hatch rules.
 * - Allow safe layout extension.
 * - Prevent className from owning values, meaning, styling, state, or behavior.
 * - Keep semantic styling inside tokens and recipes.
 *
 * This file must not contain component logic or styling recipes.
 */

export const AFENDA_CLASS_NAME_POLICY_CONTRACT_ID =
  "afenda.class-name-policy" as const;

export const AFENDA_CLASS_NAME_POLICY_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_CLASS_NAME_POLICIES = [
  "none",
  "layout-only",
  "safe-extension",
  "internal-only",
] as const;

export type AfendaClassNamePolicy = (typeof AFENDA_CLASS_NAME_POLICIES)[number];

export const AFENDA_CLASS_NAME_AUTHORITY_RULES = {
  classNameOwnsLayoutOnly: true,
  classNameOwnsPlacementOnly: true,
  classNameOwnsSizingOnly: true,
  classNameOwnsResponsiveLayoutOnly: true,
} as const;

export const AFENDA_CLASS_NAME_FORBIDDEN_OWNERSHIP = {
  classNameMustNotOwnValue: true,
  classNameMustNotOwnMeaning: true,
  classNameMustNotOwnSemanticStyling: true,
  classNameMustNotOwnRecipe: true,
  classNameMustNotOwnVariant: true,
  classNameMustNotOwnState: true,
  classNameMustNotOwnBehavior: true,
  classNameMustNotOwnBusinessLogic: true,
} as const;

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

export const AFENDA_CLASS_NAME_ESCAPE_HATCH_RULES = {
  classNameMayExtendLayoutOnly: true,
  classNameMustNotOverrideSemanticIdentity: true,
  classNameMustNotReplaceRecipe: true,
  classNameMustNotReplaceVariant: true,
  classNameMustNotReplaceSlot: true,
  arbitraryValuesRequireTokenReference: true,
  bracketColorValuesAreHardFail: true,
  bracketSpacingValuesAreHardFailUnlessTokenized: true,
} as const;

export const AFENDA_CLASS_NAME_COMPONENT_RULES = {
  componentsMayExposeClassName: true,
  componentsMustTreatClassNameAsLayoutOnly: true,
  componentsMustApplyRecipeBeforeClassName: true,
  componentsMustNotDependOnClassNameForBehavior: true,
} as const;

export const AFENDA_CLASS_NAME_RECIPE_RULES = {
  recipesOwnSemanticClassNames: true,
  classNameMustNotInlineRecipeClasses: true,
  semanticClassNameOutsideRecipeIsHardFail: true,
} as const;

export const AFENDA_CLASS_NAME_FORBIDDEN_PATTERNS = [
  "bg-[#",
  "text-[#",
  "border-[#",
  "shadow-[",
  "rounded-[",
  "ring-[#",
  "outline-[#",
  "p-[",
  "px-[",
  "py-[",
  "gap-[",
  "font-[",
  "leading-[",
  "tracking-[",
  "opacity-[",
  "duration-[",
  "ease-[",
  "animate-[",
  "transition-all",
] as const;

export const AFENDA_CLASS_NAME_SOURCE_OF_TRUTH = [
  "afenda-class-name-policy.contract.ts",
  "afenda-recipe.contract.ts",
  "afenda-token.contract.ts",
] as const;

export const AFENDA_CLASS_NAME_PRINCIPLES = [
  "class-name-owns-layout-only",
  "class-name-does-not-own-value",
  "class-name-does-not-own-meaning",
  "class-name-does-not-own-semantic-styling",
  "class-name-does-not-replace-recipe",
  "class-name-does-not-replace-variant",
  "class-name-is-an-escape-hatch-not-authority",
] as const;

export const afendaClassNamePolicyContract = {
  id: AFENDA_CLASS_NAME_POLICY_CONTRACT_ID,
  version: AFENDA_CLASS_NAME_POLICY_CONTRACT_VERSION,
  policies: AFENDA_CLASS_NAME_POLICIES,
  authorityRules: AFENDA_CLASS_NAME_AUTHORITY_RULES,
  forbiddenOwnership: AFENDA_CLASS_NAME_FORBIDDEN_OWNERSHIP,
  allowedPrefixes: AFENDA_ALLOWED_CLASS_NAME_PREFIXES,
  forbiddenPrefixes: AFENDA_FORBIDDEN_CLASS_NAME_PREFIXES,
  escapeHatchRules: AFENDA_CLASS_NAME_ESCAPE_HATCH_RULES,
  componentRules: AFENDA_CLASS_NAME_COMPONENT_RULES,
  recipeRules: AFENDA_CLASS_NAME_RECIPE_RULES,
  forbiddenPatterns: AFENDA_CLASS_NAME_FORBIDDEN_PATTERNS,
  sourceOfTruth: AFENDA_CLASS_NAME_SOURCE_OF_TRUTH,
  principles: AFENDA_CLASS_NAME_PRINCIPLES,
} as const;

export type AfendaClassNamePolicyContract =
  typeof afendaClassNamePolicyContract;
