import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot as SlotPrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { Separator } from "./separator"
import { recipe } from "./recipes"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col", recipe("motionReduce"), className)}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", recipe("motionReduce"), className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  [
    "group/item flex flex-wrap items-center rounded-[var(--xforge-radius-sm)] border border-transparent outline-none",
    "[a]:hover:bg-surface-hover [a]:transition-colors",
    "data-[interactive=true]:cursor-pointer",
    recipe("colorTransition", "focusRing", "motionReduce"),
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border-default bg-surface",
        muted: "bg-surface-muted",
        raised: "border-border-default bg-surface-raised shadow-xs",
      },
      size: {
        default: "gap-3 px-3 py-3",
        sm: "gap-2.5 px-3 py-2.5",
        lg: "gap-4 px-4 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  role,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : "div"

  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      role={role ?? (asChild ? undefined : "listitem")}
      className={cn(itemVariants({ variant, size }), recipe("bodyText"), className)}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start group-has-[[data-slot=item-description]]/item:translate-y-0.5 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent text-text-tertiary",
        icon: "size-8 rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface text-text-secondary [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface [&_img]:size-full [&_img]:object-cover",
        badge:
          "size-8 rounded-[var(--xforge-radius-sm)] bg-surface-muted text-text-secondary [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant }), recipe("motionReduce"), className)}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        recipe("motionReduce"),
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("flex w-fit items-center gap-2 text-text-primary", recipe("bodyMediumText"), className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-balance font-normal [&>a]:text-text-link [&>a]:underline [&>a]:underline-offset-4",
        recipe("captionText"),
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", recipe("motionReduce"), className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between gap-2", recipe("motionReduce"), className)}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn("flex basis-full items-center justify-between gap-2", recipe("motionReduce"), className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  itemVariants,
}
