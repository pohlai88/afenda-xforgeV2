"use client";

import { cn } from "@repo/design-system/lib/utils";
import { useMemo } from "react";
import { ScrollArea } from "../../../afenda-ui/scroll-area";
import { SidebarContent } from "../../../afenda-ui/sidebar";
import {
  EMPTY_SIDEBAR_LABEL_GROUPS,
  isSidebarNavItemActive,
  resolveSidebarActiveItemIds,
} from "./sidebar-nav-helpers";
import { SidebarLabelGroupPanel } from "./sidebar-label-group";
import { SidebarNavGroupPanel } from "./sidebar-nav-group";
import { sidebarNavPanelNavClass } from "./sidebar-recipes";
import type { SidebarNavPanelProps } from "./sidebar-types";

export function SidebarNavPanel({
  className,
  groups,
  isItemActive = isSidebarNavItemActive,
  labelGroups = EMPTY_SIDEBAR_LABEL_GROUPS,
  pathname = "",
  renderNavItemLink,
}: SidebarNavPanelProps) {
  const activeItemIds = useMemo(
    () => resolveSidebarActiveItemIds(groups, pathname, isItemActive),
    [groups, isItemActive, pathname]
  );

  return (
    <SidebarContent
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden p-0",
        className
      )}
      data-slot="app-nav-sidebar-content"
    >
      <ScrollArea className="h-full min-h-0 w-full min-w-0 overscroll-contain [&_[data-slot=scroll-area-viewport]]:overflow-x-hidden">
        <nav
          aria-label="Main navigation"
          className={sidebarNavPanelNavClass}
        >
          {groups.map((group) => (
            <SidebarNavGroupPanel
              activeItemIds={activeItemIds}
              group={group}
              key={group.id}
              renderNavItemLink={renderNavItemLink}
            />
          ))}
          {labelGroups.map((group) => (
            <SidebarLabelGroupPanel group={group} key={group.id} />
          ))}
        </nav>
      </ScrollArea>
    </SidebarContent>
  );
}
