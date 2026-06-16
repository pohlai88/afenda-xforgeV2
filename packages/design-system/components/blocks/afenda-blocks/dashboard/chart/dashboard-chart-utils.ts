import type { ChartAreaTimeRange } from "./dashboard-chart-constants";
import type { ChartAreaDataPoint } from "./chart-area-types";

const CHART_AREA_TIME_RANGE_DAYS: Record<ChartAreaTimeRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export function filterChartAreaDataByTimeRange(
  data: readonly ChartAreaDataPoint[],
  timeRange: ChartAreaTimeRange,
  referenceDate: string
): ChartAreaDataPoint[] {
  const daysToSubtract = CHART_AREA_TIME_RANGE_DAYS[timeRange];
  const endDate = new Date(referenceDate);
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  return data.filter((item) => {
    const date = new Date(item.date);
    return date >= startDate && date <= endDate;
  });
}

export function formatChartAreaAxisDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export function formatChartAreaTooltipLabel(value: unknown): string {
  if (typeof value === "string") {
    return formatChartAreaAxisDate(value);
  }

  return String(value ?? "");
}
