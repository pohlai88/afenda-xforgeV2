"use client";

import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/design-system/components/afenda-ui/chart";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/design-system/components/afenda-ui/drawer";
import { Input } from "@repo/design-system/components/afenda-ui/input";
import { Label } from "@repo/design-system/components/afenda-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/afenda-ui/select";
import { Separator } from "@repo/design-system/components/afenda-ui/separator";
import { useIsMobile } from "@repo/design-system/hooks/use-mobile";
import { TrendingUpIcon } from "lucide-react";
import { memo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  DASHBOARD_DATA_TABLE_REVIEWERS,
  DASHBOARD_DATA_TABLE_SECTION_TYPES,
  DASHBOARD_DATA_TABLE_STATUSES,
} from "./dashboard-data-table-constants";
import {
  dashboardDataTableDrawerCopyClass,
  dashboardDataTableDrawerTrendClass,
} from "./dashboard-data-table-recipes";
import type { DashboardDataTableRow } from "./dashboard-data-table-schema";
import {
  DEMO_DATA_TABLE_CELL_VIEWER_CHART_CONFIG,
  DEMO_DATA_TABLE_CELL_VIEWER_CHART_DATA,
} from "./data-table-cell-viewer-demo-data";

export interface DataTableCellViewerProps {
  readonly item: DashboardDataTableRow;
}

export const DataTableCellViewer = memo(function DataTableCellViewer({
  item,
}: DataTableCellViewerProps) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          className="h-auto w-fit px-0 text-left text-text-primary"
          type="button"
          variant="link"
        >
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-[12px]">
          {isMobile ? null : (
            <>
              <ChartContainer
                config={DEMO_DATA_TABLE_CELL_VIEWER_CHART_CONFIG}
                useResponsiveContainer={false}
              >
                <AreaChart
                  accessibilityLayer
                  data={[...DEMO_DATA_TABLE_CELL_VIEWER_CHART_DATA]}
                  responsive
                  style={{ height: "100%", width: "100%" }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="month"
                    hide
                    tickFormatter={(value) => String(value).slice(0, 3)}
                    tickLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={false}
                  />
                  <Area
                    dataKey="mobile"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stackId="a"
                    stroke="var(--color-mobile)"
                    type="natural"
                  />
                  <Area
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stackId="a"
                    stroke="var(--color-desktop)"
                    type="natural"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className={dashboardDataTableDrawerTrendClass}>
                  Trending up by 5.2% this month
                  <TrendingUpIcon aria-hidden="true" className="size-4" />
                </div>
                <div className={dashboardDataTableDrawerCopyClass}>
                  Showing total visitors for the last 6 months. This is sample
                  copy to validate drawer layout and wrapping behavior.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input defaultValue={item.header} id="header" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger className="w-full" id="type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DASHBOARD_DATA_TABLE_SECTION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger className="w-full" id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {DASHBOARD_DATA_TABLE_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input defaultValue={item.target} id="target" />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input defaultValue={item.limit} id="limit" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger className="w-full" id="reviewer">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {DASHBOARD_DATA_TABLE_REVIEWERS.map((reviewer) => (
                    <SelectItem key={reviewer} value={reviewer}>
                      {reviewer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button type="button">Submit</Button>
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Done
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
