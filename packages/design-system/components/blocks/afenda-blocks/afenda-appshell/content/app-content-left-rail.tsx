"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { appShellRegionLabelClass } from "../app-shell-recipes";
import type { AfendaAppContentLeftRailProps } from "../app-shell-types";
import { appContentLeftRailShellClass } from "./content-recipes";

export function AfendaAppContentLeftRail({
  children,
  className,
  ...properties
}: AfendaAppContentLeftRailProps) {
  return (
    <aside
      className={cn(blockRecipe("blockToolbar"), appContentLeftRailShellClass, className)}
      data-slot="app-content-left-rail"
      id="app-content-left-rail"
      {...properties}
    >
      {children ?? (
        <span className={cn(blockRecipe("blockMetricLabel"), appShellRegionLabelClass)}>
          Left rail
        </span>
      )}
    </aside>
  );
}
