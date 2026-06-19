"use client";

import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import { appShellRegionLabelClass } from "../app-shell-recipes";
import type { AfendaAppContentBottomDrawerProps } from "../app-shell-types";
import { appContentBottomDrawerShellClass } from "./content-recipes";

export function AfendaAppContentBottomDrawer({
  children,
  className,
  id = "app-content-bottom-drawer",
  ...properties
}: AfendaAppContentBottomDrawerProps) {
  return (
    <div
      className={cn(
        blockRecipe("blockToolbar"),
        appContentBottomDrawerShellClass,
        className
      )}
      data-slot="app-content-bottom-drawer"
      id={id}
      {...properties}
    >
      {children ?? (
        <span
          className={cn(
            blockRecipe("blockMetricLabel"),
            appShellRegionLabelClass
          )}
        >
          Bottom drawer
        </span>
      )}
    </div>
  );
}
