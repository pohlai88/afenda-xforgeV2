import { type ComponentProps, forwardRef } from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

const textareaDensityVariants = {
  compact: "px-2.5 py-1.5",
  comfortable: "px-3 py-2",
  spacious: "px-4 py-3",
} as const;

const Textarea = forwardRef<
  HTMLTextAreaElement,
  ComponentProps<"textarea"> & {
    density?: keyof typeof textareaDensityVariants;
  }
>(({ className, density = "comfortable", ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full min-w-0 resize-y placeholder:text-text-tertiary",
        recipe(
          "flatControlSurface",
          "controlText",
          "colorTransition",
          "disabledControl",
          "readOnlyControl",
          "motionReduce"
        ),
        textareaDensityVariants[density],
        recipe("focusRing", "invalidState"),
        className
      )}
      data-slot="textarea"
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
