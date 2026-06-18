"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../afenda-ui/dropdown-menu";
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
import { recipe } from "../../../afenda-ui/recipes";
import { cn } from "../../../../lib/utils";
import {
  dashboardNavDocumentsActionClass,
  dashboardNavDocumentsGroupClass,
  dashboardNavDocumentsMenuClass,
  dashboardNavDocumentsMoreButtonClass,
  dashboardNavDocumentsMoreIconClass,
} from "./dashboard-recipes";
import {
  EllipsisIcon,
  FolderIcon,
  Share2Icon,
  TrashIcon,
  type LucideIcon,
} from "lucide-react";

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
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className={cn(dashboardNavDocumentsActionClass)}
                >
                  <EllipsisIcon />
                  <span className={cn(recipe("visuallyHidden"))}>More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={cn(dashboardNavDocumentsMenuClass)}
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
                data-slot="nav-documents-more"
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
          <SidebarMenuButton className={cn(dashboardNavDocumentsMoreButtonClass)}>
            <EllipsisIcon className={cn(dashboardNavDocumentsMoreIconClass)} />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
