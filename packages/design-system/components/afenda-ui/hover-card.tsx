"use client";

import { cn } from "../../lib/utils";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

function HoverCardPortal({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Portal>) {
  return <HoverCardPrimitive.Portal data-slot="hover-card-portal" {...props} />;
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 6,
  portalProps,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & {
  portalProps?: React.ComponentProps<typeof HoverCardPrimitive.Portal>;
}) {
  return (
    <HoverCardPortal {...portalProps}>
      <HoverCardPrimitive.Content
        align={align}
        className={cn(
          "z-[var(--xforge-z-dropdown)] w-72 origin-(--radix-hover-card-content-transform-origin)",
          recipe(
            "overlaySurface",
            "overlayPadding",
            "overlayMotion",
            "bodyText"
          ),
          className
        )}
        data-slot="hover-card-content"
        sideOffset={sideOffset}
        {...props}
      />
    </HoverCardPortal>
  );
}

export { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger };
