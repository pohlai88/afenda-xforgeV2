import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

const stackVariants = cva(["flex min-w-0 flex-col", recipe("motionReduce")], {
  variants: {
    align: {
      stretch: "items-stretch",
      start: "items-start",
      center: "items-center",
      end: "items-end",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-6",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
  },
  defaultVariants: {
    align: "stretch",
    gap: "md",
    justify: "start",
  },
});

interface StackProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof stackVariants> {
  readonly asChild?: boolean;
}

function Stack({
  align,
  asChild = false,
  className,
  gap,
  justify,
  ...props
}: StackProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "div";

  return (
    <Comp
      className={cn(stackVariants({ align, gap, justify }), className)}
      data-slot="stack"
      {...props}
    />
  );
}

export { Stack, stackVariants };
export type { StackProps };
