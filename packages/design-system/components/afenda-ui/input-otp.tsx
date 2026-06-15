"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2.5 has-disabled:opacity-50",
        recipe("motionReduce"),
        containerClassName
      )}
      className={cn(
        "disabled:cursor-not-allowed",
        "text-base font-medium tabular-nums tracking-[0.05em]",
        className
      )}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", recipe("motionReduce"), className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-11 items-center justify-center rounded-[var(--button-radius)] border border-border-default bg-surface text-base font-medium tabular-nums tracking-[0.05em] text-text-primary outline-none",
        "data-[active=true]:z-10 data-[active=true]:border-border-active data-[active=true]:bg-surface-raised data-[active=true]:ring-2 data-[active=true]:ring-ring/30",
        "focus-visible:ring-2 focus-visible:ring-ring/30",
        "aria-invalid:border-danger aria-invalid:bg-danger/5 data-[active=true]:aria-invalid:border-danger data-[active=true]:aria-invalid:ring-danger/20 dark:data-[active=true]:aria-invalid:ring-danger/40",
        recipe("colorTransition", "motionReduce"),
        className
      )}
      {...props}
    >
      {char}
    </div>
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn(
        "flex items-center px-1 text-[13px] text-text-tertiary",
        recipe("motionReduce"),
        className
      )}
      {...props}
    >
      <span aria-hidden="true">•</span>
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
