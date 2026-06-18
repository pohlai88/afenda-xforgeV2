"use client";

import {
  DatabaseIcon,
  FileTextIcon,
  GalleryVerticalEndIcon,
  HelpCircleIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { type ComponentPropsWithoutRef } from "react";
import { blockRecipe } from "../../block-recipes";
import { cn } from "../../../../lib/utils";
import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  dashboardAppSidebarBrandButtonClass,
  dashboardAppSidebarBrandIconClass,
  dashboardAppSidebarBrandLabelClass,
} from "./dashboard-recipes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: FileTextIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileTextIcon,
    },
  ],
};

export function AppSidebar({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Sidebar>) {
  return (
    <Sidebar
      className={cn(blockRecipe("blockShell"), className)}
      collapsible="offcanvas"
      data-slot="app-sidebar"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn()}
            >
              <a href="#">
                <GalleryVerticalEndIcon
                  className={cn()}
                />
                <span className={cn()}>
                  Acme Inc.
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavDocuments items={data.documents} />
        <NavSecondary className="mt-auto" items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
