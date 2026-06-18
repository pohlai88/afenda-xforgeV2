"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../afenda-ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../../../afenda-ui/sidebar";
import { resolveSidebarLinkRenderer } from "../../sidebars/sidebar-link-defaults";
import {
  sidebarGroupLabelClass,
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
} from "../../sidebars/sidebar-recipes";
import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { memo } from "react";
import { NAV_STARTED_DEFAULT_GROUP_LABEL } from "./dashboard-nav-constants";
import {
  navMainItemButtonClass,
  navStartedChevronClass,
  navStartedGroupClass,
  navStartedSubButtonClass,
} from "./dashboard-nav-recipes";
import type { NavStartedItem, NavStartedProps } from "./dashboard-nav-types";

interface NavStartedCollapsibleRowProps {
  readonly item: NavStartedItem;
  readonly renderLink: ReturnType<typeof resolveSidebarLinkRenderer>;
}

const NavStartedCollapsibleRow = memo(function NavStartedCollapsibleRow({
  item,
  renderLink,
}: NavStartedCollapsibleRowProps) {
  const Icon = item.icon;
  const subItems = item.items ?? [];

  if (subItems.length === 0) {
    return (
      <SidebarMenuItem data-slot={`nav-started-item-${item.id}`}>
        <SidebarMenuButton
          asChild
          className={navMainItemButtonClass}
          isActive={item.isActive}
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
                {Icon ? (
                  <Icon
                    aria-hidden="true"
                    className={sidebarIconRailIconClass}
                  />
                ) : null}
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
  }

  return (
    <Collapsible
      asChild
      className="group/collapsible"
      defaultOpen={item.isActive}
    >
      <SidebarMenuItem data-slot={`nav-started-item-${item.id}`}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={navMainItemButtonClass}
            isActive={item.isActive}
            tooltip={{
              description: item.description,
              label: item.label,
            }}
          >
            {Icon ? (
              <Icon aria-hidden="true" className={sidebarIconRailIconClass} />
            ) : null}
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                sidebarIconRailHiddenClass
              )}
            >
              {item.label}
            </span>
            <ChevronRightIcon
              aria-hidden="true"
              className={navStartedChevronClass}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((subItem) => (
              <SidebarMenuSubItem key={subItem.id}>
                <SidebarMenuSubButton
                  asChild
                  className={navStartedSubButtonClass}
                  isActive={subItem.isActive}
                >
                  {renderLink({
                    className: "",
                    href: subItem.href,
                    children: <span>{subItem.label}</span>,
                  })}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
});

export const NavStarted = memo(function NavStarted({
  className,
  groupLabel = NAV_STARTED_DEFAULT_GROUP_LABEL,
  items,
  renderLink,
}: NavStartedProps) {
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);

  if (items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup
      className={cn(navStartedGroupClass, className)}
      data-slot="nav-started"
    >
      <SidebarGroupLabel
        className={cn(blockRecipe("blockMetricLabel"), sidebarGroupLabelClass)}
      >
        {groupLabel}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavStartedCollapsibleRow
            item={item}
            key={item.id}
            renderLink={linkRenderer}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
});
