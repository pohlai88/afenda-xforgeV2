export const AFENDA_COLOR_USAGE_POLICY = {
  doctrine:
    "Quiet Interfaces, Loud Decisions. Neutrals do the work. Brand creates memory. Status creates decisions. Warmth creates humanity.",
  warmth: {
    allowed: [
      "onboarding",
      "empty-state",
      "welcome-surface",
      "marketing",
      "illustration",
    ],
    forbidden: [
      "data-table",
      "admin-form",
      "audit-log",
      "approval-queue",
      "dashboard-status",
      "dense-dashboard",
      "admin-crud",
    ],
    rule: "Warmth tokens are brand-expression tokens, not operational UI tokens.",
  },
  brand: {
    allowed: [
      "main-cta",
      "active-nav",
      "command-center",
      "nexus",
      "logo-identity",
      "setup-completion",
    ],
    rule: "Brand colors identify Afenda and true primary intent.",
  },
  status: {
    rule: "Status colors communicate operational state only.",
  },
} as const;
