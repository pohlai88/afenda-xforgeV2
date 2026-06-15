import * as React from "react"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 py-1 selection:bg-brand-primary selection:text-text-inverse placeholder:text-text-tertiary file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-[length:var(--xforge-font-body-size)] file:font-medium file:text-text-primary",
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
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
