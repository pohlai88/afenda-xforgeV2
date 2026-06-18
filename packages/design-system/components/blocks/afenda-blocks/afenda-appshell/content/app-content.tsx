"use client";

import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { appShellRegionLabelClass } from "../app-shell-recipes";
import type { AfendaAppContentProps } from "../app-shell-types";
import { AfendaAppContentHeader } from "./app-content-header";
import { AfendaAppContentLeftRail } from "./app-content-left-rail";
import { AfendaAppContentRightRail } from "./app-content-right-rail";
import {
  appContentBentoGridClass,
  appContentMainShellClass,
  appContentShellClass,
} from "./content-recipes";

export function AfendaAppContent({
  children,
  className,
  header,
  leftRail,
  rightRail,
  ...properties
}: AfendaAppContentProps) {
  return (
    <section
      className={cn(
        blockRecipe("blockPanel"),
        blockRecipe("blockShell"),
        appContentShellClass,
        appContentBentoGridClass,
        className
      )}
      data-slot="app-content"
      {...properties}
    >
      {header ?? <AfendaAppContentHeader />}
      {leftRail ?? <AfendaAppContentLeftRail />}
      <main
        className={cn(blockRecipe("blockShell"), appContentMainShellClass)}
        data-slot="app-content-main"
      >
        {children ?? (
          <span className={cn(blockRecipe("blockMetricLabel"), appShellRegionLabelClass)}>
            Main content
          </span>
        )}
      </main>
      {rightRail ?? <AfendaAppContentRightRail />}
    </section>
  );
}
