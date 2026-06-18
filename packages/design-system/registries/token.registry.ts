import tokens from "../tokens/tokens.json" with { type: "json" };

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

export const AFENDA_TOKEN_SOURCE_OF_TRUTH = [
  "tokens.json",
  "globals.css",
  "afenda-token.contract.ts",
] as const;

export const designTokens = tokens;

export type DesignTokens = typeof designTokens;

function tokenKeys<T extends object | undefined>(value: T): readonly string[] {
  return value ? Object.keys(value) : [];
}

export const AFENDA_TOKEN_PATHS = {
  color: tokenKeys(designTokens.color),
  component: tokenKeys(designTokens.component),
  layout: tokenKeys(designTokens.layout),
  motion: tokenKeys(designTokens.motion),
  primitive: tokenKeys(designTokens.primitive),
  radius: tokenKeys(designTokens.radius),
  semantic: tokenKeys(designTokens.semantic),
  shadow: tokenKeys(designTokens.shadow),
  spacing: tokenKeys(designTokens.spacing),
  typography: tokenKeys(designTokens.typography),
  "z-index": tokenKeys(designTokens.zIndex),
  zIndex: tokenKeys(designTokens.zIndex),
} as const;

export const afendaTokenRegistry = {
  layers: AFENDA_TOKEN_LAYERS,
  domains: AFENDA_TOKEN_DOMAINS,
  sourceOfTruth: AFENDA_TOKEN_SOURCE_OF_TRUTH,
  tokenPaths: AFENDA_TOKEN_PATHS,
  tokens: designTokens,
} as const;

export type AfendaTokenRegistry = typeof afendaTokenRegistry;
