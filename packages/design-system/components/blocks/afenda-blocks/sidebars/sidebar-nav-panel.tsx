"use client";

import { ScrollArea } from "@repo/design-system/components/afenda-ui/scroll-area";
import { SidebarContent } from "@repo/design-system/components/afenda-ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { useMemo } from "react";
import { SIDEBAR_EMPTY_NAVIGATION_LABEL } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-constants";
import {
  EMPTY_SIDEBAR_LABEL_GROUPS,
  hasOperatorSidebarNavigation,
  isSidebarNavItemActive,
  resolveSidebarActiveItemIds,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-nav-helpers";
import {
  sidebarIconRailScrollAreaClass,
  sidebarNavPanelEmptyClass,
  sidebarNavPanelNavClass,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { SidebarLabelGroupPanel } from "./sidebar-label-group";
import { SidebarNavGroupPanel } from "./sidebar-nav-group";
import type { SidebarNavPanelProps } from "./sidebar-types";

export function SidebarNavPanel({
  className,
  emptyNavigationLabel = SIDEBAR_EMPTY_NAVIGATION_LABEL,
  groups,
  isItemActive = isSidebarNavItemActive,
  labelGroups = EMPTY_SIDEBAR_LABEL_GROUPS,
  pathname = "",
  renderLink,
}: SidebarNavPanelProps) {
  const activeItemIds = useMemo(
    () => resolveSidebarActiveItemIds(groups, pathname, isItemActive),
    [groups, isItemActive, pathname]
  );
  const hasNavigation = hasOperatorSidebarNavigation(groups, labelGroups);

  return (
    <SidebarContent
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden p-0",
        className
      )}
      data-slot="app-nav-sidebar-content"
    >
      <ScrollArea
        className={cn(
          "h-full min-h-0 w-full min-w-0",
          sidebarIconRailScrollAreaClass
        )}
      >
        <nav
          aria-label="Main navigation"
          className={sidebarNavPanelNavClass}
        >
          {hasNavigation ? (
            <>
              {groups.map((group) => (
                <SidebarNavGroupPanel
                  activeItemIds={activeItemIds}
                  group={group}
                  key={group.id}
                  renderLink={renderLink}
                />
              ))}
              {labelGroups.map((group) => (
                <SidebarLabelGroupPanel group={group} key={group.id} />
              ))}
            </>
          ) : (
            <div className={sidebarNavPanelEmptyClass} role="status">
              {emptyNavigationLabel}
            </div>
          )}
        </nav>
      </ScrollArea>
    </SidebarContent>
  );
}
