/** @internal Storybook / dashboard-01 demo only — drawer preview chart fixtures. */

import type { ChartConfig } from "@repo/design-system/components/afenda-ui/chart";

export const DEMO_DATA_TABLE_CELL_VIEWER_CHART_DATA = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
] as const;

export const DEMO_DATA_TABLE_CELL_VIEWER_CHART_CONFIG = {
  desktop: {
    label: "Desktop",
    color: "var(--brand-primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--brand-primary)",
  },
} satisfies ChartConfig;
