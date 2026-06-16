/**
 * Afenda Token Contract
 *
 * Token owns value.
 *
 * Purpose:
 * - Define token vocabulary.
 * - Govern token layers and domains.
 * - Prevent raw value drift.
 * - Keep semantic styling values out of components and recipes.
 *
 * This file must not contain component logic.
 */

export const AFENDA_TOKEN_CONTRACT_ID = "afenda.token" as const;

export const AFENDA_TOKEN_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_TOKEN_LAYERS = [
  "primitive",
  "semantic",
  "component",
] as const;

export type AfendaTokenLayer = (typeof AFENDA_TOKEN_LAYERS)[number];

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

export type AfendaTokenDomain = (typeof AFENDA_TOKEN_DOMAINS)[number];

export const AFENDA_TOKEN_AUTHORITY_RULES = {
  tokenOwnsValue: true,
  tokenOwnsCssVariables: true,
  tokenOwnsRawValues: true,
  tokenOwnsAliases: true,
} as const;

export const AFENDA_TOKEN_VALUE_RULES = {
  tokensOwnRawValues: true,
  componentsMustNotOwnRawValues: true,
  recipesMustReferenceTokens: true,
  variantsMustNotEncodeValues: true,
  classNameMustNotEncodeSemanticValues: true,
  examplesMustNotInventValues: true,
} as const;

export const AFENDA_TOKEN_NAMING_RULES = {
  tokenNamesMustUseKebabCase: true,
  semanticTokensMustUseDomainPrefix: true,
  componentTokensMustUseComponentPrefix: true,
  primitiveTokensMustNotReferenceComponentMeaning: true,
} as const;

export const AFENDA_TOKEN_USAGE_RULES = {
  rawColorValuesAreForbiddenOutsideTokens: true,
  rawSpacingValuesAreForbiddenOutsideTokens: true,
  rawRadiusValuesAreForbiddenOutsideTokens: true,
  rawShadowValuesAreForbiddenOutsideTokens: true,
  rawMotionValuesAreForbiddenOutsideTokens: true,
  cssVariablesMustBeDeclaredByTokens: true,
  arbitraryTailwindValuesRequireTokenReference: true,
  tokenAliasesMustResolveToCanonicalToken: true,
} as const;

export const AFENDA_TOKEN_FORBIDDEN_OWNERSHIP = {
  componentsMustNotDeclareTokens: true,
  recipesMustNotDeclareTokens: true,
  variantsMustNotDeclareTokens: true,
  examplesMustNotDeclareTokens: true,
} as const;

export const AFENDA_FORBIDDEN_RAW_TOKEN_PATTERNS = [
  "#",
  "rgb(",
  "rgba(",
  "hsl(",
  "hsla(",
  "oklch(",
  "px",
  "rem",
  "em",
  "ms",
  "cubic-bezier(",
  "var(--unknown",
] as const;

export const AFENDA_TOKEN_SOURCE_OF_TRUTH = [
  "tokens.json",
  "globals.css",
  "afenda-token.contract.ts",
] as const;

export const AFENDA_TOKEN_PRINCIPLES = [
  "token-owns-value",
  "raw-values-live-only-in-token-layer",
  "semantic-tokens-own-meaningful-values",
  "component-tokens-own-component-specific-values",
  "recipes-consume-tokens",
  "variants-select-meaning-not-values",
  "components-never-invent-values",
] as const;

export const afendaTokenContract = {
  id: AFENDA_TOKEN_CONTRACT_ID,
  version: AFENDA_TOKEN_CONTRACT_VERSION,
  layers: AFENDA_TOKEN_LAYERS,
  domains: AFENDA_TOKEN_DOMAINS,
  authorityRules: AFENDA_TOKEN_AUTHORITY_RULES,
  valueRules: AFENDA_TOKEN_VALUE_RULES,
  namingRules: AFENDA_TOKEN_NAMING_RULES,
  usageRules: AFENDA_TOKEN_USAGE_RULES,
  forbiddenOwnership: AFENDA_TOKEN_FORBIDDEN_OWNERSHIP,
  forbiddenRawTokenPatterns: AFENDA_FORBIDDEN_RAW_TOKEN_PATTERNS,
  sourceOfTruth: AFENDA_TOKEN_SOURCE_OF_TRUTH,
  principles: AFENDA_TOKEN_PRINCIPLES,
} as const;

export type AfendaTokenContract = typeof afendaTokenContract;
