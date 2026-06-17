import { cn } from "@repo/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

const textVariants = cva("min-w-0", {
  variants: {
    align: {
      start: "text-left",
      center: "text-center",
      end: "text-right",
    },
    color: {
      primary: "text-text-primary",
      secondary: "text-text-secondary",
      tertiary: "text-text-tertiary",
      critical: "text-critical",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
    variant: {
      body: recipe("bodyText"),
      medium: recipe("bodyMediumText"),
      caption: recipe("captionText"),
      label: recipe("labelText"),
      metadata: recipe("metadataText"),
      title: recipe("titleText"),
    },
  },
  defaultVariants: {
    align: "start",
    color: "primary",
    truncate: false,
    variant: "body",
  },
});

interface TextProps
  extends Omit<React.ComponentProps<"p">, "color">,
    VariantProps<typeof textVariants> {
  readonly asChild?: boolean;
}

function Text({
  align,
  asChild = false,
  className,
  color,
  truncate,
  variant,
  ...props
}: TextProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "p";

  return (
    <Comp
      className={cn(
        textVariants({ align, color, truncate, variant }),
        className
      )}
      data-slot="text"
      {...props}
    />
  );
}

export { Text, textVariants };
export type { TextProps };
