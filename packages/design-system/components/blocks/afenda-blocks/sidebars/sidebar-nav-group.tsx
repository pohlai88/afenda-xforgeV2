"use client";

import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import { blockRecipe } from "../../block-recipes";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "../../../afenda-ui/sidebar";
import { SidebarNavItemRow } from "./sidebar-nav-item";
import { sidebarGroupLabelClass, sidebarNavGroupShellClass } from "./sidebar-recipes";
import type { SidebarNavGroupPanelProps } from "./sidebar-types";

export const SidebarNavGroupPanel = memo(function SidebarNavGroupPanel({
  activeItemIds,
  group,
  renderNavItemLink,
}: SidebarNavGroupPanelProps) {
  return (
    <SidebarGroup
      className={sidebarNavGroupShellClass}
      data-slot={`app-sidebar-nav-group-${group.id}`}
    >
      <SidebarGroupLabel
        className={cn(blockRecipe("blockMetricLabel"), sidebarGroupLabelClass)}
      >
        {group.label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {group.items.map((item) => (
          <SidebarNavItemRow
            item={item}
            key={item.id}
            renderNavItemLink={renderNavItemLink}
            selected={activeItemIds.has(item.id)}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
});
