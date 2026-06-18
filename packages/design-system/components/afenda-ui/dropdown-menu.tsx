"use client";

import { cn } from "../../lib/utils";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 6,
  portalProps,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  portalProps?: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>;
}) {
  return (
    <DropdownMenuPortal {...portalProps}>
      <DropdownMenuPrimitive.Content
        className={cn(
          "min-w-56 overflow-hidden",
          recipe(
            "overlaySurface",
            "menuPadding",
            "bodyText",
            "dropdownOrigin",
            "overlayMotion"
          ),
          className
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPortal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        recipe("menuLabelInset"),
        recipe("metadataText"),
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant: _variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "critical";
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        recipe(
          "rowItem",
          "rowHighlight",
          "rowDisabled",
          "rowCritical",
          "rowInset",
          "rowIcon",
          "rowCriticalIcon"
        ),
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
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
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <span className={cn(recipe("itemIndicator", "itemIndicatorMuted"))}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className={cn(recipe("itemIndicatorCheckIcon"))} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
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
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <span className={cn(recipe("itemIndicator", "itemIndicatorMuted"))}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className={cn(recipe("itemIndicatorRadioIcon"))} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn(recipe("menuSeparator"), className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto pl-4 group-data-[disabled]:opacity-60",
        recipe("shortcutText"),
        className
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        recipe("rowItem", "rowHighlight", "rowDisabled", "rowInset", "rowIcon"),
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className={cn("ml-auto", recipe("submenuChevronIcon"))} />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "min-w-48 overflow-hidden",
        recipe(
          "overlaySurface",
          "menuPadding",
          "bodyText",
          "dropdownOrigin",
          "overlayMotion"
        ),
        className
      )}
      data-slot="dropdown-menu-sub-content"
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
