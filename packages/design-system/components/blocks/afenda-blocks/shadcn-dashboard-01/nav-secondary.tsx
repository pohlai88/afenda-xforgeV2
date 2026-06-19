"use client";

import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../../lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";
import { blockRecipe } from "../../block-recipes";
import { dashboardNavSecondaryContentClass } from "./dashboard-recipes";
import {
  navItemBaseClass,
  navItemIconClass,
  navItemIdleClass,
  navItemLabelClass,
} from "./nav-main-recipes";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup data-slot="nav-secondary" {...props}>
      <SidebarGroupContent
        className={cn(
          blockRecipe("blockStack"),
          dashboardNavSecondaryContentClass
        )}
      >
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(navItemBaseClass, navItemIdleClass)}
              >
                <a href={item.url}>
                  <item.icon className={cn(navItemIconClass)} />
                  <span className={cn(navItemLabelClass)}>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
