"use client";

import { cn } from "../../../../lib/utils";
import { blockRecipe } from "../../block-recipes";
import { NavTopbar } from "./nav-topbar";

export type { NavTopbarProps as SiteHeaderProps } from "./nav-topbar";

export function SiteHeader(props: Parameters<typeof NavTopbar>[0]) {
  return (
    <NavTopbar
      className={cn(blockRecipe("blockChrome"))}
      data-slot="site-header"
      {...props}
    />
  );
}
