import { cn } from "../../lib/utils";
import { Loader2Icon } from "lucide-react";
import { recipe } from "./recipes";

type SpinnerSize = "sm" | "md" | "lg";

const spinnerSizeClass = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
} satisfies Record<SpinnerSize, string>;

type SpinnerProps = React.ComponentProps<"svg"> & {
  size?: SpinnerSize;
};

function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={cn(
        "animate-spin text-current",
        spinnerSizeClass[size],
        recipe("motionReduce"),
        className
      )}
      data-slot="spinner"
      role="status"
      {...props}
    />
  );
}

export { Spinner };
export type { SpinnerProps, SpinnerSize };
