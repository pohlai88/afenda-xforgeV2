"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/afenda-ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { resolveSidebarLinkRenderer } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-link-defaults";
import {
  sidebarGroupLabelClass,
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { EllipsisIcon, FolderIcon, Share2Icon, TrashIcon } from "lucide-react";
import { memo } from "react";
import {
  NAV_DOCUMENTS_DEFAULT_GROUP_LABEL,
  NAV_DOCUMENTS_DEFAULT_MENU_LABEL,
  NAV_DOCUMENTS_DEFAULT_MORE_LABEL,
} from "./dashboard-nav-constants";
import {
  navDocumentsDropdownContentClass,
  navDocumentsDropdownMenuItemClass,
  navDocumentsGroupClass,
  navDocumentsMenuActionClass,
  navDocumentsMoreButtonClass,
  navMainItemButtonClass,
} from "./dashboard-nav-recipes";
import type {
  NavDocumentsItem,
  NavDocumentsMenuItem,
  NavDocumentsProps,
} from "./dashboard-nav-types";

const DEFAULT_DOCUMENT_MENU_ITEMS: readonly NavDocumentsMenuItem[] = [
  { id: "open", icon: FolderIcon, label: "Open" },
  { id: "share", icon: Share2Icon, label: "Share" },
  {
    id: "delete",
    icon: TrashIcon,
    label: "Delete",
    separatorBefore: true,
    variant: "destructive",
  },
];

const DEFAULT_MORE_ACTION = {
  label: NAV_DOCUMENTS_DEFAULT_MORE_LABEL,
};

function NavDocumentsMenuItems({
  items,
}: {
  readonly items: readonly NavDocumentsMenuItem[];
}) {
  return items.map((menuItem) => {
    const Icon = menuItem.icon;

    return (
      <div key={menuItem.id}>
        {menuItem.separatorBefore ? <DropdownMenuSeparator /> : null}
        <DropdownMenuItem
          className={navDocumentsDropdownMenuItemClass}
          onSelect={() => {
            menuItem.onSelect?.();
          }}
          variant={menuItem.variant}
        >
          {Icon ? (
            <Icon aria-hidden="true" className="size-4 shrink-0" />
          ) : null}
          <span>{menuItem.label}</span>
        </DropdownMenuItem>
      </div>
    );
  });
}

const NavDocumentsItemRow = memo(function NavDocumentsItemRow({
  defaultMenuItems,
  defaultMenuLabel,
  isMobile,
  item,
  renderLink,
}: {
  readonly defaultMenuItems: readonly NavDocumentsMenuItem[];
  readonly defaultMenuLabel: string;
  readonly isMobile: boolean;
  readonly item: NavDocumentsItem;
  readonly renderLink: ReturnType<typeof resolveSidebarLinkRenderer>;
}) {
  const Icon = item.icon;
  const menuItems = item.menuItems ?? defaultMenuItems;
  const menuLabel = item.menuLabel ?? defaultMenuLabel;

  return (
    <SidebarMenuItem data-slot={`nav-documents-item-${item.id}`}>
      <SidebarMenuButton asChild className={navMainItemButtonClass}>
        {renderLink({
          className: "",
          href: item.href,
          children: (
            <>
              <Icon aria-hidden="true" className={sidebarIconRailIconClass} />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  sidebarIconRailHiddenClass
                )}
              >
                {item.label}
              </span>
            </>
          ),
        })}
      </SidebarMenuButton>
      {menuItems.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              aria-label={menuLabel}
              className={navDocumentsMenuActionClass}
              showOnHover
            >
              <EllipsisIcon aria-hidden="true" className="size-4" />
              <span className="sr-only">{menuLabel}</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isMobile ? "end" : "start"}
            className={navDocumentsDropdownContentClass}
            data-slot={`nav-documents-menu-${item.id}`}
            side={isMobile ? "bottom" : "right"}
          >
            <NavDocumentsMenuItems items={menuItems} />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </SidebarMenuItem>
  );
});

export const NavDocuments = memo(function NavDocuments({
  className,
  groupLabel = NAV_DOCUMENTS_DEFAULT_GROUP_LABEL,
  items,
  menuItems = DEFAULT_DOCUMENT_MENU_ITEMS,
  menuLabel = NAV_DOCUMENTS_DEFAULT_MENU_LABEL,
  more = DEFAULT_MORE_ACTION,
  renderLink,
}: NavDocumentsProps) {
  const { isMobile } = useSidebar();
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);
  const showMore = more !== false;
  const moreConfig = showMore ? more : null;
  const MoreIcon = moreConfig?.icon ?? EllipsisIcon;

  if (items.length === 0 && !showMore) {
    return null;
  }

  return (
    <SidebarGroup
      className={cn(navDocumentsGroupClass, className)}
      data-slot="nav-documents"
    >
      <SidebarGroupLabel
        className={cn(blockRecipe("blockMetricLabel"), sidebarGroupLabelClass)}
      >
        {groupLabel}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavDocumentsItemRow
            defaultMenuItems={menuItems}
            defaultMenuLabel={menuLabel}
            isMobile={isMobile}
            item={item}
            key={item.id}
            renderLink={linkRenderer}
          />
        ))}
        {moreConfig ? (
          <SidebarMenuItem data-slot="nav-documents-more">
            <SidebarMenuButton
              asChild={Boolean(moreConfig.href)}
              className={navDocumentsMoreButtonClass}
              onClick={moreConfig.href ? undefined : moreConfig.onSelect}
            >
              {moreConfig.href ? (
                linkRenderer({
                  className: "",
                  href: moreConfig.href,
                  children: (
                    <>
                      <MoreIcon
                        aria-hidden="true"
                        className={cn(
                          sidebarIconRailIconClass,
                          navDocumentsMoreButtonClass
                        )}
                      />
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          sidebarIconRailHiddenClass
                        )}
                      >
                        {moreConfig.label ?? NAV_DOCUMENTS_DEFAULT_MORE_LABEL}
                      </span>
                    </>
                  ),
                })
              ) : (
                <>
                  <MoreIcon
                    aria-hidden="true"
                    className={cn(
                      sidebarIconRailIconClass,
                      navDocumentsMoreButtonClass
                    )}
                  />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate",
                      sidebarIconRailHiddenClass
                    )}
                  >
                    {moreConfig.label ?? NAV_DOCUMENTS_DEFAULT_MORE_LABEL}
                  </span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : null}
      </SidebarMenu>
    </SidebarGroup>
  );
});
