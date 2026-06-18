import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

const boxVariants = cva("min-w-0", {
  variants: {
    padding: {
      none: "",
      xs: "p-1",
      sm: "p-2",
      md: "p-3",
      lg: "p-[var(--card-padding)]",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-[var(--xforge-radius-sm)]",
      md: "rounded-[var(--card-radius)]",
      lg: "rounded-[var(--modal-radius)]",
    },
    surface: {
      none: "",
      flat: "bg-surface text-text-primary",
      muted: "bg-surface-muted text-text-primary",
      raised: recipe("panelSurface"),
      overlay: recipe("overlaySurface"),
    },
  },
  defaultVariants: {
    padding: "none",
    radius: "none",
    surface: "none",
  },
});

interface BoxProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof boxVariants> {
  readonly asChild?: boolean;
}

function Box({
  asChild = false,
  className,
  padding,
  radius,
  surface,
  ...props
}: BoxProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "div";

  return (
    <Comp
      className={cn(boxVariants({ padding, radius, surface }), className)}
      data-slot="box"
      {...props}
    />
  );
}

export { Box, boxVariants };
export type { BoxProps };
