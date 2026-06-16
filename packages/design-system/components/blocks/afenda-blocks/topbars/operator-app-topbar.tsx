"use client";

import { TooltipProvider } from "@repo/design-system/components/afenda-ui/tooltip";
import { TOPBAR_DEFAULT_BRAND_TOOLTIP } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import { resolveTopbarSidebarControl } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-helpers";
import { operatorAppTopbarShellClass } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { TopbarBrandDisk } from "./topbar-brand-disk";
import { TopbarScopeSwitchers } from "./topbar-scope-switchers";
import { TopbarSidebarControl } from "./topbar-sidebar-control";
import type { OperatorAppTopbarProps } from "./topbar-types";
import { TopbarUtilitiesRail } from "./topbar-utilities-rail";

export function OperatorAppTopbar({
  brand,
  className,
  scopeSwitchers = [],
  sidebarControl,
  trailing,
  utilitiesRail,
  ...properties
}: OperatorAppTopbarProps) {
  const sidebarControlProps = resolveTopbarSidebarControl(sidebarControl);

  return (
    <TooltipProvider delayDuration={350} skipDelayDuration={100}>
      <header
        className={cn(operatorAppTopbarShellClass, className)}
        data-slot="workspace-app-nav-topbar"
        {...properties}
      >
        <div
          className="flex min-w-0 items-center gap-2"
          data-slot="app-topbar-left"
        >
          {sidebarControlProps ? (
            <TopbarSidebarControl {...sidebarControlProps} />
          ) : null}
          <TopbarBrandDisk tooltip={TOPBAR_DEFAULT_BRAND_TOOLTIP} {...brand} />
          <TopbarScopeSwitchers switchers={scopeSwitchers} />
        </div>
        <div
          className="flex shrink-0 items-center justify-end gap-0.5"
          data-slot="app-topbar-right"
        >
          {trailing}
          <TopbarUtilitiesRail {...utilitiesRail} />
        </div>
      </header>
    </TooltipProvider>
  );
}
