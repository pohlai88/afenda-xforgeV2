"use client";

import { SidebarHeader } from "../../../afenda-ui/sidebar";
import { SIDEBAR_EMPTY_NAVIGATION_LABEL } from "./sidebar-constants";
import { resolveSidebarLinkRenderer } from "./sidebar-link-defaults";
import {
  EMPTY_SIDEBAR_LABEL_GROUPS,
  hasOperatorSidebarNavigation,
  isSidebarNavItemActive,
  resolveSidebarActiveItemIds,
} from "./sidebar-nav-helpers";
import { operatorAppSidebarShellClass } from "./sidebar-recipes";
import { cn } from "../../../../lib/utils";
import { useMemo } from "react";
import { SidebarNavGroupPanel } from "./sidebar-nav-group";
import { SidebarNavPanel } from "./sidebar-nav-panel";
import { SidebarQuickActions } from "./sidebar-quick-actions";
import type { OperatorAppSidebarProps } from "./sidebar-types";

export function OperatorAppSidebar({
  cardSections = [],
  className,
  emptyNavigationLabel = SIDEBAR_EMPTY_NAVIGATION_LABEL,
  footer,
  groups,
  isCardSectionItemActive,
  isItemActive,
  labelGroups = EMPTY_SIDEBAR_LABEL_GROUPS,
  pathname,
  pinnedGroups = [],
  quickActions,
  renderLink,
}: OperatorAppSidebarProps) {
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);
  const hasNavigation = hasOperatorSidebarNavigation(groups, labelGroups);
  const hasPinnedNavigation = hasOperatorSidebarNavigation(pinnedGroups);
  const hasCardSections = cardSections.length > 0;
  const hasQuickActions = (quickActions?.length ?? 0) > 0;
  const activePinnedItemIds = useMemo(
    () =>
      resolveSidebarActiveItemIds(
        pinnedGroups,
        pathname ?? "",
        isItemActive ?? isSidebarNavItemActive
      ),
    [isItemActive, pathname, pinnedGroups]
  );

  return (
    <nav
      aria-label="Operator navigation"
      className={cn(operatorAppSidebarShellClass, className)}
      data-empty={
        hasQuickActions ||
        hasPinnedNavigation ||
        hasNavigation ||
        hasCardSections ||
        footer
          ? undefined
          : ""
      }
      data-slot="operator-app-sidebar"
    >
      <SidebarQuickActions
        actions={quickActions ?? []}
        renderLink={linkRenderer}
      />
      {hasPinnedNavigation ? (
        <SidebarHeader
          className="shrink-0 border-border-subtle border-b pb-2"
          data-slot="app-sidebar-pinned-navigation"
        >
          {pinnedGroups.map((group) => (
            <SidebarNavGroupPanel
              activeItemIds={activePinnedItemIds}
              group={group}
              key={group.id}
              renderLink={linkRenderer}
            />
          ))}
        </SidebarHeader>
      ) : null}
      <SidebarNavPanel
        cardSections={cardSections}
        emptyNavigationLabel={emptyNavigationLabel}
        groups={groups}
        isCardSectionItemActive={isCardSectionItemActive}
        isItemActive={isItemActive}
        labelGroups={labelGroups}
        pathname={pathname}
        renderLink={linkRenderer}
      />
      {footer}
    </nav>
  );
}
