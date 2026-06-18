"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { appShellRegionLabelClass } from "../app-shell-recipes";
import type { AfendaAppSidebarProps } from "../app-shell-types";
import { appSidebarShellClass } from "./sidebar-recipes";

export function AfendaAppSidebar({
  children,
  className,
  ...properties
}: AfendaAppSidebarProps) {
  return (
    <aside
      className={cn(blockRecipe("blockShell"), appSidebarShellClass, className)}
      data-slot="app-sidebar"
      {...properties}
    >
      {children ?? (
        <span className={cn(blockRecipe("blockMetricLabel"), appShellRegionLabelClass)}>
          Sidebar
        </span>
      )}
    </aside>
  );
}
