"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/design-system/components/afenda-ui/avatar";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/design-system/components/afenda-ui/dropdown-menu";
import { cn } from "@repo/design-system/lib/utils";
import {
  TOPBAR_DEFAULT_USER_MENU_BUTTON_LABEL,
  TOPBAR_DEFAULT_USER_MENU_DESCRIPTION,
  TOPBAR_DEFAULT_USER_MENU_TOOLTIP,
} from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import { TopbarTooltip } from "./topbar-tooltip";
import type { TopbarUserMenuProps } from "./topbar-types";

export function TopbarUserMenu({
  avatarFallback,
  avatarSrc,
  children,
  className,
  description = TOPBAR_DEFAULT_USER_MENU_DESCRIPTION,
  displayName,
  email,
  menuLabel = TOPBAR_DEFAULT_USER_MENU_BUTTON_LABEL,
  tooltip = TOPBAR_DEFAULT_USER_MENU_TOOLTIP,
}: TopbarUserMenuProps) {
  return (
    <DropdownMenu>
      <TopbarTooltip description={description} label={tooltip}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={menuLabel}
            className={cn(
              "size-8 rounded-full p-0 hover:bg-sidebar-accent focus-visible:ring-sidebar-ring",
              className
            )}
            data-slot="app-topbar-user-menu-trigger"
            type="button"
            variant="quiet"
          >
            <Avatar className="size-7">
              {avatarSrc ? <AvatarImage alt="" src={avatarSrc} /> : null}
              <AvatarFallback className="bg-sidebar-accent text-[11px] text-sidebar-foreground">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
      </TopbarTooltip>
      <DropdownMenuContent
        align="end"
        className="min-w-56"
        data-slot="app-topbar-user-menu-content"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left">
            <Avatar className="size-8 rounded-lg">
              {avatarSrc ? <AvatarImage alt="" src={avatarSrc} /> : null}
              <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium text-[12px]">
                {displayName}
              </span>
              {email ? (
                <span className="truncate text-[11px] text-text-tertiary">
                  {email}
                </span>
              ) : null}
            </div>
          </div>
        </DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
