"use client";

import { Button } from "../../../afenda-ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import {
  DEFAULT_CONTENT_LAYOUT_BOTTOM_DRAWER_MAX,
  DEFAULT_CONTENT_LAYOUT_BOTTOM_DRAWER_MIN,
} from "./content-layout-constants";
import { contentLayoutDrawerClass } from "./content-layout-recipes";
import type {
  ContentLayoutBottomDrawerPanelProps,
  ContentLayoutBottomDrawerProps,
} from "./content-layout-types";
import { useControllableBoolean } from "./use-controllable-boolean";

export function ContentLayoutBottomDrawer({
  children,
  config,
}: ContentLayoutBottomDrawerProps) {
  if (!children) {
    return null;
  }

  return (
    <ContentLayoutBottomDrawerPanel config={config}>
      {children}
    </ContentLayoutBottomDrawerPanel>
  );
}

function ContentLayoutBottomDrawerPanel({
  children,
  config,
}: ContentLayoutBottomDrawerPanelProps) {
  const [open, setOpen] = useControllableBoolean({
    controlled: config?.open,
    defaultValue: config?.defaultOpen ?? false,
    onChange: config?.onOpenChange,
  });
  const label = config?.label ?? "Bottom drawer";

  return (
    <section
      className={cn(contentLayoutDrawerClass, config?.className)}
      data-open={open ? "true" : "false"}
      data-slot="content-layout-bottom-drawer"
      style={
        open
          ? {
              maxHeight:
                config?.maxHeight ?? DEFAULT_CONTENT_LAYOUT_BOTTOM_DRAWER_MAX,
              minHeight:
                config?.minHeight ?? DEFAULT_CONTENT_LAYOUT_BOTTOM_DRAWER_MIN,
            }
          : undefined
      }
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-border-subtle border-b px-3 py-1.5">
        <span className="font-medium text-[11px] text-text-secondary">
          {label}
        </span>
        <Button
          aria-expanded={open}
          aria-label={open ? "Collapse bottom drawer" : "Expand bottom drawer"}
          className="size-7"
          onClick={() => {
            setOpen((current) => !current);
          }}
          size="icon-sm"
          type="button"
          variant="quiet"
        >
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "size-3.5 transition-transform duration-200 motion-reduce:transition-none",
              open && "rotate-180"
            )}
          />
        </Button>
      </div>
      {open ? (
        <div className="min-h-0 overflow-y-auto px-3 py-2">{children}</div>
      ) : null}
    </section>
  );
}
