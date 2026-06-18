import type { TopbarContextScope } from "./topbar-types";

const APP_TOPBAR_BRAND_ICON = {
  dark: "/icons/afenda-icon-512-transparent.png",
  light: "/icons/afenda-icon-512-transparent.png",
} as const;

const APP_TOPBAR_SWITCHER_MAX_CHARS = 20;

/** Fixed right-cluster slots numbered from the right edge (1 = outermost). */
const TOPBAR_RIGHT_FIXED_SLOTS = [
  "app-topbar-actions-trigger",
  "app-topbar-theme-toggle",
  "app-topbar-utilities-market-trigger",
] as const;

const TOPBAR_RIGHT_RAIL_SLOT = "app-topbar-utilities-rail";

const TOPBAR_RIGHT_DRAGGABLE_MAX = 6;

const TOPBAR_CONTEXT_LABELS: Record<TopbarContextScope, string> = {
  department: "Departments",
  organization: "Organizations",
  project: "Projects",
  team: "Teams",
};

const TOPBAR_CONTEXT_SCOPE_INDICATORS: Record<TopbarContextScope, string> = {
  department: "DEPARTMENT",
  organization: "ORGANIZATION",
  project: "PROJECT",
  team: "TEAM",
};

const TOPBAR_SWITCHER_TRIGGER_SLOTS: Record<TopbarContextScope, string> = {
  department: "app-topbar-department-switcher-trigger",
  organization: "app-topbar-organization-switcher-trigger",
  project: "app-topbar-project-switcher-trigger",
  team: "app-topbar-team-switcher-trigger",
};

const TOPBAR_SWITCHER_CONTENT_SLOTS: Record<TopbarContextScope, string> = {
  department: "app-topbar-department-switcher-content",
  organization: "app-topbar-organization-switcher-content",
  project: "app-topbar-project-switcher-content",
  team: "app-topbar-team-switcher-content",
};

export {
  APP_TOPBAR_BRAND_ICON,
  APP_TOPBAR_SWITCHER_MAX_CHARS,
  TOPBAR_CONTEXT_LABELS,
  TOPBAR_CONTEXT_SCOPE_INDICATORS,
  TOPBAR_RIGHT_DRAGGABLE_MAX,
  TOPBAR_RIGHT_FIXED_SLOTS,
  TOPBAR_RIGHT_RAIL_SLOT,
  TOPBAR_SWITCHER_CONTENT_SLOTS,
  TOPBAR_SWITCHER_TRIGGER_SLOTS,
};
