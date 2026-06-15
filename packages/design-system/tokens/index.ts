import tokens from "./tokens.json";

export const designTokens = tokens;

export type DesignTokens = typeof designTokens;
export type ColorToken = keyof DesignTokens["color"];
export type RadiusToken = keyof DesignTokens["radius"];
export type SpacingToken = keyof DesignTokens["spacing"];
export type LayoutToken = keyof DesignTokens["layout"];
export type TypographyToken = keyof DesignTokens["typography"];
