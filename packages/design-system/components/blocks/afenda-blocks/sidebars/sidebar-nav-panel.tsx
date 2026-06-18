"use client";

import { ScrollArea } from "../../../afenda-ui/scroll-area";
import { SidebarContent } from "../../../afenda-ui/sidebar";
import { SIDEBAR_EMPTY_NAVIGATION_LABEL } from "./sidebar-constants";
import {
  EMPTY_SIDEBAR_LABEL_GROUPS,
  hasOperatorSidebarNavigation,
  isSidebarNavItemActive,
  resolveSidebarActiveCardSectionIds,
  resolveSidebarActiveItemIds,
} from "./sidebar-nav-helpers";
import {
  sidebarIconRailScrollAreaClass,
  sidebarNavPanelEmptyClass,
  sidebarNavPanelNavClass,
} from "./sidebar-recipes";
import { cn } from "../../../../lib/utils";
import { useMemo } from "react";
import { SidebarCardSectionPanel } from "./sidebar-card-section";
import { SidebarLabelGroupPanel } from "./sidebar-label-group";
import { SidebarNavGroupPanel } from "./sidebar-nav-group";
import type { SidebarNavPanelProps } from "./sidebar-types";

export function SidebarNavPanel({
  cardSections = [],
  className,
  emptyNavigationLabel = SIDEBAR_EMPTY_NAVIGATION_LABEL,
  groups,
  isCardSectionItemActive,
  isItemActive = isSidebarNavItemActive,
  labelGroups = EMPTY_SIDEBAR_LABEL_GROUPS,
  pathname = "",
  renderLink,
}: SidebarNavPanelProps) {
  const activeItemIds = useMemo(
    () => resolveSidebarActiveItemIds(groups, pathname, isItemActive),
    [groups, isItemActive, pathname]
  );
  const activeCardSectionIds = useMemo(
    () =>
      resolveSidebarActiveCardSectionIds(
        cardSections,
        pathname,
        isCardSectionItemActive
      ),
    [cardSections, isCardSectionItemActive, pathname]
  );
  const hasCardSections = cardSections.length > 0;
  const hasNavigation =
    hasOperatorSidebarNavigation(groups, labelGroups) || hasCardSections;

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
        <nav aria-label="Main navigation" className={sidebarNavPanelNavClass}>
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
              {cardSections.map((section) => (
                <SidebarCardSectionPanel
                  isActive={activeCardSectionIds.has(section.id)}
                  isItemActive={isCardSectionItemActive}
                  key={section.id}
                  pathname={pathname}
                  renderLink={renderLink}
                  section={section}
                />
              ))}
              {labelGroups.map((group) => (
                <SidebarLabelGroupPanel group={group} key={group.id} />
              ))}
            </>
          ) : (
            <output className={sidebarNavPanelEmptyClass}>
              {emptyNavigationLabel}
            </output>
          )}
        </nav>
      </ScrollArea>
    </SidebarContent>
  );
}
