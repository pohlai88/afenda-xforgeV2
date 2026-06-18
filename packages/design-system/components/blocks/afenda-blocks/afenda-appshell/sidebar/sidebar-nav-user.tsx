"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../afenda-ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../afenda-ui/dropdown-menu";
import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import {
  appSidebarFooterUserAvatarClass,
  appSidebarFooterUserAvatarFallbackClass,
  appSidebarFooterUserEmailClass,
  appSidebarFooterUserIdentityClass,
  appSidebarFooterUserMenuContentClass,
  appSidebarFooterUserMenuIconClass,
  appSidebarFooterUserMenuIdentityRowClass,
  appSidebarFooterUserNameClass,
  appSidebarFooterUserShellClass,
  appSidebarFooterUserTriggerClass,
} from "./sidebar-nav-recipes";
import {
  appSidebarIconRailHiddenClass,
  appSidebarIconRailUserAvatarClass,
  appSidebarIconRailUserTriggerClass,
} from "./sidebar-icon-rail-recipes";
import {
  BellIcon,
  CircleUserIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
} from "lucide-react";

import type { AfendaAppShellUserSummary } from "../app-shell-types";

export interface SidebarNavUserProps {
  readonly isIconRail?: boolean;
  readonly user: AfendaAppShellUserSummary;
}

function resolveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "U";
  }

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function SidebarNavUser({
  isIconRail = false,
  user,
}: SidebarNavUserProps) {
  const initials = resolveInitials(user.name);

  return (
    <div className={cn(appSidebarFooterUserShellClass)} data-slot="nav-user">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              appSidebarFooterUserTriggerClass,
              isIconRail && appSidebarIconRailUserTriggerClass
            )}
            data-slot="nav-user-trigger"
            type="button"
          >
            <Avatar
              className={cn(
                appSidebarFooterUserAvatarClass,
                isIconRail && appSidebarIconRailUserAvatarClass
              )}
            >
              <AvatarImage alt={user.name} src={user.avatar} />
              <AvatarFallback
                className={cn(appSidebarFooterUserAvatarFallbackClass)}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                appSidebarFooterUserIdentityClass,
                isIconRail && appSidebarIconRailHiddenClass
              )}
            >
              <span className={cn(appSidebarFooterUserNameClass)}>{user.name}</span>
              <span className={cn(appSidebarFooterUserEmailClass)}>{user.email}</span>
            </div>
            <EllipsisVerticalIcon
              aria-hidden="true"
              className={cn(
                appSidebarFooterUserMenuIconClass,
                isIconRail && appSidebarIconRailHiddenClass
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn(appSidebarFooterUserMenuContentClass)}
          data-slot="nav-user-menu"
          side="right"
          sideOffset={8}
        >
          <DropdownMenuLabel className={cn(blockRecipe("blockMetricLabel"), "p-0 font-normal")}>
            <div
              className={cn(appSidebarFooterUserMenuIdentityRowClass)}
              data-slot="nav-user-content"
            >
              <Avatar className={cn(appSidebarFooterUserAvatarClass)}>
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback
                  className={cn(appSidebarFooterUserAvatarFallbackClass)}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className={cn(appSidebarFooterUserIdentityClass)}>
                <span className={cn(appSidebarFooterUserNameClass)}>{user.name}</span>
                <span className={cn(appSidebarFooterUserEmailClass)}>{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <CircleUserIcon />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellIcon />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
