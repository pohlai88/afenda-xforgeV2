"use client";

import { cn } from "@repo/design-system/lib/utils";
import { SIDEBAR_EMPTY_NAVIGATION_LABEL } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-constants";
import {
  EMPTY_SIDEBAR_LABEL_GROUPS,
  hasOperatorSidebarNavigation,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-nav-helpers";
import { resolveSidebarLinkRenderer } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-link-defaults";
import { operatorAppSidebarShellClass } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { SidebarNavPanel } from "./sidebar-nav-panel";
import { SidebarQuickActions } from "./sidebar-quick-actions";
import type { OperatorAppSidebarProps } from "./sidebar-types";

export function OperatorAppSidebar({
  className,
  emptyNavigationLabel = SIDEBAR_EMPTY_NAVIGATION_LABEL,
  footer,
  groups,
  isItemActive,
  labelGroups = EMPTY_SIDEBAR_LABEL_GROUPS,
  pathname,
  quickActions,
  renderLink,
}: OperatorAppSidebarProps) {
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);
  const hasNavigation = hasOperatorSidebarNavigation(groups, labelGroups);
  const hasQuickActions = (quickActions?.length ?? 0) > 0;

  return (
    <div
      aria-label="Operator navigation"
      className={cn(operatorAppSidebarShellClass, className)}
      data-empty={!hasQuickActions && !hasNavigation && !footer ? "" : undefined}
      data-slot="operator-app-sidebar"
    >
      <SidebarQuickActions
        actions={quickActions ?? []}
        renderLink={linkRenderer}
      />
      <SidebarNavPanel
        emptyNavigationLabel={emptyNavigationLabel}
        groups={groups}
        isItemActive={isItemActive}
        labelGroups={labelGroups}
        pathname={pathname}
        renderLink={linkRenderer}
      />
      {footer}
    </div>
  );
}
