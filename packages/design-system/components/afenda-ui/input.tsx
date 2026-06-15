import { cn } from "@repo/design-system/lib/utils";
import { type ComponentProps, forwardRef } from "react";
import { recipe } from "./recipes";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex w-full min-w-0 py-1 selection:bg-brand-primary selection:text-text-inverse file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-[length:var(--xforge-font-body-size)] file:text-text-primary placeholder:text-text-tertiary",
          recipe(
            "flatControlSurface",
            "controlDefaultSize",
            "controlText",
            "colorTransition",
            "disabledControl",
            "readOnlyControl",
            "motionReduce",
            "focusRing",
            "invalidState"
          ),
          className
        )}
        data-slot="input"
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
