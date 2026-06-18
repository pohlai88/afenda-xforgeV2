"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../afenda-ui/avatar";
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
import { cn } from "../../../../lib/utils";
import {
  dashboardNavUserAvatarClass,
  dashboardNavUserAvatarFallbackClass,
  dashboardNavUserEmailClass,
  dashboardNavUserIdentityClass,
  dashboardNavUserMenuContentClass,
  dashboardNavUserMenuIconClass,
  dashboardNavUserMenuIdentityRowClass,
  dashboardNavUserMenuLabelClass,
  dashboardNavUserNameClass,
  dashboardNavUserTriggerClass,
} from "./dashboard-recipes";
import {
  BellIcon,
  CircleUserIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
} from "lucide-react";

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
      className={cn(blockRecipe("blockSection"))}
      data-slot="nav-user"
    >
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(dashboardNavUserTriggerClass)}
              data-slot="nav-user-trigger"
            >
              <Avatar className={cn(dashboardNavUserAvatarClass)}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={cn(dashboardNavUserAvatarFallbackClass)}>
                  CN
                </AvatarFallback>
              </Avatar>
              <div className={cn(dashboardNavUserIdentityClass)}>
                <span className={cn(dashboardNavUserNameClass)}>{user.name}</span>
                <span className={cn(dashboardNavUserEmailClass)}>{user.email}</span>
              </div>
              <EllipsisVerticalIcon className={cn(dashboardNavUserMenuIconClass)} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn(dashboardNavUserMenuContentClass)}
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            data-slot="nav-user-menu"
          >
            <DropdownMenuLabel className={cn(dashboardNavUserMenuLabelClass)}>
              <div
                className={cn(dashboardNavUserMenuIdentityRowClass)}
                data-slot="nav-user-content"
              >
                <Avatar className={cn(dashboardNavUserAvatarClass)}>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback
                    className={cn(dashboardNavUserAvatarFallbackClass)}
                  >
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className={cn(dashboardNavUserIdentityClass)}>
                  <span className={cn(dashboardNavUserNameClass)}>{user.name}</span>
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
