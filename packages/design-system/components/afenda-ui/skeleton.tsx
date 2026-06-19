import type * as React from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--button-radius)] bg-surface-muted",
        recipe("motionReduce"),
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
