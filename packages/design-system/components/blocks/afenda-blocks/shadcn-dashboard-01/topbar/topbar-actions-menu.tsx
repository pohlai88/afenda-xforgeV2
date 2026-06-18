"use client";

import { Button } from "../../../../afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../../../afenda-ui/dropdown-menu";
import { Kbd } from "../../../../afenda-ui/kbd";
import {
  TOPBAR_DEFAULT_ACTIONS_MENU_BUTTON_LABEL,
  TOPBAR_DEFAULT_ACTIONS_MENU_DESCRIPTION,
  TOPBAR_DEFAULT_ACTIONS_MENU_LABEL,
} from "./topbar-constants";
import { topbarIconActionClass } from "./topbar-recipes";
import { cn } from "../../../../../lib/utils";
import { MoreHorizontalIcon } from "lucide-react";
import { TopbarTooltip } from "./topbar-tooltip";
import type { TopbarActionsMenuProps } from "./topbar-types";

export function TopbarActionsMenu({
  actions,
  className,
  description = TOPBAR_DEFAULT_ACTIONS_MENU_DESCRIPTION,
  label = TOPBAR_DEFAULT_ACTIONS_MENU_LABEL,
  menuLabel = TOPBAR_DEFAULT_ACTIONS_MENU_BUTTON_LABEL,
}: TopbarActionsMenuProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <TopbarTooltip description={description} label={label}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={menuLabel}
            className={cn(topbarIconActionClass, className)}
            data-slot="app-topbar-actions-trigger"
            size="icon-sm"
            type="button"
            variant="quiet"
          >
            <MoreHorizontalIcon aria-hidden="true" className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </TopbarTooltip>
      <DropdownMenuContent
        align="end"
        className="min-w-52"
        data-slot="app-topbar-actions-content"
      >
        <DropdownMenuLabel className="px-2 py-1.5 font-medium text-[11px] text-text-secondary uppercase tracking-[0.08em]">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => (
          <div key={action.id}>
            {action.separatorBefore ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              className="gap-2 text-[12px]"
              disabled={action.disabled}
              onSelect={() => {
                action.onSelect?.();
              }}
            >
              {action.icon ? (
                <span className="grid size-4 shrink-0 place-items-center">
                  {action.icon}
                </span>
              ) : null}
              <span className="min-w-0 flex-1 truncate">{action.label}</span>
              {action.shortcut ? (
                <DropdownMenuShortcut>
                  <Kbd className="h-4 border-border-default bg-surface-muted/60 px-1 font-mono text-[9px] tabular-nums">
                    {action.shortcut}
                  </Kbd>
                </DropdownMenuShortcut>
              ) : null}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
