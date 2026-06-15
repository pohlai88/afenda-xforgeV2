import * as React from "react"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-[var(--button-radius)] bg-surface-muted",
        recipe("motionReduce"),
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
