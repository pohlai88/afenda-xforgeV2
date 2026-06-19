"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../afenda-ui/button";
import { Separator } from "../../../afenda-ui/separator";
import { SidebarTrigger } from "../../../afenda-ui/sidebar";
import { blockRecipe } from "../../block-recipes";
import {
  dashboardNavTopbarShellClass,
  dashboardNavTopbarTitleClass,
} from "./dashboard-recipes";

const NAV_TOPBAR_HEIGHT = "calc(var(--spacing) * 12)";

export interface NavTopbarProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children" | "title"> {
  readonly showSidebarTrigger?: boolean;
  readonly title?: ReactNode;
  readonly trailing?: ReactNode;
}

export const DEFAULT_NAV_TOPBAR_PROPS = {
  showSidebarTrigger: true,
  title: "Documents",
} as const;

export function NavTopbar({
  className,
  showSidebarTrigger = true,
  title = "Documents",
  trailing,
  ...properties
}: NavTopbarProps) {
  return (
    <header
      className={cn(
        blockRecipe("blockChrome"),
        dashboardNavTopbarShellClass,
        className
      )}
      data-slot="dashboard-nav-topbar"
      {...properties}
    >
      <div className={cn()}>
        {showSidebarTrigger ? <SidebarTrigger className={cn()} /> : null}
        {showSidebarTrigger ? (
          <Separator className={cn()} orientation="vertical" />
        ) : null}
        <h1
          className={cn(
            blockRecipe("blockTitle"),
            dashboardNavTopbarTitleClass
          )}
        >
          {title}
        </h1>
        <div className={cn()}>
          {trailing ?? (
            <Button asChild className={cn()} size="sm" variant="quiet">
              <a
                href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export { NAV_TOPBAR_HEIGHT };
