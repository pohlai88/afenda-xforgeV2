"use client";

import { useCallback, useMemo, type ReactNode } from "react";
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
  collectSidebarNavItemDescriptors,
  resolveAfendaAppSidebarNavLayout,
} from "./sidebar-nav-descriptors";
import {
  resolveSidebarLinkRenderer,
  type SidebarLinkRenderer,
} from "../../shadcn-dashboard-01/sidebar-link";
import {
  collectSidebarNavItems,
  type AfendaAppSidebarNavGroup,
  type AfendaAppSidebarNavGroupSlot,
  type AppSidebarNavItem,
} from "./sidebar-nav-types";
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
  readonly groupSlot: AfendaAppSidebarNavGroupSlot;
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

function AfendaAppSidebarNavTree({
  activeItemIds,
  isIconRail,
  nav,
  navUserMenuGroups,
  onNavUserMenuItemSelect,
  renderLink,
  renderNavUserMenuLink,
  user,
}: {
  readonly activeItemIds: ReadonlySet<string>;
  readonly isIconRail: boolean;
  readonly nav: NonNullable<AfendaAppSidebarProps["nav"]>;
  readonly navUserMenuGroups?: AfendaAppSidebarProps["navUserMenuGroups"];
  readonly onNavUserMenuItemSelect?: AfendaAppSidebarProps["onNavUserMenuItemSelect"];
  readonly renderLink?: SidebarLinkRenderer;
  readonly renderNavUserMenuLink?: SidebarLinkRenderer;
  readonly user?: AfendaAppSidebarProps["user"];
}) {
  const scrollGroups = nav.scroll ?? [];

  return (
    <TooltipProvider delayDuration={0}>
      {nav.main ? (
        <div
          className={cn(appSidebarMainNavShellClass)}
          data-slot="app-sidebar-main-nav-shell"
        >
          <AppSidebarNavGroup
            activeItemIds={activeItemIds}
            groupSlot={nav.main.groupSlot}
            isIconRail={isIconRail}
            items={nav.main.items}
            label={nav.main.label}
            renderLink={renderLink}
          />
        </div>
      ) : null}
      {scrollGroups.length > 0 ? (
        <ScrollArea
          className={cn(
            appSidebarScrollAreaClass,
            isIconRail && appSidebarIconRailScrollAreaClass
          )}
          data-slot="app-sidebar-scroll"
        >
          <div className={cn(appSidebarScrollContentClass)}>
            {scrollGroups.map((group) => (
              <AppSidebarNavGroup
                activeItemIds={activeItemIds}
                groupSlot={group.groupSlot}
                isIconRail={isIconRail}
                items={group.items}
                key={group.groupSlot}
                label={group.label}
                renderLink={renderLink}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
      {nav.footer || user ? (
        <div
          className={cn(
            appSidebarFooterClass,
            isIconRail && appSidebarIconRailFooterClass
          )}
          data-slot="app-sidebar-footer"
        >
          {nav.footer ? (
            <AppSidebarNavGroup
              activeItemIds={activeItemIds}
              className={cn(appSidebarFooterSettingsClass)}
              groupSlot={nav.footer.groupSlot}
              isIconRail={isIconRail}
              items={nav.footer.items}
              label={nav.footer.label}
              renderLink={renderLink}
            />
          ) : null}
          {user ? (
            <SidebarNavUser
              isIconRail={isIconRail}
              menuGroups={navUserMenuGroups}
              onMenuItemSelect={onNavUserMenuItemSelect}
              renderMenuLink={renderNavUserMenuLink}
              user={user}
            />
          ) : null}
        </div>
      ) : null}
    </TooltipProvider>
  );
}

export function AfendaAppSidebar({
  activeItemIds,
  children,
  className,
  nav,
  navDescriptor,
  navIconRegistry,
  navUserMenuGroups,
  onNavUserMenuItemSelect,
  pathname = "",
  renderLink,
  renderNavUserMenuLink,
  user,
  ...properties
}: AfendaAppSidebarProps) {
  const { behaviorMode, isExpanded, setHoverPeek } = useAppShellSidebar();
  const isIconRail = !isExpanded;

  const resolvedNav = useMemo(() => {
    if (nav) {
      return nav;
    }

    if (navDescriptor && navIconRegistry) {
      return resolveAfendaAppSidebarNavLayout(navDescriptor, navIconRegistry);
    }

    return undefined;
  }, [nav, navDescriptor, navIconRegistry]);

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
    (resolvedNav
      ? resolveActiveSidebarNavItemIds(pathname, collectSidebarNavItems(resolvedNav))
      : navDescriptor
        ? resolveActiveSidebarNavItemIds(
            pathname,
            collectSidebarNavItemDescriptors(navDescriptor)
          )
        : new Set<string>());

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
      {children ??
        (resolvedNav ? (
          <AfendaAppSidebarNavTree
            activeItemIds={resolvedActiveItemIds}
            isIconRail={isIconRail}
            nav={resolvedNav}
            navUserMenuGroups={navUserMenuGroups}
            onNavUserMenuItemSelect={onNavUserMenuItemSelect}
            renderLink={renderLink}
            renderNavUserMenuLink={renderNavUserMenuLink}
            user={user}
          />
        ) : null)}
    </aside>
  );
}
