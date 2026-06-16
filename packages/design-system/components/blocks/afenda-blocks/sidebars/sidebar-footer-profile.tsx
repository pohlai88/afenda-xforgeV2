"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design-system/components/afenda-ui/avatar";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { SIDEBAR_DEFAULT_PROFILE_DESCRIPTION } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-constants";
import { resolveSidebarLinkRenderer } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-link-defaults";
import {
  sidebarAvatarFallbackClass,
  sidebarFooterButtonClass,
  sidebarFooterClass,
  sidebarFooterMenuClass,
  sidebarIconRailAvatarClass,
  sidebarIconRailHiddenClass,
  sidebarProfileInitials,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import type { SidebarFooterProfileProps } from "./sidebar-types";

export const SidebarFooterProfile = memo(function SidebarFooterProfile({
  avatarFallback,
  avatarSrc,
  className,
  href,
  primaryLabel,
  profileDescription = SIDEBAR_DEFAULT_PROFILE_DESCRIPTION,
  renderLink,
  secondaryLabel,
  trailingControl,
}: SidebarFooterProfileProps) {
  const initials = avatarFallback ?? sidebarProfileInitials(primaryLabel);
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);

  return (
    <SidebarFooter className={cn(sidebarFooterClass, className)}>
      <SidebarMenu
        className={cn(
          sidebarFooterMenuClass,
          trailingControl
            ? "flex-row items-center gap-1 px-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:px-0"
            : undefined
        )}
        data-slot="app-sidebar-footer-menu"
      >
        <SidebarMenuItem
          className={cn(
            trailingControl ? "min-w-0 flex-1" : undefined,
            "group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex-none"
          )}
        >
          <SidebarMenuButton
            asChild
            className={sidebarFooterButtonClass}
            size="lg"
            tooltip={{
              description: profileDescription,
              label: primaryLabel,
            }}
          >
            {linkRenderer({
              href,
              className: cn(
                "flex min-w-0 items-center gap-2.5",
                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
              ),
              children: (
                <>
                  <Avatar className={sidebarIconRailAvatarClass}>
                    {avatarSrc ? <AvatarImage alt="" src={avatarSrc} /> : null}
                    <AvatarFallback className={sidebarAvatarFallbackClass}>
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
        {trailingControl}
      </SidebarMenu>
    </SidebarFooter>
  );
});
