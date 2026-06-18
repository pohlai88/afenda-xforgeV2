"use client";

import { cn } from "../../lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectPortal({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Portal>) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "compact" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex w-full min-w-0 items-center justify-between gap-2 px-[var(--button-padding-x)] outline-none data-[state=open]:border-border-active data-[placeholder]:text-text-tertiary data-[state=open]:ring-2 data-[state=open]:ring-ring/30",
        recipe(
          "flatControlSurface",
          "controlText",
          "colorTransition",
          "disabledControl",
          "invalidState",
          "focusRing",
          "motionReduce"
        ),
        size === "compact" ? "h-8" : "h-9",
        recipe("mutedControlIcon"),
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
        className
      )}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className={cn(recipe("selectIcon"))} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  portalProps,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  portalProps?: React.ComponentProps<typeof SelectPrimitive.Portal>;
}) {
  return (
    <SelectPortal {...portalProps}>
      <SelectPrimitive.Content
        align={align}
        className={cn(
          "max-h-(--radix-select-content-available-height) min-w-[var(--select-content-min-width)] overflow-y-auto overflow-x-hidden",
          recipe("overlaySurface", "bodyText", "selectOrigin", "overlayMotion"),
          position === "popper" &&
            "data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        data-slot="select-content"
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            recipe("menuPadding"),
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPortal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-2 py-1.5", recipe("metadataText"), className)}
      data-slot="select-label"
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "w-full pr-8 pl-2",
        recipe("rowItem", "rowHighlight", "rowDisabled", "rowIcon"),
        className
      )}
      data-slot="select-item"
      {...props}
    >
      <span className={cn(recipe("selectItemIndicator"))}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className={cn(recipe("selectIcon"))} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-border-default",
        className
      )}
      data-slot="select-separator"
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(recipe("overlayScrollButton"), className)}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUpIcon className={cn(recipe("selectIcon"))} />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(recipe("overlayScrollButton"), className)}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDownIcon className={cn(recipe("selectIcon"))} />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectPortal,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
