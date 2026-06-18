"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import type { AfendaAppTopbarProps } from "./topbar-types";
import { TopbarBrandDisk } from "./topbar-brand-disk";
import { appTopbarShellClass } from "./topbar-recipes";
import { TopbarScopeSwitchers } from "./topbar-scope-switchers";
import { TopbarSidebarControl } from "./topbar-sidebar-control";
import { TopbarRightActions } from "./topbar-right-actions";

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
  ...properties
}: AfendaAppTopbarProps) {
  if (children) {
    return (
      <header
        className={cn(blockRecipe("blockShell"), appTopbarShellClass, className)}
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
      <div data-slot="app-topbar-brand-slot">{brand ?? <TopbarBrandDisk />}</div>
      {showScopeSwitchers ? (
        scopeSwitchers ?? <TopbarScopeSwitchers />
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
            />
          ))
        : null}
    </header>
  );
}
