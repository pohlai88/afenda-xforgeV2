import { cn } from "../../lib/utils";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

interface FocusableProps extends React.ComponentProps<"div"> {
  readonly asChild?: boolean;
}

function Focusable({
  asChild = false,
  className,
  tabIndex = 0,
  ...props
}: FocusableProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "div";

  return (
    <Comp
      className={cn(
        "rounded-[var(--xforge-radius-sm)] outline-none",
        recipe("focusRingOnly", "motionReduce"),
        className
      )}
      data-slot="focusable"
      tabIndex={tabIndex}
      {...props}
    />
  );
}

export { Focusable };
export type { FocusableProps };
