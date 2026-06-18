import type {
  Sidebar,
  SidebarProvider,
} from "../../../../afenda-ui/sidebar";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { ContentLayoutFooterProps } from "../../content-layout/content-layout-types";
import type { ChartAreaInteractiveProps } from "../chart/chart-area-types";
import type { DashboardDataTableRow } from "../data-table/dashboard-data-table-schema";
import type { DashboardDataTableProps } from "../data-table/dashboard-data-table-types";
import type { SectionCardsProps } from "../kpi-card/dashboard-section-cards-types";
import type { AppSidebarProps } from "../sidebar/dashboard-sidebar-types";
import type { SiteHeaderProps } from "../site-header/dashboard-site-header-types";
import type { DashboardNavTopbarProps } from "../topbar/dashboard-topbar-types";

export interface DashboardPageProps {
  readonly appSidebarProps?: AppSidebarProps &
    Omit<ComponentPropsWithoutRef<typeof Sidebar>, "children">;
  readonly chartProps?: ChartAreaInteractiveProps | false;
  readonly className?: string;
  readonly data?: readonly DashboardDataTableRow[];
  readonly dataTableProps?: Omit<DashboardDataTableProps, "data">;
  readonly footer?: ReactNode;
  readonly footerProps?: ContentLayoutFooterProps | false;
  readonly navTopbarProps?: DashboardNavTopbarProps | false;
  readonly sectionCardsProps?: SectionCardsProps | false;
  readonly sidebarInsetClassName?: string;
  readonly sidebarProviderProps?: Omit<
    ComponentPropsWithoutRef<typeof SidebarProvider>,
    "children" | "className" | "style"
  >;
  readonly siteHeaderProps?: SiteHeaderProps | false;
  readonly style?: CSSProperties;
}
