"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Slider as SliderPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const ariaLabel = props["aria-label"];
  const ariaLabelledBy = props["aria-labelledby"];
  const values = getSliderValues(value, defaultValue, min);
  const thumbs = values.map((thumbValue, index) => ({
    ariaLabel: getSliderThumbLabel(ariaLabel, values.length, index),
    id: `${index + 1}:${thumbValue}`,
  }));

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
        recipe("motionReduce"),
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative grow overflow-hidden rounded-full bg-surface-muted data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5"
        data-slot="slider-track"
      >
        <SliderPrimitive.Range
          className="absolute bg-brand-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          data-slot="slider-range"
        />
      </SliderPrimitive.Track>
      {thumbs.map((thumb) => (
        <SliderPrimitive.Thumb
          aria-label={thumb.ariaLabel}
          aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
          className={cn(
            "block size-4 shrink-0 rounded-full border border-brand-primary bg-surface-raised outline-none hover:ring-4 hover:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
            recipe("colorTransition", "focusRingOnly", "motionReduce")
          )}
          data-slot="slider-thumb"
          key={thumb.id}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

function getSliderValues(
  value: React.ComponentProps<typeof SliderPrimitive.Root>["value"],
  defaultValue: React.ComponentProps<
    typeof SliderPrimitive.Root
  >["defaultValue"],
  min: number
) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(defaultValue)) {
    return defaultValue;
  }

  return [min];
}

function getSliderThumbLabel(
  ariaLabel: React.ComponentProps<typeof SliderPrimitive.Root>["aria-label"],
  thumbCount: number,
  index: number
) {
  if (typeof ariaLabel !== "string") {
    return undefined;
  }

  return thumbCount > 1 ? `${ariaLabel} ${index + 1}` : ariaLabel;
}

export { Slider };
