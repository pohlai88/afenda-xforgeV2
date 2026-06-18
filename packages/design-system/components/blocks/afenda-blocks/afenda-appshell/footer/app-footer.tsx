"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { appShellRegionLabelClass } from "../app-shell-recipes";
import type { AfendaAppFooterProps } from "../app-shell-types";
import { appFooterShellClass } from "./footer-recipes";

export function AfendaAppFooter({
  children,
  className,
  ...properties
}: AfendaAppFooterProps) {
  return (
    <footer
      className={cn(blockRecipe("blockShell"), appFooterShellClass, className)}
      data-slot="app-footer"
      {...properties}
    >
      {children ?? (
        <span className={cn(blockRecipe("blockMetricLabel"), appShellRegionLabelClass)}>
          Footer
        </span>
      )}
    </footer>
  );
}
