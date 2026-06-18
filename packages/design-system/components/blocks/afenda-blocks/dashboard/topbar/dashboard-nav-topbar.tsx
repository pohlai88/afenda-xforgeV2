"use client";

import { TooltipProvider } from "../../../../afenda-ui/tooltip";
import { TopbarBrandDisk } from "../../topbars/topbar-brand-disk";
import { TOPBAR_DEFAULT_BRAND_TOOLTIP } from "../../topbars/topbar-constants";
import { resolveTopbarSidebarControl } from "../../topbars/topbar-helpers";
import { TopbarScopeSwitchers } from "../../topbars/topbar-scope-switchers";
import { TopbarSidebarControl } from "../../topbars/topbar-sidebar-control";
import { TopbarUtilitiesRail } from "../../topbars/topbar-utilities-rail";
import { cn } from "../../../../../lib/utils";
import { memo } from "react";
import {
  dashboardNavTopbarLeftClass,
  dashboardNavTopbarRightClass,
  dashboardNavTopbarShellClass,
} from "./dashboard-topbar-recipes";
import type { DashboardNavTopbarProps } from "./dashboard-topbar-types";

export const DashboardNavTopbar = memo(function DashboardNavTopbar({
  brand,
  className,
  scopeSwitchers = [],
  sidebarControl,
  trailing,
  utilitiesRail,
  ...properties
}: DashboardNavTopbarProps) {
  const sidebarControlProps = resolveTopbarSidebarControl(sidebarControl);

  return (
    <TooltipProvider delayDuration={350} skipDelayDuration={100}>
      <header
        className={cn(dashboardNavTopbarShellClass, className)}
        data-slot="dashboard-nav-topbar"
        {...properties}
      >
        <div
          className={dashboardNavTopbarLeftClass}
          data-slot="dashboard-nav-topbar-left"
        >
          {sidebarControlProps ? (
            <TopbarSidebarControl {...sidebarControlProps} />
          ) : null}
          {brand ? (
            <TopbarBrandDisk
              tooltip={TOPBAR_DEFAULT_BRAND_TOOLTIP}
              {...brand}
            />
          ) : null}
          <TopbarScopeSwitchers switchers={scopeSwitchers} />
        </div>
        <div
          className={dashboardNavTopbarRightClass}
          data-slot="dashboard-nav-topbar-right"
        >
          {trailing}
          {utilitiesRail ? <TopbarUtilitiesRail {...utilitiesRail} /> : null}
        </div>
      </header>
    </TooltipProvider>
  );
});
