"use client";

import { cn } from "@repo/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, MinusIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";
import { recipe } from "./recipes";

const checkboxVariants = cva(
  [
    "peer relative size-4 shrink-0 rounded-[var(--xforge-radius-xs)] border border-border-default bg-surface-raised outline-none before:absolute before:inset-[-10px] before:content-['']",
    recipe("interactiveTransition"),
    "disabled:cursor-not-allowed disabled:opacity-50",
    recipe("invalidState", "focusRing", "motionReduce"),
  ],
  {
    variants: {
      tone: {
        neutral:
          "data-[state=checked]:border-brand-primary data-[state=indeterminate]:border-brand-primary data-[state=checked]:bg-brand-primary data-[state=indeterminate]:bg-brand-primary data-[state=checked]:text-text-inverse data-[state=indeterminate]:text-text-inverse",
        info: "data-[tone=info]:data-[state=checked]:border-info data-[tone=info]:data-[state=indeterminate]:border-info data-[tone=info]:data-[state=checked]:bg-info data-[tone=info]:data-[state=indeterminate]:bg-info data-[tone=info]:data-[state=checked]:text-info-foreground data-[tone=info]:data-[state=indeterminate]:text-info-foreground",
        positive:
          "data-[tone=positive]:data-[state=checked]:border-success data-[tone=positive]:data-[state=indeterminate]:border-success data-[tone=positive]:data-[state=checked]:bg-success data-[tone=positive]:data-[state=indeterminate]:bg-success data-[tone=positive]:data-[state=checked]:text-success-foreground data-[tone=positive]:data-[state=indeterminate]:text-success-foreground",
        warning:
          "data-[tone=warning]:data-[state=checked]:border-warning data-[tone=warning]:data-[state=indeterminate]:border-warning data-[tone=warning]:data-[state=checked]:bg-warning data-[tone=warning]:data-[state=indeterminate]:bg-warning data-[tone=warning]:data-[state=checked]:text-warning-foreground data-[tone=warning]:data-[state=indeterminate]:text-warning-foreground",
        critical:
          "data-[tone=critical]:data-[state=checked]:border-danger data-[tone=critical]:data-[state=indeterminate]:border-danger data-[tone=critical]:data-[state=checked]:bg-danger data-[tone=critical]:data-[state=indeterminate]:bg-danger data-[tone=critical]:data-[state=checked]:text-danger-foreground data-[tone=critical]:data-[state=indeterminate]:text-danger-foreground",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

type CheckboxTone = NonNullable<VariantProps<typeof checkboxVariants>["tone"]>;
type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  tone?: CheckboxTone;
};

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, tone = "neutral", ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxVariants({ tone }), className)}
      data-slot="checkbox"
      data-tone={tone}
      ref={ref}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="grid place-content-center text-current transition-none"
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="size-3.5 [[data-state=indeterminate]_&]:hidden" />
        <MinusIcon className="hidden size-3.5 [[data-state=indeterminate]_&]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
export type { CheckboxProps, CheckboxTone };
