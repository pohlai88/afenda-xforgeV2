"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/design-system/components/afenda-ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/afenda-ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { SIDEBAR_DEFAULT_PROFILE_DESCRIPTION } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-constants";
import {
  sidebarAvatarFallbackClass,
  sidebarFooterButtonClass,
  sidebarIconRailAvatarClass,
  sidebarIconRailHiddenClass,
  sidebarProfileInitials,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { cn } from "@repo/design-system/lib/utils";
import {
  BellIcon,
  CircleUserIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
} from "lucide-react";
import { memo } from "react";
import { NAV_USER_DEFAULT_MENU_LABEL } from "./dashboard-nav-constants";
import type { NavUserMenuItem, NavUserProps } from "./dashboard-nav-types";

const DEFAULT_NAV_USER_MENU_ITEMS: readonly NavUserMenuItem[] = [
  { id: "account", icon: CircleUserIcon, label: "Account" },
  { id: "billing", icon: CreditCardIcon, label: "Billing" },
  {
    id: "notifications",
    icon: BellIcon,
    label: "Notifications",
  },
  {
    id: "logout",
    icon: LogOutIcon,
    label: "Log out",
    separatorBefore: true,
  },
];

const navUserDropdownMenuItemClass = "gap-2 text-[12px]";

const NavUserIdentity = memo(function NavUserIdentity({
  avatarClassName,
  avatarSrc,
  displayName,
  email,
  initials,
  textHiddenClassName,
}: {
  readonly avatarClassName: string;
  readonly avatarSrc?: string;
  readonly displayName: string;
  readonly email?: string | null;
  readonly initials: string;
  readonly textHiddenClassName?: string;
}) {
  return (
    <>
      <Avatar className={avatarClassName}>
        {avatarSrc ? <AvatarImage alt="" src={avatarSrc} /> : null}
        <AvatarFallback className={sidebarAvatarFallbackClass}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "grid min-w-0 flex-1 text-left leading-tight",
          textHiddenClassName
        )}
      >
        <span className="truncate font-medium text-[12px] text-sidebar-foreground">
          {displayName}
        </span>
        {email ? (
          <span className="truncate text-[11px] text-text-tertiary">{email}</span>
        ) : null}
      </div>
    </>
  );
});

function NavUserMenuItems({
  items,
}: {
  readonly items: readonly NavUserMenuItem[];
}) {
  const primaryItems = items.filter((item) => !item.separatorBefore);
  const trailingItems = items.filter((item) => item.separatorBefore);

  return (
    <>
      {primaryItems.length > 0 ? (
        <DropdownMenuGroup>
          {primaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <DropdownMenuItem
                className={navUserDropdownMenuItemClass}
                key={item.id}
                onSelect={() => {
                  item.onSelect?.();
                }}
              >
                {Icon ? (
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                ) : null}
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      ) : null}
      {trailingItems.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.id}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={navUserDropdownMenuItemClass}
              onSelect={() => {
                item.onSelect?.();
              }}
            >
              {Icon ? (
                <Icon aria-hidden="true" className="size-4 shrink-0" />
              ) : null}
              {item.label}
            </DropdownMenuItem>
          </div>
        );
      })}
    </>
  );
}

export const NavUser = memo(function NavUser({
  avatarFallback,
  avatarSrc,
  children,
  className,
  displayName,
  email,
  menuItems = DEFAULT_NAV_USER_MENU_ITEMS,
  menuLabel = NAV_USER_DEFAULT_MENU_LABEL,
  profileDescription = SIDEBAR_DEFAULT_PROFILE_DESCRIPTION,
}: NavUserProps) {
  const { isMobile } = useSidebar();
  const initials = avatarFallback ?? sidebarProfileInitials(displayName);

  return (
    <SidebarMenu className={className} data-slot="nav-user-menu">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              aria-label={menuLabel}
              className={cn(
                sidebarFooterButtonClass,
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              )}
              data-slot="nav-user-trigger"
              size="lg"
              tooltip={{
                description: profileDescription,
                label: displayName,
              }}
            >
              <NavUserIdentity
                avatarClassName={sidebarIconRailAvatarClass}
                avatarSrc={avatarSrc}
                displayName={displayName}
                email={email}
                initials={initials}
                textHiddenClassName={sidebarIconRailHiddenClass}
              />
              <EllipsisVerticalIcon
                aria-hidden="true"
                className={cn("ml-auto size-4 shrink-0", sidebarIconRailHiddenClass)}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-56 rounded-lg"
            data-slot="nav-user-content"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left">
                <NavUserIdentity
                  avatarClassName="size-8 rounded-lg"
                  avatarSrc={avatarSrc}
                  displayName={displayName}
                  email={email}
                  initials={initials}
                />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {children ?? <NavUserMenuItems items={menuItems} />}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});
