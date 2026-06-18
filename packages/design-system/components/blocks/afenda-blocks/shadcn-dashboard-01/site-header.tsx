"use client";

import { blockRecipe } from "../../block-recipes";
import { cn } from "../../../../lib/utils";
import { NavTopbar, type NavTopbarProps } from "./nav-topbar";

export function SiteHeader(props: NavTopbarProps) {
  return (
    <NavTopbar
      className={cn(blockRecipe("blockChrome"))}
      data-slot="site-header"
      {...props}
    />
  );
}

export type { NavTopbarProps as SiteHeaderProps };
