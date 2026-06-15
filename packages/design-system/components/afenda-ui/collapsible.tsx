"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { recipe } from "./recipes";

function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      className={cn("w-full", recipe("bodyText"), className)}
      data-slot="collapsible"
      {...props}
    />
  );
}

function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      className={cn(
        "rounded-[var(--xforge-radius-sm)] outline-none disabled:pointer-events-none disabled:opacity-50",
        recipe("focusRingOnly", "colorTransition", "motionReduce"),
        className
      )}
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      className={cn(
        "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        recipe("motionReduce"),
        className
      )}
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
