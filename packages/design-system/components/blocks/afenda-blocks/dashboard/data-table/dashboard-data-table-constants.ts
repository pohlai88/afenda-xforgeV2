export const DASHBOARD_DATA_TABLE_DESCRIPTION =
  "A drag-and-drop data table with tabs, column visibility, and row detail drawer.";

/** @internal Column placeholder — not part of the public dashboard contract. */
export const DASHBOARD_DATA_TABLE_REVIEWER_PLACEHOLDER = "Assign reviewer";

export const DASHBOARD_DATA_TABLE_REVIEWERS = [
  "Alex Thompson",
  "Carlos Rodriguez",
  "Daniel Park",
  "David Kim",
  "Eddie Lake",
  "Emma Davis",
  "James Wilson",
  "Jamik Tashpulatov",
  "Leila Ahmadi",
  "Lisa Wong",
  "Maria Garcia",
  "Maya Johnson",
  "Michael Chen",
  "Nina Patel",
  "Priya Singh",
  "Raj Patel",
  "Sarah Chen",
  "Sarah Johnson",
  "Sophia Martinez",
  "Thomas Wilson",
] as const;

export const DASHBOARD_DATA_TABLE_SECTION_TYPES = [
  "Cover page",
  "Financial",
  "Legal",
  "Narrative",
  "Plain language",
  "Planning",
  "Research",
  "Table of contents",
  "Technical content",
  "Visual",
] as const;

export const DASHBOARD_DATA_TABLE_STATUSES = [
  "Done",
  "In Process",
  "Not Started",
] as const;

export const DASHBOARD_DATA_TABLE_TAB_VIEWS = [
  { value: "outline", label: "Outline" },
  { value: "past-performance", label: "Past Performance", badge: "3" },
  { value: "key-personnel", label: "Key Personnel", badge: "2" },
  { value: "focus-documents", label: "Focus Documents" },
] as const;

export type DashboardDataTableTabView =
  (typeof DASHBOARD_DATA_TABLE_TAB_VIEWS)[number]["value"];

export type DashboardDataTableReviewer =
  (typeof DASHBOARD_DATA_TABLE_REVIEWERS)[number];

export const DASHBOARD_DATA_TABLE_PAGE_SIZES = [10, 20, 30, 40, 50] as const;
