"use client";

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import { TopbarSidebarControl } from "./topbar-sidebar-control";

export function TopbarSidebarTrigger({
  className,
  ...properties
}: ComponentPropsWithoutRef<typeof TopbarSidebarControl>) {
  return (
    <TopbarSidebarControl
      className={cn(blockRecipe("blockShell"), className)}
      data-slot="app-topbar-sidebar-trigger"
      {...properties}
    />
  );
}
