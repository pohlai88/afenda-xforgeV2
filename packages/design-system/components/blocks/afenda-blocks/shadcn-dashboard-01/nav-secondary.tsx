"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";
import { blockRecipe } from "../../block-recipes";
import { cn } from "../../../../lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import { type LucideIcon } from "lucide-react";

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
      <SidebarGroupContent className={cn(blockRecipe("blockSection"))}>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
