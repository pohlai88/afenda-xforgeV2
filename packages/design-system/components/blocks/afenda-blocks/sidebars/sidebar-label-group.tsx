"use client";

import {
  sidebarGroupLabelClass,
  sidebarIconRailHiddenClass,
  sidebarLabelRowClass,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import type {
  SidebarLabelGroupPanelProps,
  SidebarLabelTone,
} from "./sidebar-types";

const labelToneClassName: Record<SidebarLabelTone, string> = {
  critical: "bg-critical",
  info: "bg-info",
  neutral: "bg-text-tertiary",
  success: "bg-success",
  warning: "bg-warning",
};

function SidebarLabelGroupPanelComponent({
  group,
}: SidebarLabelGroupPanelProps) {
  return (
    <div
      className={cn("grid min-w-0 gap-1", sidebarIconRailHiddenClass)}
      data-slot={`app-sidebar-label-group-${group.id}`}
    >
      <div
        className={cn(blockRecipe("blockMetricLabel"), sidebarGroupLabelClass)}
      >
        {group.label}
      </div>
      <div className="grid min-w-0 gap-1">
        {group.items.map((item) => (
          <div className={sidebarLabelRowClass} key={item.id}>
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                labelToneClassName[item.tone]
              )}
            />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const SidebarLabelGroupPanel = memo(SidebarLabelGroupPanelComponent);
