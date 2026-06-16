"use client";

import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/afenda-ui/sidebar";
import { resolveSidebarLinkRenderer } from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-link-defaults";
import {
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
} from "@repo/design-system/components/blocks/afenda-blocks/sidebars/sidebar-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { CirclePlusIcon, MailIcon } from "lucide-react";
import { memo } from "react";
import {
  NAV_MAIN_DEFAULT_INBOX_LABEL,
  NAV_MAIN_DEFAULT_QUICK_CREATE_LABEL,
} from "./dashboard-nav-constants";
import {
  navMainActionRowClass,
  navMainGroupContentClass,
  navMainInboxButtonClass,
  navMainItemButtonClass,
  navMainQuickCreateClass,
} from "./dashboard-nav-recipes";
import type {
  NavMainItem,
  NavMainProps,
  NavMainQuickAction,
} from "./dashboard-nav-types";

const DEFAULT_QUICK_CREATE: NavMainQuickAction = {
  label: NAV_MAIN_DEFAULT_QUICK_CREATE_LABEL,
};

const DEFAULT_INBOX: NavMainQuickAction = {
  label: NAV_MAIN_DEFAULT_INBOX_LABEL,
};

const NavMainItemRow = memo(function NavMainItemRow({
  item,
  renderLink,
}: {
  readonly item: NavMainItem;
  readonly renderLink: ReturnType<typeof resolveSidebarLinkRenderer>;
}) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem data-slot={`nav-main-item-${item.id}`}>
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
            </>
          ),
        })}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

export const NavMain = memo(
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Dashboard demo nav coordinates quick-create, inbox, grouped links, active state, and custom link rendering.
  function NavMain({
    className,
    groupClassName,
    inbox = DEFAULT_INBOX,
    items,
    quickCreate = DEFAULT_QUICK_CREATE,
    renderLink,
  }: NavMainProps) {
    const linkRenderer = resolveSidebarLinkRenderer(renderLink);
    const showQuickCreate = quickCreate !== false;
    const showInbox = inbox !== false;
    const showActionRow = showQuickCreate || showInbox;

    const quickCreateConfig = showQuickCreate ? quickCreate : null;
    const inboxConfig = showInbox ? inbox : null;
    const QuickCreateIcon = quickCreateConfig?.icon ?? CirclePlusIcon;
    const InboxIcon = inboxConfig?.icon ?? MailIcon;

    return (
      <SidebarGroup className={cn(className)} data-slot="nav-main">
        <SidebarGroupContent
          className={cn(navMainGroupContentClass, groupClassName)}
        >
          {showActionRow ? (
            <SidebarMenu data-slot="nav-main-actions">
              <SidebarMenuItem className={navMainActionRowClass}>
                {quickCreateConfig ? (
                  <SidebarMenuButton
                    asChild={Boolean(quickCreateConfig.href)}
                    className={navMainQuickCreateClass}
                    onClick={
                      quickCreateConfig.href
                        ? undefined
                        : quickCreateConfig.onSelect
                    }
                    tooltip={{
                      description: quickCreateConfig.description,
                      label:
                        quickCreateConfig.label ??
                        NAV_MAIN_DEFAULT_QUICK_CREATE_LABEL,
                    }}
                  >
                    {quickCreateConfig.href ? (
                      linkRenderer({
                        className: "",
                        href: quickCreateConfig.href,
                        children: (
                          <>
                            <QuickCreateIcon
                              aria-hidden="true"
                              className={sidebarIconRailIconClass}
                            />
                            <span
                              className={cn(
                                "min-w-0 flex-1 truncate",
                                sidebarIconRailHiddenClass
                              )}
                            >
                              {quickCreateConfig.label ??
                                NAV_MAIN_DEFAULT_QUICK_CREATE_LABEL}
                            </span>
                          </>
                        ),
                      })
                    ) : (
                      <>
                        <QuickCreateIcon
                          aria-hidden="true"
                          className={sidebarIconRailIconClass}
                        />
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate",
                            sidebarIconRailHiddenClass
                          )}
                        >
                          {quickCreateConfig.label ??
                            NAV_MAIN_DEFAULT_QUICK_CREATE_LABEL}
                        </span>
                      </>
                    )}
                  </SidebarMenuButton>
                ) : null}
                {inboxConfig ? (
                  <Button
                    aria-label={
                      inboxConfig.label ?? NAV_MAIN_DEFAULT_INBOX_LABEL
                    }
                    asChild={Boolean(inboxConfig.href)}
                    className={navMainInboxButtonClass}
                    onClick={
                      inboxConfig.href ? undefined : inboxConfig.onSelect
                    }
                    size="icon-sm"
                    type="button"
                    variant="secondary"
                  >
                    {inboxConfig.href ? (
                      linkRenderer({
                        className:
                          "inline-flex size-8 items-center justify-center",
                        href: inboxConfig.href,
                        children: (
                          <InboxIcon aria-hidden="true" className="size-4" />
                        ),
                      })
                    ) : (
                      <>
                        <InboxIcon aria-hidden="true" className="size-4" />
                        <span className="sr-only">
                          {inboxConfig.label ?? NAV_MAIN_DEFAULT_INBOX_LABEL}
                        </span>
                      </>
                    )}
                  </Button>
                ) : null}
              </SidebarMenuItem>
            </SidebarMenu>
          ) : null}
          {items.length > 0 ? (
            <SidebarMenu data-slot="nav-main-items">
              {items.map((item) => (
                <NavMainItemRow
                  item={item}
                  key={item.id}
                  renderLink={linkRenderer}
                />
              ))}
            </SidebarMenu>
          ) : null}
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
);
