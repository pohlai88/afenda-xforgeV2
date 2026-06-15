import { cn } from "@repo/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import { recipe } from "./recipes";
import { Separator } from "./separator";

const buttonGroupVariants = cva(
  [
    "m-0 flex w-fit min-w-0 items-stretch border-0 p-0",
    "[&>*]:relative [&>*]:focus-visible:z-10",
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
    "has-[>[data-slot=button-group]]:gap-2 [&>input]:flex-1",
    recipe("motionReduce"),
  ],
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"fieldset"> &
  VariantProps<typeof buttonGroupVariants>) {
  return (
    <fieldset
      className={cn(buttonGroupVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="button-group"
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? SlotPrimitive.Slot : "div";

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 rounded-[var(--button-radius)] border border-border-default bg-surface-muted px-[var(--button-padding-x)] text-text-secondary",
        recipe("buttonText", "mutedControlIcon"),
        className
      )}
      data-slot="button-group-text"
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        "!m-0 relative self-stretch bg-border-default data-[orientation=vertical]:h-auto",
        recipe("motionReduce"),
        className
      )}
      data-slot="button-group-separator"
      orientation={orientation}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
