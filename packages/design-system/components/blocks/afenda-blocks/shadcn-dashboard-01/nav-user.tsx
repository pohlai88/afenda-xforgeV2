"use client";

import {
  BellIcon,
  CircleUserIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../../afenda-ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../afenda-ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../../afenda-ui/sidebar";
import { blockRecipe } from "../../block-recipes";
import {
  dashboardNavUserAvatarClass,
  dashboardNavUserAvatarFallbackClass,
  dashboardNavUserEmailClass,
  dashboardNavUserIdentityClass,
  dashboardNavUserMenuClass,
  dashboardNavUserMenuContentClass,
  dashboardNavUserMenuIconClass,
  dashboardNavUserMenuIdentityRowClass,
  dashboardNavUserMenuLabelClass,
  dashboardNavUserNameClass,
  dashboardNavUserTriggerClass,
} from "./dashboard-recipes";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu
      className={cn(blockRecipe("blockSection"), dashboardNavUserMenuClass)}
      data-slot="nav-user"
    >
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className={cn(dashboardNavUserTriggerClass)}
              data-slot="nav-user-trigger"
              size="lg"
            >
              <Avatar className={cn(dashboardNavUserAvatarClass)}>
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback
                  className={cn(dashboardNavUserAvatarFallbackClass)}
                >
                  CN
                </AvatarFallback>
              </Avatar>
              <div className={cn(dashboardNavUserIdentityClass)}>
                <span className={cn(dashboardNavUserNameClass)}>
                  {user.name}
                </span>
                <span className={cn(dashboardNavUserEmailClass)}>
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon
                className={cn(dashboardNavUserMenuIconClass)}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(dashboardNavUserMenuContentClass)}
            data-slot="nav-user-menu"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className={cn(dashboardNavUserMenuLabelClass)}>
              <div
                className={cn(dashboardNavUserMenuIdentityRowClass)}
                data-slot="nav-user-content"
              >
                <Avatar className={cn(dashboardNavUserAvatarClass)}>
                  <AvatarImage alt={user.name} src={user.avatar} />
                  <AvatarFallback
                    className={cn(dashboardNavUserAvatarFallbackClass)}
                  >
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className={cn(dashboardNavUserIdentityClass)}>
                  <span className={cn(dashboardNavUserNameClass)}>
                    {user.name}
                  </span>
                  <span className={cn(dashboardNavUserEmailClass)}>
                    {user.email}
                  </span>
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
                <CreditCardIcon />
                Billing
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
