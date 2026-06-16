"use client";

import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import { Kbd } from "../../../afenda-ui/kbd";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";
import { defaultSidebarLink } from "./sidebar-link-defaults";
import {
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarQuickActionClass,
  sidebarQuickActionKbdClass,
  sidebarQuickActionsHeaderClass,
} from "./sidebar-recipes";
import type { SidebarQuickActionsProps } from "./sidebar-types";

export const SidebarQuickActions = memo(function SidebarQuickActions({
  actions,
  className,
  renderActionLink = defaultSidebarLink,
}: SidebarQuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <SidebarHeader
      className={cn(sidebarQuickActionsHeaderClass, className)}
    >
      <SidebarMenu data-slot="app-sidebar-quick-actions">
        {actions.map((action) => {
          const Icon = action.icon;
          const tooltip = {
            description: action.description,
            label: action.topic,
            shortcut: action.shortcut,
          };

          return (
            <SidebarMenuItem key={action.id}>
              <SidebarMenuButton
                asChild
                className={sidebarQuickActionClass}
                tooltip={tooltip}
              >
                {renderActionLink({
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
