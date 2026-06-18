import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";
import { Separator } from "./separator";

function ItemGroup({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "group/item-group m-0 flex list-none flex-col p-0",
        recipe("motionReduce"),
        className
      )}
      data-slot="item-group"
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("my-0", recipe("motionReduce"), className)}
      data-slot="item-separator"
      orientation="horizontal"
      {...props}
    />
  );
}

const itemVariants = cva(
  [
    "group/item flex flex-wrap items-center rounded-[var(--xforge-radius-sm)] border border-transparent outline-none",
    "[a]:transition-colors [a]:hover:bg-surface-hover",
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
);

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  role,
  ...props
}: React.ComponentProps<"li"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : "li";

  return (
    <Comp
      className={cn(
        itemVariants({ variant, size }),
        recipe("bodyText"),
        className
      )}
      data-slot="item"
      role={role}
      {...props}
    />
  );
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
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
);

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      className={cn(
        itemMediaVariants({ variant }),
        recipe("motionReduce"),
        className
      )}
      data-slot="item-media"
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        recipe("motionReduce"),
        className
      )}
      data-slot="item-content"
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 text-text-primary",
        recipe("bodyMediumText"),
        className
      )}
      data-slot="item-title"
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "line-clamp-2 text-balance font-normal [&>a]:text-text-link [&>a]:underline [&>a]:underline-offset-4",
        recipe("captionText"),
        className
      )}
      data-slot="item-description"
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        recipe("motionReduce"),
        className
      )}
      data-slot="item-actions"
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        recipe("motionReduce"),
        className
      )}
      data-slot="item-header"
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        recipe("motionReduce"),
        className
      )}
      data-slot="item-footer"
      {...props}
    />
  );
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
};
