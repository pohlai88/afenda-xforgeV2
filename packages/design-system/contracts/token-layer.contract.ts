export const AFENDA_TOKEN_LAYER_CONTRACT = {
  layers: ["primitive", "semantic", "component"],
  categories: [
    "color",
    "spacing",
    "typography",
    "radius",
    "shadow",
    "motion",
    "zIndex",
  ],
  rule: "Primitive tokens hold raw values, semantic tokens hold purpose, and component tokens are created only when shared components need them.",
} as const;
