"use client";

import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../afenda-ui/avatar";
import {
  SidebarControlMenu,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";
import { defaultSidebarLink } from "./sidebar-link-defaults";
import {
  sidebarFooterButtonClass,
  sidebarFooterClass,
  sidebarFooterRowClass,
  sidebarIconRailAvatarClass,
  sidebarIconRailHiddenClass,
  sidebarProfileInitials,
} from "./sidebar-recipes";
import type { SidebarFooterProfileProps } from "./sidebar-types";

export const SidebarFooterProfile = memo(function SidebarFooterProfile({
  avatarFallback,
  avatarSrc,
  className,
  href,
  primaryLabel,
  profileDescription = "Account settings and workspace profile.",
  renderLink = defaultSidebarLink,
  secondaryLabel,
  showSidebarControl = false,
}: SidebarFooterProfileProps) {
  const initials = avatarFallback ?? sidebarProfileInitials(primaryLabel);

  return (
    <SidebarFooter className={cn(sidebarFooterClass, className)}>
      <div
        className={cn(
          sidebarFooterRowClass,
          showSidebarControl ? "justify-between" : undefined
        )}
        data-slot="app-sidebar-footer-row"
      >
        <SidebarMenu className="min-w-0 flex-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={sidebarFooterButtonClass}
              size="lg"
              tooltip={{
                description: profileDescription,
                label: primaryLabel,
              }}
            >
              {renderLink({
                href,
                className: "flex min-w-0 items-center gap-2.5",
                children: (
                  <>
                    <Avatar className={sidebarIconRailAvatarClass}>
                      {avatarSrc ? (
                        <AvatarImage alt="" src={avatarSrc} />
                      ) : null}
                      <AvatarFallback className="bg-sidebar-accent font-medium text-[10px] text-sidebar-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "grid min-w-0 flex-1 text-left leading-tight",
                        sidebarIconRailHiddenClass
                      )}
                    >
                      <span className="truncate font-medium text-[12px] text-sidebar-foreground">
                        {primaryLabel}
                      </span>
                      {secondaryLabel ? (
                        <span className="truncate text-[11px] text-text-tertiary">
                          {secondaryLabel}
                        </span>
                      ) : null}
                    </span>
                  </>
                ),
              })}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {showSidebarControl ? (
          <SidebarControlMenu align="center" side="top" />
        ) : null}
      </div>
    </SidebarFooter>
  );
});
