"use client";

import { cn } from "@repo/design-system/lib/utils";
import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      data-slot="radio-group"
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-border-default bg-surface-raised text-brand-primary outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand-primary",
        recipe("colorTransition", "focusRing", "invalidState", "motionReduce"),
        className
      )}
      data-slot="radio-group-item"
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className="relative flex size-full items-center justify-center"
        data-slot="radio-group-indicator"
      >
        <CircleIcon className="size-2 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

function RadioGroupOption({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: consumers compose RadioGroupItem inside this label option wrapper.
    <label
      className={cn(
        "group flex cursor-pointer items-start gap-2.5 rounded-[var(--button-radius)] border border-border-default bg-surface-raised px-3 py-2.5 hover:bg-surface-hover has-[[data-slot=radio-group-item]:disabled]:cursor-not-allowed has-[[data-slot=radio-group-item][data-state=checked]]:border-brand-primary/60 has-[[data-slot=radio-group-item][data-state=checked]]:bg-brand-primary/5 has-[[data-slot=radio-group-item]:disabled]:opacity-50",
        recipe("colorTransition", "motionReduce"),
        className
      )}
      data-slot="radio-group-option"
      {...props}
    />
  );
}

function RadioGroupLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("block", recipe("bodyMediumText"), className)}
      data-slot="radio-group-label"
      {...props}
    />
  );
}

function RadioGroupDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("mt-0.5 block", recipe("captionText"), className)}
      data-slot="radio-group-description"
      {...props}
    />
  );
}

export {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupItem,
  RadioGroupLabel,
  RadioGroupOption,
};
