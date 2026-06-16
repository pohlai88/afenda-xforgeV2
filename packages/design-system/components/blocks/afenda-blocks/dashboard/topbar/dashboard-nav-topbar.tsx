"use client";

import { TooltipProvider } from "@repo/design-system/components/afenda-ui/tooltip";
import { TOPBAR_DEFAULT_BRAND_TOOLTIP } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import { resolveTopbarSidebarControl } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-helpers";
import { TopbarBrandDisk } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-brand-disk";
import { TopbarScopeSwitchers } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-scope-switchers";
import { TopbarSidebarControl } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-sidebar-control";
import { TopbarUtilitiesRail } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-utilities-rail";
import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import { DEFAULT_DASHBOARD_NAV_TOPBAR_ARIA_LABEL } from "./dashboard-topbar-constants";
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
        aria-label={DEFAULT_DASHBOARD_NAV_TOPBAR_ARIA_LABEL}
        className={cn(dashboardNavTopbarShellClass, className)}
        data-slot="dashboard-nav-topbar"
        {...properties}
      >
        <div className={dashboardNavTopbarLeftClass} data-slot="dashboard-nav-topbar-left">
          {sidebarControlProps ? (
            <TopbarSidebarControl {...sidebarControlProps} />
          ) : null}
          {brand ? (
            <TopbarBrandDisk tooltip={TOPBAR_DEFAULT_BRAND_TOOLTIP} {...brand} />
          ) : null}
          <TopbarScopeSwitchers switchers={scopeSwitchers} />
        </div>
        <div className={dashboardNavTopbarRightClass} data-slot="dashboard-nav-topbar-right">
          {trailing}
          {utilitiesRail ? <TopbarUtilitiesRail {...utilitiesRail} /> : null}
        </div>
      </header>
    </TooltipProvider>
  );
});
