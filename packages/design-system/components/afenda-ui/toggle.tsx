"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

const toggleVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--button-radius)] outline-none",
    "bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary",
    "data-[state=on]:border-border-default data-[state=on]:bg-surface-raised data-[state=on]:text-text-primary",
    recipe(
      "buttonText",
      "colorTransition",
      "disabledAction",
      "invalidState",
      "focusRing",
      "motionReduce",
      "controlIcon"
    ),
  ],
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-border-default bg-surface-raised",
      },
      size: {
        default: "h-[var(--button-height)] min-w-9 px-2",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
