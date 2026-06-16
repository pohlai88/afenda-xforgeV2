"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";
import {
  sidebarGroupLabelClass,
  sidebarNavGroupShellClass,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
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
