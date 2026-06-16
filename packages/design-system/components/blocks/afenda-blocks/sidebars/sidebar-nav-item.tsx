"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import { resolveSidebarLinkRenderer } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-link-defaults";
import {
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarNavItemBaseClass,
  sidebarNavItemIdleClass,
  sidebarNavItemSelectedClass,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import type { SidebarNavItemRowProps } from "./sidebar-types";

export const SidebarNavItemRow = memo(function SidebarNavItemRow({
  item,
  renderLink,
  selected,
}: SidebarNavItemRowProps) {
  const Icon = item.icon;
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);

  return (
    <SidebarMenuItem data-slot={`app-sidebar-nav-item-${item.id}`}>
      <SidebarMenuButton
        asChild
        isActive={selected}
        tooltip={{
          description: item.description,
          label: item.label,
          shortcut: item.shortcut,
        }}
        className={cn(
          sidebarNavItemBaseClass,
          selected ? sidebarNavItemSelectedClass : sidebarNavItemIdleClass
        )}
      >
        {linkRenderer({
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
