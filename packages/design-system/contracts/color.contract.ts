export const AFENDA_COLOR_DOCTRINE = {
  name: "Afenda Mindful Operator",
  governingRule: "Quiet Interfaces, Loud Decisions",
  principle:
    "Neutrals do the work. Brand creates memory. Status creates decisions. Warmth creates humanity.",
  constraints: [
    "Color communicates meaning, not decoration.",
    "Warmth tokens are brand-expression tokens, not operational UI tokens.",
    "Brand green and success green must never be aliased.",
    "Repeated operator actions may remain neutral.",
  ],
  paletteRoles: {
    brand: ["brandPrimary", "brandDark", "brandSoft"],
    foundation: ["canvas", "raised", "surface", "ink", "muted", "line"],
    status: ["info", "warning", "danger", "success"],
    warmth: ["bark", "doe", "pink"],
  },
} as const;
