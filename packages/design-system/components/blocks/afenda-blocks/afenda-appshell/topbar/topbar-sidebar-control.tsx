"use client";

import { PanelLeftIcon } from "lucide-react";
import { cn } from "../../../../../lib/utils";
import { Button } from "../../../../afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../afenda-ui/dropdown-menu";
import { recipe } from "../../../../afenda-ui/recipes";
import { SIDEBAR_BEHAVIOR_OPTIONS } from "../../../../afenda-ui/sidebar-behavior";
import { blockRecipe } from "../../../block-recipes";
import { useAppShellSidebar } from "../app-shell-sidebar-context";
import { topbarSidebarTriggerClass } from "./topbar-recipes";

export function TopbarSidebarControl({
  className,
  menuLabel = "Sidebar control",
  triggerLabel = "Open sidebar control",
  ...properties
}: React.ComponentPropsWithoutRef<typeof Button> & {
  readonly menuLabel?: string;
  readonly triggerLabel?: string;
}) {
  const { behaviorMode, setBehaviorMode } = useAppShellSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={triggerLabel}
          className={cn(
            blockRecipe("blockShell"),
            topbarSidebarTriggerClass,
            className
          )}
          data-slot="app-topbar-sidebar-trigger"
          size="icon-sm"
          type="button"
          variant="quiet"
          {...properties}
        >
          <PanelLeftIcon
            aria-hidden="true"
            className={cn(recipe("sidebarControlIcon"))}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-48"
        data-slot="sidebar-control-menu"
        side="bottom"
      >
        <DropdownMenuLabel className={cn(recipe("sidebarControlMenuLabel"))}>
          {menuLabel}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SIDEBAR_BEHAVIOR_OPTIONS.map((option) => (
          <DropdownMenuItem
            className={cn(recipe("sidebarControlMenuItem"))}
            key={option.id}
            onSelect={() => {
              setBehaviorMode(option.id);
            }}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 shrink-0 rounded-full bg-current transition-opacity",
                behaviorMode === option.id ? "opacity-100" : "opacity-0"
              )}
            />
            <span className="min-w-0 flex-1">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
