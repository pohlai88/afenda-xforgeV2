"use client";

import { Button } from "../../../afenda-ui/button";
import {
  contentLayoutSidebarAriaLabel,
  contentLayoutSidebarToggleAriaLabel,
  DEFAULT_CONTENT_LAYOUT_SIDEBAR_COLLAPSED_WIDTH,
  DEFAULT_CONTENT_LAYOUT_SIDEBAR_WIDTH,
} from "./content-layout-constants";
import { contentLayoutSidebarClass } from "./content-layout-recipes";
import { cn } from "../../../../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type {
  ContentLayoutSidebarPanelProps,
  ContentLayoutSidebarProps,
} from "./content-layout-types";
import { useControllableBoolean } from "./use-controllable-boolean";

export function ContentLayoutSidebar({
  children,
  config,
  defaultWidth = DEFAULT_CONTENT_LAYOUT_SIDEBAR_WIDTH,
  side,
}: ContentLayoutSidebarProps) {
  if (!children) {
    return null;
  }

  return (
    <ContentLayoutSidebarPanel
      config={config}
      defaultWidth={defaultWidth}
      side={side}
    >
      {children}
    </ContentLayoutSidebarPanel>
  );
}

function ContentLayoutSidebarPanel({
  children,
  config,
  defaultWidth = DEFAULT_CONTENT_LAYOUT_SIDEBAR_WIDTH,
  side,
}: ContentLayoutSidebarPanelProps) {
  const [collapsed, setCollapsed] = useControllableBoolean({
    controlled: config?.collapsed,
    defaultValue: config?.defaultCollapsed ?? false,
    onChange: config?.onCollapsedChange,
  });
  const expandedWidth = config?.width ?? defaultWidth;
  const collapsedWidth =
    config?.collapsedWidth ?? DEFAULT_CONTENT_LAYOUT_SIDEBAR_COLLAPSED_WIDTH;

  return (
    <aside
      aria-label={contentLayoutSidebarAriaLabel(side, config?.ariaLabel)}
      className={cn(
        contentLayoutSidebarClass,
        side === "left" ? "border-r" : "border-l",
        config?.className
      )}
      data-collapsed={collapsed ? "true" : "false"}
      data-side={side}
      data-slot={`content-layout-sidebar-${side}`}
      style={{
        width: collapsed ? collapsedWidth : expandedWidth,
      }}
    >
      <div className="flex shrink-0 items-center justify-end border-border-subtle border-b px-1 py-0.5">
        <Button
          aria-expanded={!collapsed}
          aria-label={contentLayoutSidebarToggleAriaLabel(side, collapsed)}
          className="size-7"
          onClick={() => {
            setCollapsed((current) => !current);
          }}
          size="icon-sm"
          type="button"
          variant="quiet"
        >
          {side === "left" ? (
            <ChevronLeftIcon
              aria-hidden="true"
              className={cn(
                "size-3.5 transition-transform duration-200 motion-reduce:transition-none",
                collapsed && "rotate-180"
              )}
            />
          ) : (
            <ChevronRightIcon
              aria-hidden="true"
              className={cn(
                "size-3.5 transition-transform duration-200 motion-reduce:transition-none",
                collapsed && "rotate-180"
              )}
            />
          )}
        </Button>
      </div>
      {collapsed ? null : (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      )}
    </aside>
  );
}
