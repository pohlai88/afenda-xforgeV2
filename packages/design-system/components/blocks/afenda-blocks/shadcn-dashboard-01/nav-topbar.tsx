"use client";

import { Button } from "../../../afenda-ui/button";
import { Separator } from "../../../afenda-ui/separator";
import { SidebarTrigger } from "../../../afenda-ui/sidebar";
import { cn } from "../../../../lib/utils";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

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
        "flex h-(--header-height, var(--dashboard-nav-topbar-height, calc(var(--spacing) * 12))) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
        className
      )}
      data-slot="nav-topbar"
      {...properties}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {showSidebarTrigger ? <SidebarTrigger className="-ml-1" /> : null}
        {showSidebarTrigger ? (
          <Separator
            className="mx-2 data-[orientation=vertical]:h-4"
            orientation="vertical"
          />
        ) : null}
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {trailing ?? (
            <Button
              asChild
              className="hidden sm:flex dark:text-foreground"
              size="sm"
              variant="quiet"
            >
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
