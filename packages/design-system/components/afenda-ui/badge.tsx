import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 tabular-nums [&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0",
    recipe(
      "badgeText",
      "colorTransition",
      "focusRingOnly",
      "invalidState",
      "motionReduce"
    ),
  ],
  {
    variants: {
      tone: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        critical: "",
      },
      variant: {
        soft: "",
        outline: "bg-transparent",
        solid: "",
      },
    },
    compoundVariants: [
      {
        tone: "neutral",
        variant: "soft",
        className: "border-border-default bg-surface-muted text-text-primary",
      },
      {
        tone: "info",
        variant: "soft",
        className: "border-transparent bg-info-muted text-info",
      },
      {
        tone: "success",
        variant: "soft",
        className: "border-transparent bg-success-muted text-success",
      },
      {
        tone: "warning",
        variant: "soft",
        className: "border-transparent bg-warning-muted text-warning",
      },
      {
        tone: "critical",
        variant: "soft",
        className: "border-critical/30 bg-critical-muted text-text-primary",
      },
      {
        tone: "neutral",
        variant: "outline",
        className: "border-border-default bg-transparent text-text-secondary",
      },
      {
        tone: "info",
        variant: "outline",
        className: "border-border-default bg-transparent text-info",
      },
      {
        tone: "success",
        variant: "outline",
        className: "border-border-default bg-transparent text-success",
      },
      {
        tone: "warning",
        variant: "outline",
        className: "border-border-default bg-transparent text-warning",
      },
      {
        tone: "critical",
        variant: "outline",
        className: "border-critical/40 bg-transparent text-text-primary",
      },
      {
        tone: "neutral",
        variant: "solid",
        className: "border-transparent bg-surface-inverse text-text-inverse",
      },
      {
        tone: "info",
        variant: "solid",
        className: "border-transparent bg-info text-info-foreground",
      },
      {
        tone: "success",
        variant: "solid",
        className: "border-transparent bg-success text-success-foreground",
      },
      {
        tone: "warning",
        variant: "solid",
        className: "border-transparent bg-warning text-warning-foreground",
      },
      {
        tone: "critical",
        variant: "solid",
        className: "border-transparent bg-critical text-critical-foreground",
      },
    ],
    defaultVariants: {
      tone: "neutral",
      variant: "soft",
    },
  }
);

function Badge({
  className,
  tone,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "span";

  return (
    <Comp
      className={cn(badgeVariants({ tone, variant }), className)}
      data-slot="badge"
      {...props}
    />
  );
}

export { Badge, badgeVariants };
