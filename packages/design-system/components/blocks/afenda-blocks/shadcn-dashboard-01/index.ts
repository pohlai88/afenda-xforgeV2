import type { z } from "zod";

import demoData from "./dashboard/data.json";
import { DataTable, schema } from "./data-table";

export { AppSidebar } from "./app-sidebar";
export { ChartAreaInteractive } from "./chart-area-interactive";
export { DashboardPage } from "./dashboard/dashboard-01.page";
export { DataTable, schema as dashboardDataTableSchema } from "./data-table";
export {
  DEFAULT_NAV_MAIN_ITEMS,
  NavMain,
  type NavMainItem,
  type NavMainProps,
} from "./nav-main";
export { NavDocuments } from "./nav-documents";
export {
  DEFAULT_NAV_TOPBAR_PROPS as DEMO_DASHBOARD_NAV_TOPBAR_PROPS,
  NAV_TOPBAR_HEIGHT as DEFAULT_DASHBOARD_NAV_TOPBAR_HEIGHT,
  NavTopbar as DashboardNavTopbar,
  type NavTopbarProps as DashboardNavTopbarProps,
} from "./nav-topbar";
export { NavSecondary } from "./nav-secondary";
export { NavUser } from "./nav-user";
export {
  defaultSidebarLink,
  resolveSidebarLinkRenderer,
  type SidebarLinkRenderer,
  type SidebarLinkRenderProps,
} from "./sidebar-link";
export { SectionCards } from "./section-cards";
export { SiteHeader } from "./site-header";
export {
  buildCatalogMaps,
  buildPinnedActions,
  buildPinnedOrder,
  DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
  resolveDefaultEnabledIds,
  resolveTopbarSidebarControl,
  TOPBAR_DEFAULT_BRAND_TOOLTIP,
  TOPBAR_DEFAULT_COMMAND_SHORTCUT,
  TOPBAR_FIXED_UTILITY_SLOTS,
  TOPBAR_MAX_PINNED_UTILITY_SLOTS,
  TOPBAR_MAX_TOTAL_UTILITY_SLOTS,
  TopbarShortcutsDialog,
} from "./topbar";
export type {
  TopbarActionMenuItem,
  TopbarActionsMenuProps,
  TopbarScopeOption,
  TopbarScopeSwitcherConfig,
  TopbarShortcutDefinition,
  TopbarShortcutEmptyState,
  TopbarShortcutKeys,
  TopbarShortcutScope,
  TopbarShortcutsDialogProps,
  TopbarSidebarControlProps,
  TopbarUtilitiesMarketItem,
  TopbarUtilitiesRailProps,
  TopbarUtilityAction,
  TopbarUtilityRequest,
} from "./topbar/topbar-types";

export { DataTable as DashboardDataTable };

export type DashboardDataTableRow = z.infer<typeof schema>;

export interface DashboardDataTableProps {
  readonly data: readonly DashboardDataTableRow[];
}

export const DEMO_DASHBOARD_DATA_TABLE_ROWS =
  demoData as readonly DashboardDataTableRow[];
