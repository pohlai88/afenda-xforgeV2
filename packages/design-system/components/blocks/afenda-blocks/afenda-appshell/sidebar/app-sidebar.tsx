"use client";

import { useCallback, type ReactNode } from "react";
import { ScrollArea } from "../../../../afenda-ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../afenda-ui/tooltip";
import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { useAppShellSidebar } from "../app-shell-sidebar-context";
import type { AfendaAppSidebarProps } from "../app-shell-types";
import {
  resolveSidebarLinkRenderer,
  type SidebarLinkRenderer,
} from "../../shadcn-dashboard-01/sidebar-link";
import type { AppSidebarNavItem } from "./sidebar-nav-catalog";
import {
  APP_SIDEBAR_DEMO_USER,
  APP_SIDEBAR_ERP_NAV_ITEMS,
  APP_SIDEBAR_ERP_NAV_LABEL,
  APP_SIDEBAR_MAIN_NAV_ITEMS,
  APP_SIDEBAR_MAIN_NAV_LABEL,
  APP_SIDEBAR_PORTAL_NAV_ITEMS,
  APP_SIDEBAR_PORTAL_NAV_LABEL,
  APP_SIDEBAR_SETTINGS_NAV_ITEMS,
  APP_SIDEBAR_SETTINGS_NAV_LABEL,
} from "./sidebar-nav-catalog";
import {
  appSidebarIconRailFooterClass,
  appSidebarIconRailGroupLabelClass,
  appSidebarIconRailItemLabelClass,
  appSidebarIconRailNavGroupClass,
  appSidebarIconRailNavIconClass,
  appSidebarIconRailNavItemClass,
  appSidebarIconRailScrollAreaClass,
  appSidebarIconRailShellClass,
} from "./sidebar-icon-rail-recipes";
import {
  appSidebarFooterClass,
  appSidebarFooterSettingsClass,
  appSidebarMainNavShellClass,
  appSidebarNavItemsClass,
  appSidebarNavProductIconClass,
  appSidebarScrollAreaClass,
  appSidebarScrollContentClass,
  navGroupLabelClass,
  navGroupShellClass,
  navItemBaseClass,
  navItemIconClass,
  navItemIdleClass,
  navItemLabelClass,
  navItemSelectedClass,
  sidebarLinkClass,
} from "./sidebar-nav-recipes";
import { SidebarNavUser } from "./sidebar-nav-user";
import { resolveActiveSidebarNavItemIds } from "./sidebar-nav-utils";
import { appSidebarShellClass } from "./sidebar-recipes";

type AppSidebarNavGroupSlot =
  | "app-sidebar-erp-nav"
  | "app-sidebar-main-nav"
  | "app-sidebar-portal-nav"
  | "app-sidebar-settings-nav";

function wrapIconRailTooltip(
  isIconRail: boolean,
  label: string,
  node: ReactNode
): ReactNode {
  if (!isIconRail) {
    return node;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{node}</TooltipTrigger>
      <TooltipContent align="center" side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function AppSidebarNavGroup({
  activeItemIds,
  className,
  groupSlot,
  isIconRail,
  items,
  label,
  renderLink,
}: {
  readonly activeItemIds: ReadonlySet<string>;
  readonly className?: string;
  readonly groupSlot: AppSidebarNavGroupSlot;
  readonly isIconRail: boolean;
  readonly items: readonly AppSidebarNavItem[];
  readonly label: string;
  readonly renderLink?: SidebarLinkRenderer;
}) {
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        navGroupShellClass,
        isIconRail && appSidebarIconRailNavGroupClass,
        className
      )}
      data-slot={groupSlot}
    >
      <h2
        className={cn(
          blockRecipe("blockMetricLabel"),
          navGroupLabelClass,
          isIconRail && appSidebarIconRailGroupLabelClass
        )}
      >
        {label}
      </h2>
      <ul
        className={cn(appSidebarNavItemsClass)}
        data-slot="app-sidebar-nav-items"
      >
        {items.map((item) => {
          const selected = activeItemIds.has(item.id);

          const link = linkRenderer({
            "aria-current": selected ? "page" : undefined,
            className: cn(
              navItemBaseClass,
              sidebarLinkClass,
              isIconRail && appSidebarIconRailNavItemClass,
              selected ? navItemSelectedClass : navItemIdleClass
            ),
            href: item.href,
            children: (
              <>
                {item.kind === "product" ? (
                  <img
                    alt=""
                    className={cn(appSidebarNavProductIconClass)}
                    height={16}
                    src={item.iconSrc}
                    width={16}
                  />
                ) : (
                  <item.icon
                    aria-hidden="true"
                    className={cn(navItemIconClass, appSidebarIconRailNavIconClass)}
                  />
                )}
                <span
                  className={cn(
                    navItemLabelClass,
                    isIconRail && appSidebarIconRailItemLabelClass
                  )}
                >
                  {item.label}
                </span>
              </>
            ),
          });

          return (
            <li key={item.id}>
              {wrapIconRailTooltip(isIconRail, item.label, link)}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AfendaAppSidebar({
  activeItemIds,
  children,
  className,
  pathname = "",
  renderLink,
  user = APP_SIDEBAR_DEMO_USER,
  ...properties
}: AfendaAppSidebarProps) {
  const { behaviorMode, isExpanded, setHoverPeek } = useAppShellSidebar();
  const isIconRail = !isExpanded;

  const handlePointerEnter = useCallback(() => {
    if (behaviorMode === "hover") {
      setHoverPeek(true);
    }
  }, [behaviorMode, setHoverPeek]);

  const handlePointerLeave = useCallback(() => {
    if (behaviorMode === "hover") {
      setHoverPeek(false);
    }
  }, [behaviorMode, setHoverPeek]);

  const resolvedActiveItemIds =
    activeItemIds ??
    resolveActiveSidebarNavItemIds(pathname, [
      APP_SIDEBAR_MAIN_NAV_ITEMS,
      APP_SIDEBAR_ERP_NAV_ITEMS,
      APP_SIDEBAR_PORTAL_NAV_ITEMS,
      APP_SIDEBAR_SETTINGS_NAV_ITEMS,
    ]);

  return (
    <aside
      className={cn(
        blockRecipe("blockShell"),
        appSidebarShellClass,
        appSidebarIconRailShellClass,
        className
      )}
      data-collapsible={isIconRail ? "icon" : undefined}
      data-sidebar-presentation={isIconRail ? "icon-rail" : "expanded"}
      data-slot="app-sidebar"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...properties}
    >
      {children ?? (
        <TooltipProvider delayDuration={0}>
          <div
            className={cn(appSidebarMainNavShellClass)}
            data-slot="app-sidebar-main-nav-shell"
          >
            <AppSidebarNavGroup
              activeItemIds={resolvedActiveItemIds}
              groupSlot="app-sidebar-main-nav"
              isIconRail={isIconRail}
              items={APP_SIDEBAR_MAIN_NAV_ITEMS}
              label={APP_SIDEBAR_MAIN_NAV_LABEL}
              renderLink={renderLink}
            />
          </div>
          <ScrollArea
            className={cn(
              appSidebarScrollAreaClass,
              isIconRail && appSidebarIconRailScrollAreaClass
            )}
            data-slot="app-sidebar-scroll"
          >
            <div className={cn(appSidebarScrollContentClass)}>
              <AppSidebarNavGroup
                activeItemIds={resolvedActiveItemIds}
                groupSlot="app-sidebar-erp-nav"
                isIconRail={isIconRail}
                items={APP_SIDEBAR_ERP_NAV_ITEMS}
                label={APP_SIDEBAR_ERP_NAV_LABEL}
                renderLink={renderLink}
              />
              <AppSidebarNavGroup
                activeItemIds={resolvedActiveItemIds}
                groupSlot="app-sidebar-portal-nav"
                isIconRail={isIconRail}
                items={APP_SIDEBAR_PORTAL_NAV_ITEMS}
                label={APP_SIDEBAR_PORTAL_NAV_LABEL}
                renderLink={renderLink}
              />
            </div>
          </ScrollArea>
          <div
            className={cn(
              appSidebarFooterClass,
              isIconRail && appSidebarIconRailFooterClass
            )}
            data-slot="app-sidebar-footer"
          >
            <AppSidebarNavGroup
              activeItemIds={resolvedActiveItemIds}
              className={cn(appSidebarFooterSettingsClass)}
              groupSlot="app-sidebar-settings-nav"
              isIconRail={isIconRail}
              items={APP_SIDEBAR_SETTINGS_NAV_ITEMS}
              label={APP_SIDEBAR_SETTINGS_NAV_LABEL}
              renderLink={renderLink}
            />
            <SidebarNavUser isIconRail={isIconRail} user={user} />
          </div>
        </TooltipProvider>
      )}
    </aside>
  );
}

export type { SidebarLinkRenderer };
