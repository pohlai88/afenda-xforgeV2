"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { resolveSidebarLinkRenderer } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-link-defaults";
import { SidebarNavGroupPanel } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-nav-group";
import { sidebarIconRailHiddenClass } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import type { SidebarNavGroup } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-types";
import { cn } from "@repo/design-system/lib/utils";
import { GalleryVerticalEndIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, memo, type ReactNode } from "react";
import { NavDocuments } from "../nav/nav-documents";
import { NavMain } from "../nav/nav-main";
import { NavSecondary } from "../nav/nav-secondary";
import { NavStarted } from "../nav/nav-started";
import { NavUser } from "../nav/nav-user";
import {
  DEMO_DASHBOARD_SIDEBAR_BRAND,
  DEMO_DASHBOARD_SIDEBAR_DOCUMENTS,
  DEMO_DASHBOARD_SIDEBAR_MAIN_ITEMS,
  DEMO_DASHBOARD_SIDEBAR_SECONDARY_ITEMS,
  DEMO_DASHBOARD_SIDEBAR_STARTED_ITEMS,
  DEMO_DASHBOARD_SIDEBAR_USER,
} from "./dashboard-sidebar-demo-catalog";
import {
  dashboardSidebarBrandButtonClass,
  dashboardSidebarBrandIconClass,
  dashboardSidebarBrandLabelClass,
} from "./dashboard-sidebar-recipes";
import type {
  AppSidebarProps,
  DashboardSidebarBrand,
} from "./dashboard-sidebar-types";

const DASHBOARD_MAIN_NAV_GROUP_ID = "dashboard-main-navigation";
const DASHBOARD_MAIN_NAV_GROUP_LABEL = "Main navigation";

const DashboardSidebarBrandBlock = memo(function DashboardSidebarBrandBlock({
  brand,
  renderLink,
}: {
  readonly brand: DashboardSidebarBrand;
  readonly renderLink: ReturnType<typeof resolveSidebarLinkRenderer>;
}) {
  const BrandIcon = brand.icon ?? GalleryVerticalEndIcon;

  return (
    <SidebarHeader data-slot="dashboard-sidebar-header">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className={dashboardSidebarBrandButtonClass}
            data-slot="dashboard-sidebar-brand"
          >
            {renderLink({
              className: "",
              href: brand.href,
              children: (
                <>
                  <BrandIcon
                    aria-hidden="true"
                    className={dashboardSidebarBrandIconClass}
                  />
                  <span
                    className={cn(
                      dashboardSidebarBrandLabelClass,
                      sidebarIconRailHiddenClass
                    )}
                  >
                    {brand.label}
                  </span>
                </>
              ),
            })}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
});

function resolveMainNavigationGroup(
  items: AppSidebarProps["mainItems"]
): SidebarNavGroup | null {
  if (!items || items.length === 0) {
    return null;
  }

  return {
    id: DASHBOARD_MAIN_NAV_GROUP_ID,
    label: DASHBOARD_MAIN_NAV_GROUP_LABEL,
    items: items.map((item) => ({
      badge: undefined,
      description: item.description,
      href: item.href,
      icon: item.icon ?? GalleryVerticalEndIcon,
      id: item.id,
      label: item.label,
    })),
  };
}

function renderDefaultContent({
  documents,
  mainInbox,
  mainItems,
  mainQuickCreate,
  renderLink,
  secondaryClassName,
  secondaryItems,
  startedItems,
}: {
  readonly documents: AppSidebarProps["documents"];
  readonly mainInbox: AppSidebarProps["mainInbox"];
  readonly mainItems: AppSidebarProps["mainItems"];
  readonly mainQuickCreate: AppSidebarProps["mainQuickCreate"];
  readonly renderLink: AppSidebarProps["renderLink"];
  readonly secondaryClassName: string | undefined;
  readonly secondaryItems: AppSidebarProps["secondaryItems"];
  readonly startedItems: AppSidebarProps["startedItems"];
}): ReactNode {
  const mainNavigationGroup = resolveMainNavigationGroup(mainItems);

  return (
    <>
      {(mainQuickCreate !== false && mainQuickCreate) ||
      (mainInbox !== false && mainInbox) ? (
        <NavMain
          inbox={mainInbox}
          items={[]}
          quickCreate={mainQuickCreate}
          renderLink={renderLink}
        />
      ) : null}
      {mainNavigationGroup ? (
        <SidebarNavGroupPanel
          activeItemIds={new Set<string>()}
          group={mainNavigationGroup}
          renderLink={renderLink}
        />
      ) : null}
      {startedItems !== false && startedItems && startedItems.length > 0 ? (
        <NavStarted items={startedItems} renderLink={renderLink} />
      ) : null}
      {documents !== false && documents && documents.length > 0 ? (
        <NavDocuments items={documents} renderLink={renderLink} />
      ) : null}
      {secondaryItems !== false &&
      secondaryItems &&
      secondaryItems.length > 0 ? (
        <NavSecondary
          className={secondaryClassName}
          items={secondaryItems}
          renderLink={renderLink}
        />
      ) : null}
    </>
  );
}

export const AppSidebar = memo(function AppSidebar({
  brand = DEMO_DASHBOARD_SIDEBAR_BRAND,
  collapsible = "offcanvas",
  content,
  documents = DEMO_DASHBOARD_SIDEBAR_DOCUMENTS,
  footer,
  header,
  mainInbox,
  mainItems = DEMO_DASHBOARD_SIDEBAR_MAIN_ITEMS,
  mainQuickCreate,
  renderLink,
  secondaryClassName = "mt-auto",
  secondaryItems = DEMO_DASHBOARD_SIDEBAR_SECONDARY_ITEMS,
  startedItems = DEMO_DASHBOARD_SIDEBAR_STARTED_ITEMS,
  user = DEMO_DASHBOARD_SIDEBAR_USER,
  userMenu,
  ...sidebarProps
}: AppSidebarProps &
  Omit<ComponentPropsWithoutRef<typeof Sidebar>, "children">) {
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);
  const showBrand = brand !== false;
  const showUser = user !== false;

  return (
    <Sidebar
      collapsible={collapsible}
      data-slot="app-sidebar"
      {...sidebarProps}
    >
      {header ??
        (showBrand && brand ? (
          <DashboardSidebarBrandBlock brand={brand} renderLink={linkRenderer} />
        ) : null)}
      <SidebarContent data-slot="dashboard-sidebar-content">
        {content ??
          renderDefaultContent({
            documents,
            mainInbox,
            mainItems,
            mainQuickCreate,
            renderLink,
            secondaryClassName,
            secondaryItems,
            startedItems,
          })}
      </SidebarContent>
      {footer ??
        (showUser && user ? (
          <SidebarFooter data-slot="dashboard-sidebar-footer">
            <NavUser
              avatarFallback={user.avatarFallback}
              avatarSrc={user.avatarSrc}
              displayName={user.displayName}
              email={user.email}
              {...userMenu}
            />
          </SidebarFooter>
        ) : null)}
    </Sidebar>
  );
});
