"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { appShellRegionLabelClass } from "../app-shell-recipes";
import type { AfendaAppContentHeaderProps } from "../app-shell-types";
import { appContentHeaderShellClass } from "./content-recipes";

export function AfendaAppContentHeader({
  children,
  className,
  ...properties
}: AfendaAppContentHeaderProps) {
  return (
    <div
      className={cn(blockRecipe("blockHeader"), appContentHeaderShellClass, className)}
      data-slot="app-content-header"
      {...properties}
    >
      {children ?? (
        <span className={cn(blockRecipe("blockMetricLabel"), appShellRegionLabelClass)}>
          Header
        </span>
      )}
    </div>
  );
}
