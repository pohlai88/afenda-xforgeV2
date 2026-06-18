"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { appShellRegionLabelClass } from "../app-shell-recipes";
import type { AfendaAppContentRightRailProps } from "../app-shell-types";
import { appContentRightRailShellClass } from "./content-recipes";

export function AfendaAppContentRightRail({
  children,
  className,
  ...properties
}: AfendaAppContentRightRailProps) {
  return (
    <aside
      className={cn(blockRecipe("blockRail"), appContentRightRailShellClass, className)}
      data-slot="app-content-right-rail"
      {...properties}
    >
      {children ?? (
        <span className={cn(blockRecipe("blockMetricLabel"), appShellRegionLabelClass)}>
          Right rail
        </span>
      )}
    </aside>
  );
}
