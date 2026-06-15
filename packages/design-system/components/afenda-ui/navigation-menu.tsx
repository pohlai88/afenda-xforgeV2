"use client";

import { cn } from "@repo/design-system/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        recipe("bodyText"),
        className
      )}
      data-slot="navigation-menu"
      data-viewport={viewport}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        recipe("motionReduce"),
        className
      )}
      data-slot="navigation-menu-list"
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      className={cn("relative", recipe("motionReduce"), className)}
      data-slot="navigation-menu-item"
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva([
  "group inline-flex h-9 w-max items-center justify-center rounded-[var(--xforge-radius-sm)] bg-transparent px-3 text-text-secondary outline-none",
  "hover:bg-surface-hover hover:text-text-primary focus:bg-surface-hover focus:text-text-primary",
  "data-[state=open]:bg-surface-active data-[state=open]:text-text-primary",
  recipe(
    "buttonText",
    "colorTransition",
    "focusRingOnly",
    "disabledAction",
    "motionReduce"
  ),
]);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), className)}
      data-slot="navigation-menu-trigger"
      {...props}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="relative top-px ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2 data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out top-0 left-0 w-full p-2 pr-2.5 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden",
        "group-data-[viewport=false]/navigation-menu:rounded-[var(--card-radius)] group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-border-default group-data-[viewport=false]/navigation-menu:bg-surface-overlay group-data-[viewport=false]/navigation-menu:text-text-primary group-data-[viewport=false]/navigation-menu:shadow-popover",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in",
        recipe("motionReduce"),
        className
      )}
      data-slot="navigation-menu-content"
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-0 isolate z-[var(--xforge-z-dropdown)] flex justify-center">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top-center overflow-hidden md:w-[var(--radix-navigation-menu-viewport-width)]",
          recipe("overlaySurface", "overlayMotion"),
          className
        )}
        data-slot="navigation-menu-viewport"
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        "flex flex-col gap-1 rounded-[var(--xforge-radius-sm)] p-2 text-text-primary outline-none hover:bg-surface-hover focus:bg-surface-hover data-[active=true]:bg-surface-active",
        recipe(
          "bodyText",
          "colorTransition",
          "focusRingOnly",
          "mutedControlIcon"
        ),
        className
      )}
      data-slot="navigation-menu-link"
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=visible]:animate-in",
        recipe("motionReduce"),
        className
      )}
      data-slot="navigation-menu-indicator"
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-[var(--xforge-radius-sm)] border-border-default border-t border-l bg-surface-overlay shadow-popover" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
