"use client";

import {
  DashboardPage,
  type DashboardDataTableRow,
} from "@repo/design-system";

interface DashboardDemoViewProperties {
  readonly tableData: readonly DashboardDataTableRow[];
}

export function DashboardDemoView({ tableData }: DashboardDemoViewProperties) {
  return <DashboardPage tableData={tableData} />;
}
