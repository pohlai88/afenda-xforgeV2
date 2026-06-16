"use client";

import { Kbd } from "@repo/design-system/components/afenda-ui/kbd";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import { resolveSidebarLinkRenderer } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-link-defaults";
import {
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarQuickActionClass,
  sidebarQuickActionKbdClass,
  sidebarQuickActionsHeaderClass,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import type { SidebarQuickActionsProps } from "./sidebar-types";

export const SidebarQuickActions = memo(function SidebarQuickActions({
  actions,
  className,
  renderLink,
}: SidebarQuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  const linkRenderer = resolveSidebarLinkRenderer(renderLink);

  return (
    <SidebarHeader className={cn(sidebarQuickActionsHeaderClass, className)}>
      <SidebarMenu data-slot="app-sidebar-quick-actions">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <SidebarMenuItem key={action.id}>
              <SidebarMenuButton
                asChild
                className={sidebarQuickActionClass}
                tooltip={{
                  description: action.description,
                  label: action.topic,
                  shortcut: action.shortcut,
                }}
              >
                {linkRenderer({
                  className: "",
                  href: action.href,
                  children: (
                    <>
                      <Icon
                        aria-hidden="true"
                        className={sidebarIconRailIconClass}
                      />
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          sidebarIconRailHiddenClass
                        )}
                      >
                        {action.topic}
                      </span>
                      <Kbd
                        className={cn(
                          sidebarQuickActionKbdClass,
                          sidebarIconRailHiddenClass
                        )}
                      >
                        {action.shortcut}
                      </Kbd>
                    </>
                  ),
                })}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarHeader>
  );
});
