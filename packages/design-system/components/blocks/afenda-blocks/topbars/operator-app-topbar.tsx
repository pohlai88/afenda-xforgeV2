"use client";

import { TooltipProvider } from "../../../afenda-ui/tooltip";
import { cn } from "@repo/design-system/lib/utils";
import { TopbarBrandDisk } from "./topbar-brand-disk";
import { TopbarCommandTrigger } from "./topbar-command-trigger";
import { topbarShellClass } from "./topbar-recipes";
import { TopbarScopeSwitchers } from "./topbar-scope-switchers";
import { TopbarSidebarControl } from "./topbar-sidebar-control";
import type { OperatorAppTopbarProps, TopbarSidebarControlProps } from "./topbar-types";
import { TopbarUtilitiesRail } from "./topbar-utilities-rail";

export function OperatorAppTopbar({
  brand,
  className,
  commandPalette,
  scopeSwitchers = [],
  sidebarControl,
  trailing,
  utilitiesRail,
  ...properties
}: OperatorAppTopbarProps) {
  const sidebarControlProps: TopbarSidebarControlProps | null =
    sidebarControl === true
      ? {}
      : sidebarControl === false || sidebarControl === undefined
        ? null
        : sidebarControl;

  return (
    <TooltipProvider delayDuration={350} skipDelayDuration={100}>
      <header
        className={cn(topbarShellClass, className)}
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
          <TopbarBrandDisk tooltip="Afenda workspace" {...brand} />
          <TopbarScopeSwitchers switchers={scopeSwitchers} />
        </div>
        {commandPalette ? (
          <div
            className="hidden min-w-0 flex-1 justify-center px-2 md:flex"
            data-slot="app-topbar-center"
          >
            <TopbarCommandTrigger {...commandPalette} />
          </div>
        ) : null}
        <div
          className="flex shrink-0 items-center justify-end gap-0.5"
          data-slot="app-topbar-right"
        >
          {commandPalette ? (
            <TopbarCommandTrigger
              {...commandPalette}
              className="md:hidden"
            />
          ) : null}
          {trailing}
          <TopbarUtilitiesRail {...utilitiesRail} />
        </div>
      </header>
    </TooltipProvider>
  );
}
