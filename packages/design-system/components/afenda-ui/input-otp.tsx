"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { type ComponentProps, useContext } from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

function InputOTP({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      className={cn(
        "disabled:cursor-not-allowed",
        "font-medium text-base tabular-nums tracking-[var(--input-otp-tracking)]",
        className
      )}
      containerClassName={cn(
        "flex items-center gap-2.5 has-disabled:opacity-50",
        recipe("motionReduce"),
        containerClassName
      )}
      data-slot="input-otp"
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        recipe("motionReduce"),
        className
      )}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      className={cn(
        "relative flex size-11 items-center justify-center rounded-[var(--button-radius)] border border-border-default bg-surface font-medium text-base text-text-primary tabular-nums tracking-[var(--input-otp-tracking)] outline-none",
        "data-[active=true]:z-10 data-[active=true]:border-border-active data-[active=true]:bg-surface-raised data-[active=true]:ring-2 data-[active=true]:ring-ring/30",
        "focus-visible:ring-2 focus-visible:ring-ring/30",
        "aria-invalid:border-critical aria-invalid:bg-critical/5 data-[active=true]:aria-invalid:border-critical data-[active=true]:aria-invalid:ring-critical/20 dark:data-[active=true]:aria-invalid:ring-critical/40",
        recipe("colorTransition", "motionReduce"),
        className
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
    </div>
  );
}

function InputOTPSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center px-1 text-[length:var(--xforge-font-body-size)] text-text-tertiary",
        recipe("motionReduce"),
        className
      )}
      data-slot="input-otp-separator"
      {...props}
    >
      <span aria-hidden="true">•</span>
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
