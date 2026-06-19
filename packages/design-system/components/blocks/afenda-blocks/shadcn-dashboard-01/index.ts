import type { z } from "zod";

import demoData from "./dashboard/data.json";
import type { schema } from "./data-table";

export { AppSidebar } from "./app-sidebar";
export { ChartAreaInteractive } from "./chart-area-interactive";
export {
  DashboardDemoPage,
  type DashboardDemoPageProps,
  DashboardPage,
  type DashboardPageProps,
} from "./dashboard/dashboard-01.page";
export {
  DashboardContent,
  type DashboardContentProps,
} from "./dashboard/dashboard-content";
export {
  DataTable,
  DataTable as DashboardDataTable,
  schema as dashboardDataTableSchema,
} from "./data-table";
export { NavDocuments } from "./nav-documents";
export {
  DEFAULT_NAV_MAIN_ITEMS,
  NavMain,
  type NavMainItem,
  type NavMainProps,
} from "./nav-main";
export { sidebarLinkClass } from "./nav-main-recipes";
export { NavSecondary } from "./nav-secondary";
export {
  DEFAULT_NAV_TOPBAR_PROPS as DEMO_DASHBOARD_NAV_TOPBAR_PROPS,
  NAV_TOPBAR_HEIGHT as DEFAULT_DASHBOARD_NAV_TOPBAR_HEIGHT,
  NavTopbar as DashboardNavTopbar,
  type NavTopbarProps as DashboardNavTopbarProps,
} from "./nav-topbar";
export { NavUser } from "./nav-user";
export { SectionCards } from "./section-cards";
export {
  defaultSidebarLink,
  resolveSidebarLinkRenderer,
  type SidebarLinkRenderer,
  type SidebarLinkRenderProps,
} from "./sidebar-link";
export { SiteHeader, type SiteHeaderProps } from "./site-header";

export type DashboardDataTableRow = z.infer<typeof schema>;

export interface DashboardDataTableProps {
  readonly data: readonly DashboardDataTableRow[];
}

export const DEMO_DASHBOARD_DATA_TABLE_ROWS =
  demoData as readonly DashboardDataTableRow[];
