"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Tabs as TabsPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col", recipe("fieldGap"), className)}
      data-slot="tabs"
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-[var(--button-radius)] border border-border-default bg-surface-muted p-1 shadow-xs",
        recipe("controlText"),
        className
      )}
      data-slot="tabs-list"
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex h-7 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[var(--xforge-radius-sm)] border border-transparent px-2.5 text-text-secondary outline-none hover:bg-surface-raised hover:text-text-primary disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-border-default data-[state=active]:bg-surface-raised data-[state=active]:text-text-primary data-[state=active]:shadow-xs",
        recipe("buttonText", "colorTransition", "focusRingOnly", "controlIcon"),
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "min-w-0 flex-1 outline-none",
        recipe("focusRingOnly"),
        className
      )}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
