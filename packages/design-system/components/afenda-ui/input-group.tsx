"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { type Button, buttonVariants } from "./button";
import { Input } from "./input";
import { recipe } from "./recipes";
import { Textarea } from "./textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn(
        "group/input-group relative m-0 flex h-[var(--button-height)] min-w-0 items-center p-0 outline-none has-[>textarea]:h-auto",
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",
        "has-[[data-slot=input-group-control]:focus-visible]:border-border-active has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30",
        "has-[[data-slot=input-group-control][aria-invalid=true]]:border-critical has-[[data-slot=input-group-control][aria-invalid=true]]:ring-critical/20 dark:has-[[data-slot=input-group-control][aria-invalid=true]]:ring-critical/40",
        "has-[[data-slot=input-group-control]:disabled]:border-border-subtle has-[[data-slot=input-group-control]:disabled]:bg-surface-muted has-[[data-slot=input-group-control]:disabled]:opacity-80",
        recipe("flatControlSurface", "colorTransition", "motionReduce"),
        className
      )}
      data-slot="input-group"
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  [
    "flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-text-secondary",
    "[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none",
    "group-data-[disabled=true]/input-group:opacity-50",
    "group-has-[[data-slot=input-group-control]:disabled]/input-group:cursor-not-allowed group-has-[[data-slot=input-group-control]:disabled]/input-group:opacity-50",
    recipe("bodyMediumText"),
  ],
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[var(--input-group-addon-button-offset)]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[var(--input-group-addon-button-offset)]",
        "block-start":
          "order-first w-full justify-start border-border-default border-b px-3 pt-3 pb-2 group-has-[>input]/input-group:pt-2.5",
        "block-end":
          "order-last w-full justify-start border-border-default border-t px-3 pt-2 pb-3 group-has-[>input]/input-group:pb-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot="input-group-addon"
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva("shrink-0 shadow-none", {
  variants: {
    size: {
      xs: "h-6 rounded-[var(--xforge-radius-sm)] px-2 has-[>svg]:px-2",
      sm: "h-8 rounded-[var(--xforge-radius-sm)] px-2.5 has-[>svg]:px-2.5",
      "icon-xs": "size-6 rounded-[var(--xforge-radius-sm)] p-0 has-[>svg]:p-0",
      "icon-sm": "size-8 rounded-[var(--xforge-radius-sm)] p-0 has-[>svg]:p-0",
    },
  },
  defaultVariants: {
    size: "xs",
  },
});

function InputGroupButton({
  className,
  type = "button",
  variant = "quiet",
  size = "xs",
  asChild: _asChild,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size: "default" }),
        inputGroupButtonVariants({ size }),
        className
      )}
      type={type}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-text-secondary",
        recipe("captionText", "mutedControlIcon"),
        className
      )}
      data-slot="input-group-text"
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:border-transparent focus-visible:ring-0",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
