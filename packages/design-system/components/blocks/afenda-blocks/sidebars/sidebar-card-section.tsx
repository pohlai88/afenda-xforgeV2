"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/design-system/components/afenda-ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { isSidebarCardSectionItemActive } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-nav-helpers";
import {
  sidebarCardSectionActionClass,
  sidebarCardSectionExpandedClass,
  sidebarCardSectionHeaderClass,
  sidebarCardSectionItemClass,
  sidebarCardSectionItemIdleClass,
  sidebarCardSectionItemSelectedClass,
  sidebarCardSectionRailMenuClass,
  sidebarCardSectionShellClass,
  sidebarCardSectionTitleClass,
  sidebarIconRailIconClass,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { SettingsIcon } from "lucide-react";
import { memo } from "react";
import { resolveSidebarLinkRenderer } from "./sidebar-link-defaults";
import type {
  SidebarCardSectionItem,
  SidebarCardSectionPanelProps,
} from "./sidebar-types";

export const SidebarCardSectionPanel = memo(function SidebarCardSectionPanel({
  isActive,
  isItemActive = isSidebarCardSectionItemActive,
  pathname = "",
  renderLink,
  section,
}: SidebarCardSectionPanelProps) {
  const Icon = section.icon;
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);
  const menuItems = section.menuItems ?? section.items;

  return (
    <SidebarGroup
      className={sidebarCardSectionShellClass}
      data-slot={`app-sidebar-card-section-${section.id}`}
    >
      <div
        className={cn(
          sidebarCardSectionExpandedClass,
          isActive && "border-brand-primary/25 bg-brand-primary/5"
        )}
      >
        <div className={sidebarCardSectionHeaderClass}>
          <Icon
            aria-hidden="true"
            className={cn(
              sidebarIconRailIconClass,
              isActive ? "text-brand-primary" : "text-text-secondary"
            )}
          />
          <span
            className={cn(
              sidebarCardSectionTitleClass,
              isActive && "text-brand-primary"
            )}
          >
            {section.label}
          </span>
          {menuItems.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={`Open ${section.label} settings`}
                  className={sidebarCardSectionActionClass}
                  type="button"
                >
                  <SettingsIcon aria-hidden="true" className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64" side="right">
                <DropdownMenuLabel>{section.label} settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {menuItems.map((item) => (
                  <SidebarCardSectionMenuItem
                    isActive={isItemActive(pathname, item)}
                    item={item}
                    key={item.id}
                    renderLink={linkRenderer}
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          {section.items.map((item) => (
            <SidebarCardSectionItemLink
              isActive={isItemActive(pathname, item)}
              item={item}
              key={item.id}
              renderLink={linkRenderer}
            />
          ))}
        </div>
      </div>

      <SidebarMenu className={sidebarCardSectionRailMenuClass}>
        <SidebarMenuItem
          data-slot={`app-sidebar-card-section-rail-${section.id}`}
        >
          <SidebarMenuButton
            asChild
            isActive={isActive}
            tooltip={{
              description: section.description,
              label: section.label,
            }}
          >
            {linkRenderer({
              className: "",
              href: section.href,
              children: (
                <Icon aria-hidden="true" className={sidebarIconRailIconClass} />
              ),
            })}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
});

function SidebarCardSectionItemLink({
  isActive,
  item,
  renderLink,
}: {
  readonly isActive: boolean;
  readonly item: SidebarCardSectionItem;
  readonly renderLink: ReturnType<typeof resolveSidebarLinkRenderer>;
}) {
  return renderLink({
    "aria-current": isActive ? "page" : undefined,
    className: cn(
      sidebarCardSectionItemClass,
      isActive
        ? sidebarCardSectionItemSelectedClass
        : sidebarCardSectionItemIdleClass
    ),
    href: item.href,
    children: (
      <span className="block min-w-0">
        <span className="block truncate font-medium text-[12px] leading-4">
          {item.label}
        </span>
        {item.description ? (
          <span
            className={cn(
              "mt-0.5 line-clamp-2 block",
              blockRecipe("blockMetricLabel")
            )}
          >
            {item.description}
          </span>
        ) : null}
      </span>
    ),
  });
}

function SidebarCardSectionMenuItem({
  isActive,
  item,
  renderLink,
}: {
  readonly isActive: boolean;
  readonly item: SidebarCardSectionItem;
  readonly renderLink: ReturnType<typeof resolveSidebarLinkRenderer>;
}) {
  return (
    <DropdownMenuItem
      asChild
      className={cn(isActive && "bg-sidebar-accent text-sidebar-foreground")}
    >
      {renderLink({
        "aria-current": isActive ? "page" : undefined,
        className: "",
        href: item.href,
        children: (
          <>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate">{item.label}</span>
              {item.description ? (
                <span className="truncate text-[11px] text-text-tertiary">
                  {item.description}
                </span>
              ) : null}
            </span>
            {item.shortcut ? (
              <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
            ) : null}
          </>
        ),
      })}
    </DropdownMenuItem>
  );
}
