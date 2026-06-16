"use client";

import { cn } from "@repo/design-system/lib/utils";
import { memo, useMemo } from "react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";
import { defaultSidebarLink } from "./sidebar-link-defaults";
import {
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarNavItemIdleClass,
  sidebarNavItemSelectedClass,
} from "./sidebar-recipes";
import type { SidebarNavItemRowProps } from "./sidebar-types";

export const SidebarNavItemRow = memo(function SidebarNavItemRow({
  item,
  renderNavItemLink = defaultSidebarLink,
  selected,
}: SidebarNavItemRowProps) {
  const Icon = item.icon;

  const tooltip = useMemo(
    () => ({
      description: item.description,
      label: item.label,
      shortcut: item.shortcut,
    }),
    [item.description, item.label, item.shortcut]
  );

  return (
    <SidebarMenuItem data-slot={`app-sidebar-nav-item-${item.id}`}>
      <SidebarMenuButton
        asChild
        isActive={selected}
        tooltip={tooltip}
        className={cn(
          selected ? sidebarNavItemSelectedClass : sidebarNavItemIdleClass,
          "h-8 text-[12px] leading-4"
        )}
      >
        {renderNavItemLink({
          "aria-current": selected ? "page" : undefined,
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
              {item.badge ? (
                <span
                  className={cn(
                    "shrink-0 font-mono text-[10px] text-text-tertiary tabular-nums",
                    sidebarIconRailHiddenClass
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </>
          ),
        })}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});
