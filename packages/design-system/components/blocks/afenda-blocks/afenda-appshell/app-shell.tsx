"use client";

import { cn } from "../../../../lib/utils";
import { blockRecipe } from "../../block-recipes";
import type { AfendaAppShellCssVars } from "./app-shell-css-vars";
import {
  APP_SHELL_FOOTER_HEIGHT,
  APP_SHELL_RAIL_WIDTH,
  APP_SHELL_SIDEBAR_ICON_RAIL_WIDTH,
  APP_SHELL_SIDEBAR_WIDTH,
  APP_SHELL_TOPBAR_HEIGHT,
  appShellBentoGridClass,
  appShellContentBodyClass,
  appShellContentInsetClass,
} from "./app-shell-recipes";
import {
  AppShellSidebarProvider,
  useAppShellSidebar,
} from "./app-shell-sidebar-context";
import type { AfendaAppShellProps } from "./app-shell-types";
import { AfendaAppContent } from "./content/app-content";
import { AfendaAppFooter } from "./footer/app-footer";
import { AfendaAppSidebar } from "./sidebar/app-sidebar";
import { AfendaAppTopbar } from "./topbar/app-topbar";

function AfendaAppShellInner({
  children,
  className,
  contentBottomDrawer,
  contentHeader,
  contentLeftRail,
  contentRightRail,
  defaultContentBottomDrawerOpen,
  defaultContentLeftRailOpen,
  defaultContentRightRailOpen,
  footer,
  sidebar,
  topbar,
  ...properties
}: AfendaAppShellProps) {
  const { behaviorMode, isExpanded, sidebarActiveWidth } = useAppShellSidebar();

  return (
    <div
      className={cn(
        blockRecipe("blockShell"),
        appShellBentoGridClass,
        className
      )}
      data-sidebar-expanded={isExpanded ? "true" : "false"}
      data-sidebar-mode={behaviorMode}
      data-slot="afenda-app-shell"
      style={
        {
          "--app-shell-footer-height": APP_SHELL_FOOTER_HEIGHT,
          "--app-shell-rail-width": APP_SHELL_RAIL_WIDTH,
          "--app-shell-sidebar-active-width": sidebarActiveWidth,
          "--app-shell-sidebar-icon-rail-width":
            APP_SHELL_SIDEBAR_ICON_RAIL_WIDTH,
          "--app-shell-sidebar-width": APP_SHELL_SIDEBAR_WIDTH,
          "--app-shell-topbar-height": APP_SHELL_TOPBAR_HEIGHT,
        } as AfendaAppShellCssVars
      }
      {...properties}
    >
      {topbar ?? <AfendaAppTopbar />}
      {sidebar ?? <AfendaAppSidebar />}
      <div className={cn(appShellContentInsetClass)}>
        <div
          className={cn(appShellContentBodyClass)}
          data-slot="app-content-body"
        >
          <AfendaAppContent
            bottomDrawer={contentBottomDrawer}
            defaultBottomDrawerOpen={defaultContentBottomDrawerOpen}
            defaultLeftRailOpen={defaultContentLeftRailOpen}
            defaultRightRailOpen={defaultContentRightRailOpen}
            header={contentHeader}
            leftRail={contentLeftRail}
            rightRail={contentRightRail}
          >
            {children}
          </AfendaAppContent>
        </div>
        {footer ?? <AfendaAppFooter />}
      </div>
    </div>
  );
}

export function AfendaAppShell({
  defaultSidebarBehaviorMode,
  ...props
}: AfendaAppShellProps) {
  return (
    <AppShellSidebarProvider defaultBehaviorMode={defaultSidebarBehaviorMode}>
      <AfendaAppShellInner {...props} />
    </AppShellSidebarProvider>
  );
}
