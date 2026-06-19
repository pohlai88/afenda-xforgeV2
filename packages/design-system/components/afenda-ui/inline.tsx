import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

const inlineVariants = cva(["flex min-w-0", recipe("motionReduce")], {
  variants: {
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    align: "center",
    gap: "sm",
    justify: "start",
    wrap: true,
  },
});

interface InlineProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof inlineVariants> {
  readonly asChild?: boolean;
}

function Inline({
  align,
  asChild = false,
  className,
  gap,
  justify,
  wrap,
  ...props
}: InlineProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "div";

  return (
    <Comp
      className={cn(inlineVariants({ align, gap, justify, wrap }), className)}
      data-slot="inline"
      {...props}
    />
  );
}

export { Inline, inlineVariants };
export type { InlineProps };
