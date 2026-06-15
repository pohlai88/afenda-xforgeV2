import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

type KbdSize = "sm" | "md"

const kbdSizeClass = {
  sm: "h-4 min-w-4 px-1",
  md: "h-5 min-w-5 px-1",
} satisfies Record<KbdSize, string>

type KbdProps = React.ComponentProps<"kbd"> & {
  size?: KbdSize
}

function Kbd({ className, size = "md", ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      data-size={size}
      className={cn(
        "pointer-events-none inline-flex w-fit select-none items-center justify-center gap-1 rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface-muted font-sans text-text-secondary",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:border-text-inverse/20 [[data-slot=tooltip-content]_&]:bg-text-inverse/10 [[data-slot=tooltip-content]_&]:text-text-inverse",
        kbdSizeClass[size],
        recipe("shortcutText"),
        className
      )}
      {...props}
    />
  )
}

function KbdSequence({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kbd-sequence"
      className={cn("inline-flex items-center gap-1", recipe("motionReduce"), className)}
      {...props}
    />
  )
}

const KbdGroup = KbdSequence

export { Kbd, KbdGroup, KbdSequence }
export type { KbdProps, KbdSize }
