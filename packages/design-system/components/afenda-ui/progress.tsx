"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

type ProgressTone = "brand" | "success" | "warning" | "danger" | "neutral"
type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  tone?: ProgressTone
}

const progressToneClass: Record<ProgressTone, string> = {
  brand: "bg-brand-primary",
  danger: "bg-status-danger",
  neutral: "bg-text-secondary",
  success: "bg-status-success",
  warning: "bg-status-warning",
}

function clampProgress(value: null | number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0
  }

  return Math.min(100, Math.max(0, value))
}

function Progress({
  className,
  value,
  tone = "brand",
  ...props
}: ProgressProps) {
  const safeValue = clampProgress(value)

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-tone={tone}
      value={safeValue}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-surface-muted",
        recipe("motionReduce"),
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-transform",
          progressToneClass[tone],
          recipe("motionReduce")
        )}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
export type { ProgressProps, ProgressTone }
