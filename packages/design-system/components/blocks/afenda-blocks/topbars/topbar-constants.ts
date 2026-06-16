export const TOPBAR_FIXED_UTILITY_SLOTS = 3;
export const TOPBAR_MAX_TOTAL_UTILITY_SLOTS = 9;
export const TOPBAR_MAX_PINNED_UTILITY_SLOTS =
  TOPBAR_MAX_TOTAL_UTILITY_SLOTS - TOPBAR_FIXED_UTILITY_SLOTS;

/** Right-anchored rail slots (left → right): market, account, menu. Not draggable. */
export const TOPBAR_FIXED_UTILITY_SLOT_ORDER = [
  "utilities-market",
  "user-menu",
  "actions-menu",
] as const;
