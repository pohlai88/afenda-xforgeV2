"use client"

import { AspectRatio as AspectRatioPrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

function AspectRatio({
  className,
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={cn("overflow-hidden rounded-[inherit]", recipe("motionReduce"), className)}
      {...props}
    />
  )
}

export { AspectRatio }
