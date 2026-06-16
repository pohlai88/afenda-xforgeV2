"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { type CSSProperties, memo } from "react";
import { ChartAreaInteractive } from "../chart/chart-area-interactive";
import { DashboardDataTable } from "../data-table";
import { DEMO_DASHBOARD_DATA_TABLE_ROWS } from "../data-table/dashboard-data-table-demo-data";
import { SectionCards } from "../kpi-card/section-cards";
import { AppSidebar } from "../sidebar/app-sidebar";
import { SiteHeader } from "../site-header/site-header";
import { DashboardNavTopbar } from "../topbar/dashboard-nav-topbar";
import { DEMO_DASHBOARD_NAV_TOPBAR_PROPS } from "../topbar/dashboard-topbar-demo-catalog";
import { DEFAULT_DASHBOARD_PAGE_PROVIDER_STYLE } from "./dashboard-page-constants";
import { DashboardPageFooter } from "./dashboard-page-footer";
import { DEMO_DASHBOARD_PAGE_FOOTER_PROPS } from "./dashboard-page-footer-demo-catalog";
import {
  dashboardAppSidebarContainClass,
  dashboardPageBodyClass,
  dashboardPageChartSectionClass,
  dashboardPageChromeClass,
  dashboardPageContainerClass,
  dashboardPageContentClass,
  dashboardPageFooterSlotClass,
  dashboardPageInsetClass,
  dashboardPageMainClass,
  dashboardPageMainColumnClass,
  dashboardPageProviderClass,
} from "./dashboard-page-recipes";
import type { DashboardPageProps } from "./dashboard-page-types";

const DEFAULT_APP_SIDEBAR_VARIANT = "inset" as const;

export const DashboardPage = memo(function DashboardPage({
  appSidebarProps,
  chartProps,
  className,
  data = DEMO_DASHBOARD_DATA_TABLE_ROWS,
  dataTableProps,
  footer,
  footerProps = DEMO_DASHBOARD_PAGE_FOOTER_PROPS,
  navTopbarProps = DEMO_DASHBOARD_NAV_TOPBAR_PROPS,
  sectionCardsProps,
  sidebarInsetClassName,
  sidebarProviderProps,
  siteHeaderProps,
  style,
}: DashboardPageProps) {
  const {
    className: appSidebarClassName,
    variant = DEFAULT_APP_SIDEBAR_VARIANT,
    ...appSidebarRest
  } = appSidebarProps ?? {};

  const showNavTopbar = navTopbarProps !== false;
  const showFooter = footerProps !== false;
  const resolvedSiteHeaderProps =
    siteHeaderProps === false
      ? false
      : {
          showSidebarTrigger: showNavTopbar ? false : undefined,
          ...siteHeaderProps,
        };

  return (
    <SidebarProvider
      className={cn(dashboardPageProviderClass, "flex", className)}
      data-slot="dashboard-page"
      style={
        {
          ...DEFAULT_DASHBOARD_PAGE_PROVIDER_STYLE,
          ...(showNavTopbar ? {} : { "--dashboard-nav-topbar-height": "0px" }),
          ...(showFooter ? {} : { "--dashboard-footer-height": "0px" }),
          ...style,
        } as CSSProperties
      }
      {...sidebarProviderProps}
    >
      <div className={dashboardPageChromeClass} data-slot="dashboard-chrome">
        {showNavTopbar ? <DashboardNavTopbar {...navTopbarProps} /> : null}
        <div className={dashboardPageBodyClass} data-slot="dashboard-body">
          <AppSidebar
            className={cn(dashboardAppSidebarContainClass, appSidebarClassName)}
            variant={variant}
            {...appSidebarRest}
          />
          <div
            className={dashboardPageMainColumnClass}
            data-slot="dashboard-main-column"
          >
            <SidebarInset
              className={cn(dashboardPageInsetClass, sidebarInsetClassName)}
            >
              {resolvedSiteHeaderProps !== false ? (
                <SiteHeader {...resolvedSiteHeaderProps} />
              ) : null}
              <div className={dashboardPageMainClass}>
                <div className={dashboardPageContainerClass}>
                  <div className={dashboardPageContentClass}>
                    {sectionCardsProps !== false ? (
                      <SectionCards {...sectionCardsProps} />
                    ) : null}
                    {chartProps !== false ? (
                      <div className={dashboardPageChartSectionClass}>
                        <ChartAreaInteractive {...chartProps} />
                      </div>
                    ) : null}
                    <DashboardDataTable data={data} {...dataTableProps} />
                  </div>
                </div>
              </div>
            </SidebarInset>
            {showFooter ? (
              <div
                className={dashboardPageFooterSlotClass}
                data-slot="dashboard-footer"
              >
                {footer !== undefined ? (
                  footer
                ) : (
                  <DashboardPageFooter {...footerProps} />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
});
