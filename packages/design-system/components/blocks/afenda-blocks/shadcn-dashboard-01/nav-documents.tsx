"use client";

import {
  EllipsisIcon,
  FolderIcon,
  type LucideIcon,
  Share2Icon,
  TrashIcon,
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../afenda-ui/dropdown-menu";
import { recipe } from "../../../afenda-ui/recipes";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../../afenda-ui/sidebar";
import { blockRecipe } from "../../block-recipes";
import {
  dashboardNavDocumentsActionClass,
  dashboardNavDocumentsGroupClass,
  dashboardNavDocumentsMenuClass,
  dashboardNavDocumentsMoreButtonClass,
  dashboardNavDocumentsMoreIconClass,
} from "./dashboard-recipes";
import {
  navItemBaseClass,
  navItemIconClass,
  navItemIdleClass,
  navItemLabelClass,
} from "./nav-main-recipes";

export function NavDocuments({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup
      className={cn(dashboardNavDocumentsGroupClass)}
      data-slot="nav-documents"
    >
      <SidebarGroupLabel className={cn(blockRecipe("blockMetricLabel"))}>
        Documents
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={cn(navItemBaseClass, navItemIdleClass)}
            >
              <a href={item.url}>
                <item.icon className={cn(navItemIconClass)} />
                <span className={cn(navItemLabelClass)}>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  className={cn(dashboardNavDocumentsActionClass)}
                  showOnHover
                >
                  <EllipsisIcon />
                  <span className={cn(recipe("visuallyHidden"))}>More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isMobile ? "end" : "start"}
                className={cn(dashboardNavDocumentsMenuClass)}
                data-slot="nav-documents-more"
                side={isMobile ? "bottom" : "right"}
              >
                <DropdownMenuItem>
                  <FolderIcon />
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2Icon />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="critical">
                  <TrashIcon />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            className={cn(
              navItemBaseClass,
              navItemIdleClass,
              dashboardNavDocumentsMoreButtonClass
            )}
          >
            <EllipsisIcon className={cn(dashboardNavDocumentsMoreIconClass)} />
            <span className={cn(navItemLabelClass)}>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
