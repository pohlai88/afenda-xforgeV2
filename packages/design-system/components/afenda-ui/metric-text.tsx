import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

const metricTextVariants = cva(
  [
    "min-w-0 font-semibold tabular-nums tracking-normal",
    recipe("motionReduce"),
  ],
  {
    variants: {
      size: {
        sm: "text-[length:var(--metric-text-size-sm)] leading-6",
        md: "text-[length:var(--metric-text-size-md)] leading-7",
        lg: "text-[length:var(--metric-text-size-lg)] leading-9",
      },
      color: {
        primary: "text-text-primary",
        secondary: "text-text-secondary",
        critical: "text-critical",
        success: "text-success",
        warning: "text-warning",
        info: "text-info",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
    },
  }
);

interface MetricTextProps
  extends Omit<React.ComponentProps<"strong">, "color">,
    VariantProps<typeof metricTextVariants> {
  readonly asChild?: boolean;
}

function MetricText({
  asChild = false,
  className,
  color,
  size,
  ...props
}: MetricTextProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "strong";

  return (
    <Comp
      className={cn(metricTextVariants({ color, size }), className)}
      data-slot="metric-text"
      {...props}
    />
  );
}

export { MetricText, metricTextVariants };
export type { MetricTextProps };
