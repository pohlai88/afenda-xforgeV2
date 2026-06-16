"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/afenda-ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/design-system/components/afenda-ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/afenda-ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@repo/design-system/components/afenda-ui/toggle-group";
import { useIsMobile } from "@repo/design-system/hooks/use-mobile";
import { cn } from "@repo/design-system/lib/utils";
import { memo, useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type {
  ChartAreaDataPoint,
  ChartAreaInteractiveProps,
  ChartAreaTimeRange,
} from "./chart-area-types";
import {
  CHART_AREA_DEFAULT_DESCRIPTION,
  CHART_AREA_DEFAULT_DESCRIPTION_MOBILE,
  CHART_AREA_DEFAULT_REFERENCE_DATE,
  CHART_AREA_DEFAULT_TITLE,
  CHART_AREA_SELECT_LABEL,
  CHART_AREA_TIME_RANGE_OPTIONS,
} from "./dashboard-chart-constants";
import { DEMO_DASHBOARD_CHART_AREA_DATA } from "./dashboard-chart-data";
import {
  chartAreaInteractiveCardClass,
  chartAreaInteractiveContainerClass,
  chartAreaInteractiveContentClass,
  chartAreaInteractiveDescriptionNarrowClass,
  chartAreaInteractiveDescriptionWideClass,
  chartAreaInteractiveSelectTriggerClass,
  chartAreaInteractiveToggleGroupClass,
} from "./dashboard-chart-recipes";
import {
  filterChartAreaDataByTimeRange,
  formatChartAreaAxisDate,
  formatChartAreaTooltipLabel,
} from "./dashboard-chart-utils";

const DEFAULT_CHART_AREA_CONFIG = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--brand-primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--brand-primary)",
  },
} satisfies ChartConfig;

const ChartAreaTimeRangeControls = memo(function ChartAreaTimeRangeControls({
  onTimeRangeChange,
  timeRange,
}: {
  readonly onTimeRangeChange: (value: ChartAreaTimeRange) => void;
  readonly timeRange: ChartAreaTimeRange;
}) {
  return (
    <>
      <ToggleGroup
        className={chartAreaInteractiveToggleGroupClass}
        onValueChange={(value) => {
          if (value) {
            onTimeRangeChange(value as ChartAreaTimeRange);
          }
        }}
        type="single"
        value={timeRange}
        variant="outline"
      >
        {CHART_AREA_TIME_RANGE_OPTIONS.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Select
        onValueChange={(value) => {
          onTimeRangeChange(value as ChartAreaTimeRange);
        }}
        value={timeRange}
      >
        <SelectTrigger
          aria-label={CHART_AREA_SELECT_LABEL}
          className={chartAreaInteractiveSelectTriggerClass}
          size="compact"
        >
          <SelectValue placeholder={CHART_AREA_TIME_RANGE_OPTIONS[0].label} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {CHART_AREA_TIME_RANGE_OPTIONS.map((option) => (
            <SelectItem
              className="rounded-lg"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
});

const ChartAreaInteractivePlot = memo(function ChartAreaInteractivePlot({
  config,
  data,
  desktopFillId,
  mobileFillId,
}: {
  readonly config: ChartConfig;
  readonly data: readonly ChartAreaDataPoint[];
  readonly desktopFillId: string;
  readonly mobileFillId: string;
}) {
  return (
    <ChartContainer
      className={chartAreaInteractiveContainerClass}
      config={config}
      useResponsiveContainer={false}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        responsive
        style={{ height: "100%", width: "100%" }}
      >
        <defs>
          <linearGradient id={desktopFillId} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={1}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id={mobileFillId} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="date"
          minTickGap={32}
          tickFormatter={formatChartAreaAxisDate}
          tickLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={formatChartAreaTooltipLabel}
            />
          }
          cursor={false}
        />
        <Area
          dataKey="mobile"
          fill={`url(#${mobileFillId})`}
          stackId="a"
          stroke="var(--color-mobile)"
          type="natural"
        />
        <Area
          dataKey="desktop"
          fill={`url(#${desktopFillId})`}
          stackId="a"
          stroke="var(--color-desktop)"
          type="natural"
        />
      </AreaChart>
    </ChartContainer>
  );
});

export const ChartAreaInteractive = memo(function ChartAreaInteractive({
  className,
  config = DEFAULT_CHART_AREA_CONFIG,
  data = DEMO_DASHBOARD_CHART_AREA_DATA,
  description = CHART_AREA_DEFAULT_DESCRIPTION,
  mobileDescription = CHART_AREA_DEFAULT_DESCRIPTION_MOBILE,
  referenceDate = CHART_AREA_DEFAULT_REFERENCE_DATE,
  title = CHART_AREA_DEFAULT_TITLE,
}: ChartAreaInteractiveProps) {
  const chartInstanceId = useId();
  const desktopFillId = `${chartInstanceId}-fill-desktop`;
  const mobileFillId = `${chartInstanceId}-fill-mobile`;
  const isMobile = useIsMobile();
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<ChartAreaTimeRange | null>(null);
  const timeRange = selectedTimeRange ?? (isMobile ? "7d" : "90d");

  const filteredData = useMemo(
    () => filterChartAreaDataByTimeRange(data, timeRange, referenceDate),
    [data, referenceDate, timeRange]
  );

  return (
    <Card
      className={cn(chartAreaInteractiveCardClass, className)}
      data-slot="chart-area-interactive"
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className={chartAreaInteractiveDescriptionWideClass}>
            {description}
          </span>
          <span className={chartAreaInteractiveDescriptionNarrowClass}>
            {mobileDescription}
          </span>
        </CardDescription>
        <CardAction>
          <ChartAreaTimeRangeControls
            onTimeRangeChange={setSelectedTimeRange}
            timeRange={timeRange}
          />
        </CardAction>
      </CardHeader>
      <CardContent className={chartAreaInteractiveContentClass}>
        <ChartAreaInteractivePlot
          config={config}
          data={filteredData}
          desktopFillId={desktopFillId}
          mobileFillId={mobileFillId}
        />
      </CardContent>
    </Card>
  );
});
