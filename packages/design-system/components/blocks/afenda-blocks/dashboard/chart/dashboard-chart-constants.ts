import {
  CHART_AREA_TIME_RANGE_DISPLAY_ORDER,
  type ChartAreaTimeRange,
} from "../dashboard-contracts";

export const CHART_AREA_INTERACTIVE_DESCRIPTION = "An interactive area chart";

export const CHART_AREA_DEFAULT_TITLE = "Total Visitors";
export const CHART_AREA_DEFAULT_DESCRIPTION = "Total for the last 3 months";
export const CHART_AREA_DEFAULT_DESCRIPTION_MOBILE = "Last 3 months";
export const CHART_AREA_DEFAULT_REFERENCE_DATE = "2024-06-30";

export const CHART_AREA_SELECT_LABEL = "Select a time range";

const CHART_AREA_TIME_RANGE_LABELS: Record<ChartAreaTimeRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 3 months",
};

export interface ChartAreaTimeRangeOption {
  readonly label: string;
  readonly value: ChartAreaTimeRange;
}

export const CHART_AREA_TIME_RANGE_OPTIONS =
  CHART_AREA_TIME_RANGE_DISPLAY_ORDER.map((value) => ({
    value,
    label: CHART_AREA_TIME_RANGE_LABELS[value],
  })) as readonly ChartAreaTimeRangeOption[];
