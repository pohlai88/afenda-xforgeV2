import { cn } from "@repo/design-system/lib/utils";
import type * as React from "react";
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
