import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--button-radius)] outline-none active:translate-y-px",
    recipe(
      "buttonText",
      "interactiveTransition",
      "disabledAction",
      "invalidState",
      "focusRing",
      "motionReduce",
      "controlIcon"
    ),
    "motion-reduce:active:translate-y-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-primary-foreground hover:bg-brand-dark active:bg-brand-dark/90",
        secondary:
          "border border-border-default bg-surface-raised text-text-primary hover:bg-surface-hover active:bg-surface-active",
        quiet:
          "bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary active:bg-surface-active",
        critical:
          "bg-critical text-critical-foreground hover:opacity-90 active:opacity-85",
        link: "h-auto rounded-none px-0 py-0 text-text-link underline-offset-4 hover:underline active:text-text-link/80",
      },
      size: {
        default:
          "h-[var(--button-height)] px-[var(--button-padding-x)] py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-5 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";
  const resolvedType = asChild ? undefined : (type ?? "button");
  const resolvedClassName =
    variant === "link"
      ? cn("h-auto rounded-none px-0 py-0", className)
      : className;

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, className: resolvedClassName })
      )}
      data-slot="button"
      type={resolvedType}
      {...props}
    />
  );
}

export { Button, buttonVariants };
