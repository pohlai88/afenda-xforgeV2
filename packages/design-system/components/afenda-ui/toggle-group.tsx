"use client";

import { cn } from "../../lib/utils";
import type { VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { type ComponentProps, createContext, useContext } from "react";
import { recipe } from "./recipes";
import { toggleVariants } from "./toggle";

type ToggleGroupSize = "default" | "lg" | "sm";
type ToggleGroupVariant = "default" | "outline";

const toggleGroupSizeAttributes = {
  default: { "data-size": "default" },
  lg: { "data-size": "lg" },
  sm: { "data-size": "sm" },
} as const satisfies Record<ToggleGroupSize, { readonly "data-size": string }>;

const toggleGroupVariantAttributes = {
  default: { "data-variant": "default" },
  outline: { "data-variant": "outline" },
} as const satisfies Record<
  ToggleGroupVariant,
  { readonly "data-variant": string }
>;

const ToggleGroupContext = createContext<{
  readonly size: ToggleGroupSize;
  readonly variant: ToggleGroupVariant;
}>({
  size: "default",
  variant: "default",
});

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  const resolvedSize = resolveToggleGroupSize(size);
  const resolvedVariant = resolveToggleGroupVariant(variant);

  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "group/toggle-group flex w-fit items-center gap-1 rounded-[var(--button-radius)]",
        recipe("motionReduce"),
        className
      )}
      data-slot="toggle-group"
      {...toggleGroupSizeAttributes[resolvedSize]}
      {...toggleGroupVariantAttributes[resolvedVariant]}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant: resolvedVariant, size: resolvedSize }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = useContext(ToggleGroupContext);
  const resolvedSize = context.size ?? resolveToggleGroupSize(size);
  const resolvedVariant = context.variant ?? resolveToggleGroupVariant(variant);

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
        className
      )}
      data-slot="toggle-group-item"
      {...toggleGroupSizeAttributes[resolvedSize]}
      {...toggleGroupVariantAttributes[resolvedVariant]}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

function resolveToggleGroupSize(
  size: VariantProps<typeof toggleVariants>["size"]
): ToggleGroupSize {
  return size === "lg" || size === "sm" ? size : "default";
}

function resolveToggleGroupVariant(
  variant: VariantProps<typeof toggleVariants>["variant"]
): ToggleGroupVariant {
  return variant === "outline" ? "outline" : "default";
}

export { ToggleGroup, ToggleGroupItem };
