/**
 * JSON-safe dashboard data contracts — serializable, boundary-safe, no React/DOM types.
 */

export const CHART_AREA_TIME_RANGES = ["7d", "30d", "90d"] as const;

export type ChartAreaTimeRange = (typeof CHART_AREA_TIME_RANGES)[number];

/** UI select/toggle order — must cover every {@link CHART_AREA_TIME_RANGES} entry. */
export const CHART_AREA_TIME_RANGE_DISPLAY_ORDER = [
  "90d",
  "30d",
  "7d",
] as const satisfies readonly ChartAreaTimeRange[];

export interface ChartAreaDataPoint {
  readonly date: string;
  readonly desktop: number;
  readonly mobile: number;
}

export type DashboardSectionCardTrend = "down" | "up";

export interface DashboardSectionCardItem {
  readonly change: string;
  readonly description?: string;
  readonly footerDescription: string;
  readonly footerTitle: string;
  readonly id: string;
  readonly label: string;
  readonly trend: DashboardSectionCardTrend;
  readonly value: string;
}

export type {
  DashboardDataTableReviewer,
  DashboardDataTableTabView,
} from "./data-table/dashboard-data-table-constants";

export type {
  DashboardDataTableRow,
  DashboardDataTableSectionType,
  DashboardDataTableStatus,
} from "./data-table/dashboard-data-table-schema";
