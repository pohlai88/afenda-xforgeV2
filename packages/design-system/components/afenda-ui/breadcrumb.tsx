import * as React from "react"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { Slot as SlotPrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex min-w-0 items-center gap-1 overflow-hidden whitespace-nowrap text-text-secondary sm:gap-1.5",
        recipe("captionText"),
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        "inline-flex min-w-0 shrink-0 items-center gap-1.5",
        recipe("motionReduce"),
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? SlotPrimitive.Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "min-w-0 truncate rounded-[var(--xforge-radius-sm)] text-text-secondary hover:text-text-primary",
        recipe("colorTransition", "focusRingOnly"),
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn(
        "min-w-0 truncate font-medium text-text-primary",
        recipe("captionText"),
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "shrink-0 text-text-tertiary [&>svg]:size-3.5",
        recipe("motionReduce"),
        className
      )}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center text-text-tertiary",
        recipe("motionReduce"),
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon className="size-3.5" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
