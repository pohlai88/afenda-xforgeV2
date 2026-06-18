"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "../../../afenda-ui/sidebar";
import {
  sidebarGroupLabelClass,
  sidebarNavGroupShellClass,
} from "./sidebar-recipes";
import { blockRecipe } from "../../block-recipes";
import { cn } from "../../../../lib/utils";
import { memo } from "react";
import { SidebarNavItemRow } from "./sidebar-nav-item";
import type { SidebarNavGroupPanelProps } from "./sidebar-types";

export const SidebarNavGroupPanel = memo(function SidebarNavGroupPanel({
  activeItemIds,
  group,
  renderLink,
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
            renderLink={renderLink}
            selected={activeItemIds.has(item.id)}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
});
