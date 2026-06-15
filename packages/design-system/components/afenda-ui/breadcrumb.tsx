import { cn } from "@repo/design-system/lib/utils";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "flex min-w-0 items-center gap-1 overflow-hidden whitespace-nowrap text-text-secondary sm:gap-1.5",
        recipe("captionText"),
        className
      )}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "inline-flex min-w-0 shrink-0 items-center gap-1.5",
        recipe("motionReduce"),
        className
      )}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? SlotPrimitive.Slot : "a";

  return (
    <Comp
      className={cn(
        "min-w-0 truncate rounded-[var(--xforge-radius-sm)] text-text-secondary hover:text-text-primary",
        recipe("colorTransition", "focusRingOnly"),
        className
      )}
      data-slot="breadcrumb-link"
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      className={cn(
        "min-w-0 truncate font-medium text-text-primary",
        recipe("captionText"),
        className
      )}
      data-slot="breadcrumb-page"
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      aria-hidden="true"
      className={cn(
        "shrink-0 text-text-tertiary [&>svg]:size-3.5",
        recipe("motionReduce"),
        className
      )}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center text-text-tertiary",
        recipe("motionReduce"),
        className
      )}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}
    >
      <MoreHorizontalIcon className="size-3.5" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
