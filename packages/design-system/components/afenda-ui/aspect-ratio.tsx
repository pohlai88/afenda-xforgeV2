"use client";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

function AspectRatio({
  className,
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return (
    <AspectRatioPrimitive.Root
      className={cn(
        "overflow-hidden rounded-[inherit]",
        recipe("motionReduce"),
        className
      )}
      data-slot="aspect-ratio"
      {...props}
    />
  );
}

export { AspectRatio };
