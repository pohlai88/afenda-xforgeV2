"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border-default bg-surface-muted p-0.5 outline-none data-[state=checked]:border-brand-primary data-[state=checked]:bg-brand-primary disabled:cursor-not-allowed disabled:opacity-50",
        recipe("colorTransition", "focusRing", "motionReduce"),
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-surface-raised shadow-xs ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
          recipe("motionReduce")
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
