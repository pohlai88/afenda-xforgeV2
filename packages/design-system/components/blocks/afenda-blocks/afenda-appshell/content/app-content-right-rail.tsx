"use client";

import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
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
      className={cn(
        blockRecipe("blockToolbar"),
        appContentRightRailShellClass,
        className
      )}
      data-slot="app-content-right-rail"
      id="app-content-right-rail"
      {...properties}
    >
      {children ?? (
        <span
          className={cn(
            blockRecipe("blockMetricLabel"),
            appShellRegionLabelClass
          )}
        >
          Right rail
        </span>
      )}
    </aside>
  );
}
