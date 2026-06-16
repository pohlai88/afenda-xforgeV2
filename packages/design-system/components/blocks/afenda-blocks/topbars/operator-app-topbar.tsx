"use client";

import { TooltipProvider } from "@repo/design-system/components/afenda-ui/tooltip";
import { cn } from "@repo/design-system/lib/utils";
import { resolveTopbarSidebarControl } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-helpers";
import { operatorAppTopbarShellClass } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-recipes";
import { TOPBAR_DEFAULT_BRAND_TOOLTIP } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import { TopbarBrandDisk } from "./topbar-brand-disk";
import { TopbarCommandTrigger } from "./topbar-command-trigger";
import { TopbarScopeSwitchers } from "./topbar-scope-switchers";
import { TopbarSidebarControl } from "./topbar-sidebar-control";
import type {
  OperatorAppTopbarProps,
  TopbarCommandTriggerProps,
} from "./topbar-types";
import { TopbarUtilitiesRail } from "./topbar-utilities-rail";

function TopbarCommandPaletteSlot({
  className,
  commandPalette,
}: {
  readonly className?: string;
  readonly commandPalette: TopbarCommandTriggerProps;
}) {
  return <TopbarCommandTrigger {...commandPalette} className={className} />;
}

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
  const sidebarControlProps = resolveTopbarSidebarControl(sidebarControl);

  return (
    <TooltipProvider delayDuration={350} skipDelayDuration={100}>
      <header
        aria-label="Operator topbar"
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
        {commandPalette ? (
          <div
            className="hidden min-w-0 flex-1 justify-center px-2 md:flex"
            data-slot="app-topbar-center"
          >
            <TopbarCommandPaletteSlot commandPalette={commandPalette} />
          </div>
        ) : null}
        <div
          className="flex shrink-0 items-center justify-end gap-0.5"
          data-slot="app-topbar-right"
        >
          {commandPalette ? (
            <TopbarCommandPaletteSlot
              className="md:hidden"
              commandPalette={commandPalette}
            />
          ) : null}
          {trailing}
          <TopbarUtilitiesRail {...utilitiesRail} />
        </div>
      </header>
    </TooltipProvider>
  );
}
