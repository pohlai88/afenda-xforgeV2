export const CHART_AREA_INTERACTIVE_DESCRIPTION = "An interactive area chart";

export const CHART_AREA_DEFAULT_TITLE = "Total Visitors";
export const CHART_AREA_DEFAULT_DESCRIPTION = "Total for the last 3 months";
export const CHART_AREA_DEFAULT_DESCRIPTION_MOBILE = "Last 3 months";
export const CHART_AREA_DEFAULT_REFERENCE_DATE = "2024-06-30";

export const CHART_AREA_SELECT_LABEL = "Select a time range";

export const CHART_AREA_TIME_RANGE_OPTIONS = [
  { value: "90d", label: "Last 3 months" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
] as const;

export type ChartAreaTimeRange =
  (typeof CHART_AREA_TIME_RANGE_OPTIONS)[number]["value"];
