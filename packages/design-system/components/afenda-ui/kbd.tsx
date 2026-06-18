import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

type KbdSize = "sm" | "md";

const kbdSizeClass = {
  sm: "h-4 min-w-4 px-1",
  md: "h-5 min-w-5 px-1",
} satisfies Record<KbdSize, string>;

type KbdProps = React.ComponentProps<"kbd"> & {
  size?: KbdSize;
};

function Kbd({ className, size = "md", ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex w-fit select-none items-center justify-center gap-1 rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface-muted font-sans text-text-secondary",
        "[&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none",
        "[[data-slot=tooltip-content]_&]:border-text-inverse/20 [[data-slot=tooltip-content]_&]:bg-text-inverse/10 [[data-slot=tooltip-content]_&]:text-text-inverse",
        kbdSizeClass[size],
        recipe("shortcutText"),
        className
      )}
      data-slot="kbd"
      {...props}
    />
  );
}

function KbdSequence({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        recipe("motionReduce"),
        className
      )}
      data-slot="kbd-sequence"
      {...props}
    />
  );
}

const KbdGroup = KbdSequence;

export { Kbd, KbdGroup, KbdSequence };
export type { KbdProps, KbdSize };
