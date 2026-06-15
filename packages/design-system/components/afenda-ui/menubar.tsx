"use client";

import { cn } from "@repo/design-system/lib/utils";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { Menubar as MenubarPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      className={cn(
        "flex h-10 w-full min-w-0 items-center gap-0.5 border-border-default border-b bg-surface px-2 text-text-secondary",
        recipe("bodyText", "motionReduce"),
        className
      )}
      data-slot="menubar"
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        "flex h-7 select-none items-center rounded-[var(--xforge-radius-sm)] px-2.5 text-text-secondary outline-none hover:bg-surface-hover hover:text-text-primary data-[state=open]:bg-surface-active data-[state=open]:text-text-primary",
        recipe(
          "buttonText",
          "colorTransition",
          "focusRingOnly",
          "motionReduce"
        ),
        className
      )}
      data-slot="menubar-trigger"
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  portalProps,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content> & {
  portalProps?: React.ComponentProps<typeof MenubarPrimitive.Portal>;
}) {
  return (
    <MenubarPortal {...portalProps}>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "z-[var(--xforge-z-dropdown)] min-w-48 origin-(--radix-menubar-content-transform-origin) overflow-hidden",
          recipe("overlaySurface", "menuPadding", "overlayMotion"),
          className
        )}
        data-slot="menubar-content"
        sideOffset={sideOffset}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      className={cn(
        recipe(
          "rowItem",
          "rowInset",
          "rowHighlight",
          "rowDisabled",
          "rowDestructive",
          "rowIcon",
          "rowDestructiveIcon"
        ),
        className
      )}
      data-inset={inset}
      data-slot="menubar-item"
      data-variant={variant}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        recipe(
          "rowItem",
          "rowCheckboxPadding",
          "rowHighlight",
          "rowDisabled",
          "rowIcon"
        ),
        className
      )}
      data-slot="menubar-checkbox-item"
      {...props}
    >
      <span className={recipe("itemIndicator")}>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      className={cn(
        recipe(
          "rowItem",
          "rowCheckboxPadding",
          "rowHighlight",
          "rowDisabled",
          "rowIcon"
        ),
        className
      )}
      data-slot="menubar-radio-item"
      {...props}
    >
      <span className={recipe("itemIndicator")}>
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      className={cn(recipe("menuLabelInset", "metadataText"), className)}
      data-inset={inset}
      data-slot="menubar-label"
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      className={cn(recipe("menuSeparatorInset", "motionReduce"), className)}
      data-slot="menubar-separator"
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("ml-auto pl-4", recipe("shortcutText"), className)}
      data-slot="menubar-shortcut"
      {...props}
    />
  );
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        recipe("rowItem", "rowInset", "rowHighlight", "rowDisabled", "rowIcon"),
        className
      )}
      data-inset={inset}
      data-slot="menubar-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        "z-[var(--xforge-z-dropdown)] min-w-40 origin-(--radix-menubar-content-transform-origin) overflow-hidden",
        recipe("overlaySurface", "menuPadding", "overlayMotion"),
        className
      )}
      data-slot="menubar-sub-content"
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
