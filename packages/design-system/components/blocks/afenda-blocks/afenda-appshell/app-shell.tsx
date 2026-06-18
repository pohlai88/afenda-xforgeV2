"use client";

import * as React from "react";
import { blockRecipe } from "../../block-recipes";
import { cn } from "../../../../lib/utils";
import {
  APP_SHELL_FOOTER_HEIGHT,
  APP_SHELL_RAIL_WIDTH,
  APP_SHELL_SIDEBAR_WIDTH,
  APP_SHELL_TOPBAR_HEIGHT,
  appShellBentoGridClass,
  appShellContentInsetClass,
} from "./app-shell-recipes";
import type { AfendaAppShellProps } from "./app-shell-types";
import { AfendaAppContent } from "./content/app-content";
import { AfendaAppFooter } from "./footer/app-footer";
import { AfendaAppSidebar } from "./sidebar/app-sidebar";
import { AfendaAppTopbar } from "./topbar/app-topbar";

export function AfendaAppShell({
  children,
  className,
  contentHeader,
  contentLeftRail,
  contentRightRail,
  footer,
  sidebar,
  topbar,
  ...properties
}: AfendaAppShellProps) {
  return (
    <div
      className={cn(blockRecipe("blockShell"), appShellBentoGridClass, className)}
      data-slot="afenda-app-shell"
      style={
        {
          "--app-shell-footer-height": APP_SHELL_FOOTER_HEIGHT,
          "--app-shell-rail-width": APP_SHELL_RAIL_WIDTH,
          "--app-shell-sidebar-width": APP_SHELL_SIDEBAR_WIDTH,
          "--app-shell-topbar-height": APP_SHELL_TOPBAR_HEIGHT,
        } as React.CSSProperties
      }
      {...properties}
    >
      {topbar ?? <AfendaAppTopbar />}
      {sidebar ?? <AfendaAppSidebar />}
      <div className={cn(appShellContentInsetClass)}>
        <AfendaAppContent
          header={contentHeader}
          leftRail={contentLeftRail}
          rightRail={contentRightRail}
        >
          {children}
        </AfendaAppContent>
      </div>
      {footer ?? <AfendaAppFooter />}
    </div>
  );
}
