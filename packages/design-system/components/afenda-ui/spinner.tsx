import { Loader2Icon } from "lucide-react"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

type SpinnerSize = "sm" | "md" | "lg"

const spinnerSizeClass = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
} satisfies Record<SpinnerSize, string>

type SpinnerProps = React.ComponentProps<"svg"> & {
  size?: SpinnerSize
}

function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      data-size={size}
      className={cn(
        "animate-spin text-current",
        spinnerSizeClass[size],
        recipe("motionReduce"),
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
export type { SpinnerProps, SpinnerSize }
