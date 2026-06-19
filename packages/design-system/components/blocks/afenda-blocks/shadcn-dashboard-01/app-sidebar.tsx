"use client";

import {
  DatabaseIcon,
  FileTextIcon,
  GalleryVerticalEndIcon,
  HelpCircleIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../../lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";
import { blockRecipe } from "../../block-recipes";
import {
  dashboardAppSidebarBrandButtonClass,
  dashboardAppSidebarBrandIconClass,
  dashboardAppSidebarBrandLabelClass,
  dashboardAppSidebarContentClass,
  dashboardAppSidebarFooterClass,
  dashboardAppSidebarSecondaryNavClass,
} from "./dashboard-recipes";
import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { sidebarLinkClass } from "./nav-main-recipes";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import type { SidebarLinkRenderer } from "./sidebar-link";

const sidebarDemoData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    { title: "Settings", url: "#", icon: SettingsIcon },
    { title: "Get Help", url: "#", icon: HelpCircleIcon },
    { title: "Search", url: "#", icon: SearchIcon },
  ],
  documents: [
    { name: "Data Library", url: "#", icon: DatabaseIcon },
    { name: "Reports", url: "#", icon: FileTextIcon },
    { name: "Word Assistant", url: "#", icon: FileTextIcon },
  ],
} as const;

export interface AppSidebarProps
  extends Omit<ComponentPropsWithoutRef<typeof Sidebar>, "children"> {
  readonly activeItemIds?: ReadonlySet<string>;
  readonly renderLink?: SidebarLinkRenderer;
}

export function AppSidebar({
  activeItemIds,
  className,
  renderLink,
  variant: _variant,
  ...properties
}: AppSidebarProps) {
  return (
    <Sidebar
      className={cn(className)}
      collapsible="offcanvas"
      data-slot="app-sidebar"
      variant="inset"
      {...properties}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(dashboardAppSidebarBrandButtonClass)}
            >
              <a className={cn(sidebarLinkClass)} href="/dashboard">
                <GalleryVerticalEndIcon
                  className={cn(dashboardAppSidebarBrandIconClass)}
                />
                <span className={cn(dashboardAppSidebarBrandLabelClass)}>
                  Acme Inc.
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
        className={cn(
          blockRecipe("blockStack"),
          dashboardAppSidebarContentClass
        )}
      >
        <NavMain activeItemIds={activeItemIds} renderLink={renderLink} />
        <NavDocuments items={[...sidebarDemoData.documents]} />
        <NavSecondary
          className={cn(dashboardAppSidebarSecondaryNavClass)}
          items={[...sidebarDemoData.navSecondary]}
        />
      </SidebarContent>
      <SidebarFooter
        className={cn(
          blockRecipe("blockPanel"),
          dashboardAppSidebarFooterClass
        )}
      >
        <NavUser user={sidebarDemoData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
