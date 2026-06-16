/** @internal Storybook / dashboard-01 demo only — KPI section card fixtures. */

import type { DashboardSectionCardItem } from "../dashboard-contracts";

export const DEMO_DASHBOARD_SECTION_CARDS: readonly DashboardSectionCardItem[] =
  [
    {
      id: "revenue",
      label: "Total Revenue",
      value: "$1,250.00",
      change: "+12.5%",
      trend: "up",
      footerTitle: "Trending up this month",
      footerDescription: "Visitors for the last 6 months",
    },
    {
      id: "customers",
      label: "New Customers",
      value: "1,234",
      change: "-20%",
      trend: "down",
      footerTitle: "Down 20% this period",
      footerDescription: "Acquisition needs attention",
    },
    {
      id: "accounts",
      label: "Active Accounts",
      value: "45,678",
      change: "+12.5%",
      trend: "up",
      footerTitle: "Strong user retention",
      footerDescription: "Engagement exceed targets",
    },
    {
      id: "growth",
      label: "Growth Rate",
      value: "4.5%",
      change: "+4.5%",
      trend: "up",
      footerTitle: "Steady performance increase",
      footerDescription: "Meets growth projections",
    },
  ];
