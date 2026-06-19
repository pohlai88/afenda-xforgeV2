"use client";

import { EllipsisVerticalIcon } from "lucide-react";
import { cn } from "../../../../../lib/utils";
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
import {
  resolveSidebarLinkRenderer,
  type SidebarLinkRenderer,
} from "./sidebar-link";
import type { AfendaAppShellUserSummary } from "../app-shell-types";
import {
  appSidebarIconRailHiddenClass,
  appSidebarIconRailUserAvatarClass,
  appSidebarIconRailUserTriggerClass,
} from "./sidebar-icon-rail-recipes";
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
import type {
  SidebarNavUserMenuGroup as SidebarNavUserMenuGroupValue,
  SidebarNavUserMenuItem as SidebarNavUserMenuItemValue,
} from "./sidebar-nav-user-menu.types";

export type {
  SidebarNavUserMenuGroup,
  SidebarNavUserMenuItem,
} from "./sidebar-nav-user-menu.types";

export interface SidebarNavUserProps {
  readonly isIconRail?: boolean;
  readonly menuGroups?: readonly SidebarNavUserMenuGroupValue[];
  readonly onMenuItemSelect?: (item: SidebarNavUserMenuItemValue) => void;
  readonly renderMenuLink?: SidebarLinkRenderer;
  readonly user: AfendaAppShellUserSummary;
}

const WHITESPACE_PATTERN = /\s+/;

function resolveInitials(name: string): string {
  const parts = name.trim().split(WHITESPACE_PATTERN).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "U";
  }

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

function SidebarNavUserMenu({
  menuGroups,
  onMenuItemSelect,
  renderMenuLink,
}: {
  readonly menuGroups: readonly SidebarNavUserMenuGroupValue[];
  readonly onMenuItemSelect?: (item: SidebarNavUserMenuItemValue) => void;
  readonly renderMenuLink?: SidebarLinkRenderer;
}) {
  const linkRenderer = resolveSidebarLinkRenderer(renderMenuLink);
  const visibleGroups = menuGroups.filter((group) => group.items.length > 0);

  if (visibleGroups.length === 0) {
    return null;
  }

  return (
    <>
      <DropdownMenuSeparator />
      {visibleGroups.map((group, groupIndex) => (
        <DropdownMenuGroup key={group.key}>
          {groupIndex > 0 ? <DropdownMenuSeparator /> : null}
          {group.items.map((item) => {
            if (item.href) {
              return (
                <DropdownMenuItem asChild key={item.id}>
                  {linkRenderer({
                    className: "w-full cursor-pointer",
                    href: item.href,
                    children: item.label,
                  })}
                </DropdownMenuItem>
              );
            }

            if (item.destructive) {
              return (
                <DropdownMenuItem
                  key={item.id}
                  onSelect={() => {
                    onMenuItemSelect?.(item);
                  }}
                  variant="critical"
                >
                  {item.label}
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => {
                  onMenuItemSelect?.(item);
                }}
                variant="default"
              >
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      ))}
    </>
  );
}

export function SidebarNavUser({
  isIconRail = false,
  menuGroups = [],
  onMenuItemSelect,
  renderMenuLink,
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
              <span className={cn(appSidebarFooterUserNameClass)}>
                {user.name}
              </span>
              <span className={cn(appSidebarFooterUserEmailClass)}>
                {user.email}
              </span>
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
          <DropdownMenuLabel
            className={cn(blockRecipe("blockMetricLabel"), "p-0 font-normal")}
          >
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
                <span className={cn(appSidebarFooterUserNameClass)}>
                  {user.name}
                </span>
                <span className={cn(appSidebarFooterUserEmailClass)}>
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <SidebarNavUserMenu
            menuGroups={menuGroups}
            onMenuItemSelect={onMenuItemSelect}
            renderMenuLink={renderMenuLink}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
