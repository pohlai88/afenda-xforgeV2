"use client";

import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import { TopbarBrandDisk } from "./topbar-brand-disk";
import { appTopbarShellClass } from "./topbar-recipes";
import { TopbarRightActions } from "./topbar-right-actions";
import { TopbarSidebarControl } from "./topbar-sidebar-control";
import type { AfendaAppTopbarProps } from "./topbar-types";

export function AfendaAppTopbar({
  actions,
  brand,
  children,
  className,
  previewUtilities,
  rightActionGroups,
  scopeSwitchers,
  showRightActions = true,
  showScopeSwitchers = true,
  showSidebarTrigger = true,
  sidebarTrigger,
  tenantId,
  userId,
  utilityActionOverrides,
  ...properties
}: AfendaAppTopbarProps) {
  if (children) {
    return (
      <header
        className={cn(
          blockRecipe("blockShell"),
          appTopbarShellClass,
          className
        )}
        data-slot="app-topbar"
        {...properties}
      >
        {children}
      </header>
    );
  }

  return (
    <header
      className={cn(blockRecipe("blockShell"), appTopbarShellClass, className)}
      data-slot="app-topbar"
      {...properties}
    >
      {showSidebarTrigger ? (
        <div data-slot="app-topbar-sidebar-trigger-slot">
          {sidebarTrigger ?? <TopbarSidebarControl />}
        </div>
      ) : null}
      <div data-slot="app-topbar-brand-slot">
        {brand ?? <TopbarBrandDisk />}
      </div>
      {showScopeSwitchers ? (
        (scopeSwitchers ?? <div className="min-w-0 flex-1" />)
      ) : (
        <div className="min-w-0 flex-1" />
      )}
      {showRightActions
        ? (actions ?? (
            <TopbarRightActions
              actionGroups={rightActionGroups}
              previewUtilities={previewUtilities}
              tenantId={tenantId}
              userId={userId}
              utilityActionOverrides={utilityActionOverrides}
            />
          ))
        : null}
    </header>
  );
}
