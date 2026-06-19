"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

type ProgressTone = "neutral" | "info" | "success" | "warning" | "critical";
type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  tone?: ProgressTone;
};

const progressToneClass: Record<ProgressTone, string> = {
  critical: "bg-status-critical",
  info: "bg-info",
  neutral: "bg-text-secondary",
  success: "bg-status-success",
  warning: "bg-status-warning",
};

function clampProgress(value: null | number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function Progress({
  className,
  value,
  tone = "info",
  ...props
}: ProgressProps) {
  const safeValue = clampProgress(value);

  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-surface-muted",
        recipe("motionReduce"),
        className
      )}
      data-slot="progress"
      value={safeValue}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-transform",
          progressToneClass[tone],
          recipe("motionReduce")
        )}
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
export type { ProgressProps, ProgressTone };
