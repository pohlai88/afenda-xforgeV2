"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { appShellRegionLabelClass } from "../app-shell-recipes";
import type { AfendaAppTopbarProps } from "../app-shell-types";
import { appTopbarShellClass } from "./topbar-recipes";

export function AfendaAppTopbar({
  children,
  className,
  ...properties
}: AfendaAppTopbarProps) {
  return (
    <header
      className={cn(blockRecipe("blockShell"), appTopbarShellClass, className)}
      data-slot="app-topbar"
      {...properties}
    >
      {children ?? (
        <span className={cn(blockRecipe("blockMetricLabel"), appShellRegionLabelClass)}>
          Topbar
        </span>
      )}
    </header>
  );
}
