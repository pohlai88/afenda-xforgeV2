"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Label as LabelPrimitive } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";
import { recipe } from "./recipes";

const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      className={cn(
        "inline-flex select-none items-center gap-2",
        recipe("labelText"),
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      data-slot="label"
      ref={ref}
      {...props}
    />
  );
});

Label.displayName = "Label";

export { Label };
