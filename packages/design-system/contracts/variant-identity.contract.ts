import {
  AFENDA_DENSITIES,
  AFENDA_STATES,
  AFENDA_TONES,
} from "./afenda-design-system.contract";

export const AFENDA_ACTION_VARIANTS = [
  "primary",
  "secondary",
  "quiet",
  "critical",
  "link",
] as const;

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

export const AFENDA_VARIANT_IDENTITY_REGISTRY = {
  actionVariants: AFENDA_ACTION_VARIANTS,
  densities: AFENDA_DENSITIES,
  states: AFENDA_STATES,
  structuralVariants: AFENDA_STRUCTURAL_VARIANTS,
  tones: AFENDA_TONES,
} as const;

export type AfendaActionVariant = (typeof AFENDA_ACTION_VARIANTS)[number];
export type AfendaStructuralVariant =
  (typeof AFENDA_STRUCTURAL_VARIANTS)[number];
