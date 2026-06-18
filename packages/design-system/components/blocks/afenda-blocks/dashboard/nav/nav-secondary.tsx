"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../../afenda-ui/sidebar";
import { resolveSidebarLinkRenderer } from "../../sidebars/sidebar-link-defaults";
import {
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
} from "../../sidebars/sidebar-recipes";
import { cn } from "../../../../../lib/utils";
import { type ComponentPropsWithoutRef, memo } from "react";
import {
  navMainGroupContentClass,
  navMainItemButtonClass,
} from "./dashboard-nav-recipes";
import type {
  NavSecondaryItem,
  NavSecondaryProps,
} from "./dashboard-nav-types";

const NavSecondaryItemRow = memo(function NavSecondaryItemRow({
  item,
  renderLink,
}: {
  readonly item: NavSecondaryItem;
  readonly renderLink: ReturnType<typeof resolveSidebarLinkRenderer>;
}) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem data-slot={`nav-secondary-item-${item.id}`}>
      <SidebarMenuButton
        asChild
        className={navMainItemButtonClass}
        tooltip={{
          description: item.description,
          label: item.label,
        }}
      >
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
    </SidebarMenuItem>
  );
});

export const NavSecondary = memo(function NavSecondary({
  className,
  contentClassName,
  items,
  renderLink,
  ...groupProps
}: NavSecondaryProps &
  Omit<ComponentPropsWithoutRef<typeof SidebarGroup>, "children">) {
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);

  if (items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup
      className={cn(className)}
      data-slot="nav-secondary"
      {...groupProps}
    >
      <SidebarGroupContent
        className={cn(navMainGroupContentClass, contentClassName)}
      >
        <SidebarMenu>
          {items.map((item) => (
            <NavSecondaryItemRow
              item={item}
              key={item.id}
              renderLink={linkRenderer}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});
