import { DEMO_DASHBOARD_DATA_TABLE_ROWS } from "@repo/design-system";
import type { Metadata } from "next";
import { DashboardDemoView } from "./_components/dashboard-demo-view";

const title = "Dashboard";
const description =
  "shadcn dashboard-01 block composed with Afenda design-system primitives.";

export const metadata: Metadata = {
  title,
  description,
};

const DashboardRoutePage = () => {
  return (
    <DashboardDemoView tableData={DEMO_DASHBOARD_DATA_TABLE_ROWS} />
  );
};

export default DashboardRoutePage;
