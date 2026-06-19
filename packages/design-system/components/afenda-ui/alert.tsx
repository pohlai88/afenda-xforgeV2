import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-[var(--xforge-radius-md)] border px-4 py-3",
    "has-[>svg]:grid-cols-[var(--xforge-space-5)_1fr] has-[>svg]:gap-x-3",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    recipe("bodyText"),
  ],
  {
    variants: {
      tone: {
        neutral: "border-border-default bg-surface-raised text-text-primary",
        info: "border-info/30 bg-info-muted text-info",
        success: "border-success/30 bg-success-muted text-success",
        warning: "border-warning/30 bg-warning-muted text-warning",
        critical: "border-critical/30 bg-critical-muted text-critical",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

type AlertTone = NonNullable<VariantProps<typeof alertVariants>["tone"]>;

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    urgency?: "assertive" | "polite";
  };

function Alert({
  className,
  tone = "neutral",
  urgency = tone === "critical" ? "assertive" : "polite",
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ tone }), className)}
      data-slot="alert"
      role={urgency === "assertive" ? "alert" : "status"}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 line-clamp-1 min-h-4",
        recipe("bodyMediumText"),
        className
      )}
      data-slot="alert-title"
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-current/80",
        recipe("captionText"),
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle, alertVariants };
export type { AlertProps, AlertTone };
