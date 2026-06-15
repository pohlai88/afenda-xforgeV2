"use client"

import * as React from "react"
import { CircleIcon } from "lucide-react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-border-default bg-surface-raised text-brand-primary outline-none data-[state=checked]:border-brand-primary disabled:cursor-not-allowed disabled:opacity-50",
        recipe("colorTransition", "focusRing", "invalidState", "motionReduce"),
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex size-full items-center justify-center"
      >
        <CircleIcon className="size-2 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

function RadioGroupOption({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="radio-group-option"
      className={cn(
        "group flex cursor-pointer items-start gap-2.5 rounded-[var(--button-radius)] border border-border-default bg-surface-raised px-3 py-2.5 hover:bg-surface-hover has-[[data-slot=radio-group-item][data-state=checked]]:border-brand-primary/60 has-[[data-slot=radio-group-item][data-state=checked]]:bg-brand-primary/5 has-[[data-slot=radio-group-item]:disabled]:cursor-not-allowed has-[[data-slot=radio-group-item]:disabled]:opacity-50",
        recipe("colorTransition", "motionReduce"),
        className
      )}
      {...props}
    />
  )
}

function RadioGroupLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="radio-group-label"
      className={cn("block", recipe("bodyMediumText"), className)}
      {...props}
    />
  )
}

function RadioGroupDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="radio-group-description"
      className={cn("mt-0.5 block", recipe("captionText"), className)}
      {...props}
    />
  )
}

export {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupItem,
  RadioGroupLabel,
  RadioGroupOption,
}
