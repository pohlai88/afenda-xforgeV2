import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

const gridVariants = cva(["grid min-w-0", recipe("motionReduce")], {
  variants: {
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
      auto: "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--grid-auto-column-min)),1fr))]",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-6",
    },
  },
  defaultVariants: {
    align: "stretch",
    columns: 1,
    gap: "md",
  },
});

interface GridProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof gridVariants> {
  readonly asChild?: boolean;
}

function Grid({
  align,
  asChild = false,
  className,
  columns,
  gap,
  ...props
}: GridProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "div";

  return (
    <Comp
      className={cn(gridVariants({ align, columns, gap }), className)}
      data-slot="grid"
      {...props}
    />
  );
}

export { Grid, gridVariants };
export type { GridProps };
