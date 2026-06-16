"use client";

import { cn } from "@repo/design-system/lib/utils";
import { SidebarNavPanel } from "./sidebar-nav-panel";
import { SidebarQuickActions } from "./sidebar-quick-actions";
import { sidebarIconRailShellClass } from "./sidebar-recipes";
import type { OperatorAppSidebarProps } from "./sidebar-types";

export function OperatorAppSidebar({
  footer,
  groups,
  isItemActive,
  labelGroups,
  pathname,
  quickActions,
  renderActionLink,
  renderNavItemLink,
}: OperatorAppSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col",
        sidebarIconRailShellClass
      )}
      data-slot="operator-app-sidebar"
    >
      {quickActions?.length ? (
        <SidebarQuickActions
          actions={quickActions}
          renderActionLink={renderActionLink}
        />
      ) : null}
      <SidebarNavPanel
        groups={groups}
        isItemActive={isItemActive}
        labelGroups={labelGroups}
        pathname={pathname}
        renderNavItemLink={renderNavItemLink}
      />
      {footer}
    </div>
  );
}
