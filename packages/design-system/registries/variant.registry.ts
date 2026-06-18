export const AFENDA_TONES = [
  "neutral",
  "info",
  "success",
  "warning",
  "critical",
] as const;

export type AfendaTone = (typeof AFENDA_TONES)[number];

export const AFENDA_DENSITIES = ["compact", "default", "comfortable"] as const;

export type AfendaDensity = (typeof AFENDA_DENSITIES)[number];

export const AFENDA_EMPHASIS = ["low", "medium", "high"] as const;

export type AfendaEmphasis = (typeof AFENDA_EMPHASIS)[number];

export const AFENDA_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export type AfendaSize = (typeof AFENDA_SIZES)[number];

export const AFENDA_COMPONENT_SIZE_VARIANTS = [
  "compact",
  "default",
  "icon",
  "icon-sm",
  "icon-lg",
] as const;

export type AfendaComponentSizeVariant =
  (typeof AFENDA_COMPONENT_SIZE_VARIANTS)[number];

export const AFENDA_TEXT_COLOR_VARIANTS = [
  "primary",
  "secondary",
  "tertiary",
  "info",
  "success",
  "warning",
  "critical",
] as const;

export type AfendaTextColorVariant =
  (typeof AFENDA_TEXT_COLOR_VARIANTS)[number];

export const AFENDA_ACTION_VARIANTS = [
  "primary",
  "secondary",
  "quiet",
  "critical",
  "link",
] as const;

export type AfendaActionVariant = (typeof AFENDA_ACTION_VARIANTS)[number];

export const AFENDA_STRUCTURAL_VARIANTS = [
  "body",
  "caption",
  "default",
  "icon",
  "icon-sm",
  "label",
  "legend",
  "medium",
  "metadata",
  "panel",
  "plain",
  "sidebar",
  "floating",
  "inset",
  "outline",
  "soft",
  "solid",
  "title",
] as const;

export type AfendaStructuralVariant =
  (typeof AFENDA_STRUCTURAL_VARIANTS)[number];

export const AFENDA_VARIANT_IDENTITY_REGISTRY = {
  actionVariants: AFENDA_ACTION_VARIANTS,
  componentSizeVariants: AFENDA_COMPONENT_SIZE_VARIANTS,
  densities: AFENDA_DENSITIES,
  emphasis: AFENDA_EMPHASIS,
  sizes: AFENDA_SIZES,
  structuralVariants: AFENDA_STRUCTURAL_VARIANTS,
  textColorVariants: AFENDA_TEXT_COLOR_VARIANTS,
  tones: AFENDA_TONES,
} as const;

export const AFENDA_FORBIDDEN_VARIANT_ALIASES = {
  critical: ["danger", "destructive", "error", "negative"],
  info: ["notice", "informational"],
  neutral: ["base", "plain"],
  success: ["approved", "good", "positive"],
  warning: ["caution", "pending"],
} as const;

export const AFENDA_VARIANT_PROPS = [
  "variant",
  "tone",
  "intent",
  "color",
  "density",
  "emphasis",
  "size",
] as const;

export type AfendaVariantProp = (typeof AFENDA_VARIANT_PROPS)[number];

export const AFENDA_VARIANT_ALLOWED_BY_PROP = {
  color: AFENDA_TEXT_COLOR_VARIANTS,
  density: AFENDA_DENSITIES,
  emphasis: AFENDA_EMPHASIS,
  intent: AFENDA_ACTION_VARIANTS,
  size: [...AFENDA_SIZES, ...AFENDA_COMPONENT_SIZE_VARIANTS],
  tone: AFENDA_TONES,
  variant: [...AFENDA_ACTION_VARIANTS, ...AFENDA_STRUCTURAL_VARIANTS],
} as const satisfies Record<AfendaVariantProp, readonly string[]>;

export const afendaVariantRegistry = {
  variantIdentityRegistry: AFENDA_VARIANT_IDENTITY_REGISTRY,
  forbiddenVariantAliases: AFENDA_FORBIDDEN_VARIANT_ALIASES,
  variantProps: AFENDA_VARIANT_PROPS,
  allowedByProp: AFENDA_VARIANT_ALLOWED_BY_PROP,
} as const;

export type AfendaVariantRegistry = typeof afendaVariantRegistry;
