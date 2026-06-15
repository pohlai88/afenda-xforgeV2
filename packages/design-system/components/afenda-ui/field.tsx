import { cn } from "@repo/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Label } from "./label";
import { recipe } from "./recipes";
import { Separator } from "./separator";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn(
        "flex flex-col has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        recipe("sectionGap"),
        className
      )}
      data-slot="field-set"
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & {
  variant?: "legend" | "label";
}) {
  return (
    <legend
      className={cn(
        "mb-2 data-[variant=label]:mb-1",
        variant === "legend" ? recipe("bodyMediumText") : recipe("labelText"),
        className
      )}
      data-slot="field-legend"
      data-variant={variant}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        recipe("sectionGap"),
        className
      )}
      data-slot="field-group"
      {...props}
    />
  );
}

const fieldVariants = cva("group/field flex w-full gap-3", {
  variants: {
    orientation: {
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center has-[>[data-slot=field-content]]:items-start [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "@md/field-group:flex-row flex-col @md/field-group:items-center @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:[&>*]:w-auto [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"fieldset"> & VariantProps<typeof fieldVariants>) {
  return (
    <fieldset
      className={cn(
        "m-0 min-w-0 border-0 p-0",
        fieldVariants({ orientation }),
        recipe("fieldGap"),
        className
      )}
      data-orientation={orientation}
      data-slot="field"
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-content flex flex-1 flex-col leading-snug",
        recipe("fieldGap"),
        className
      )}
      data-slot="field-content"
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-[var(--xforge-radius-sm)] has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:border-brand-primary/60 has-data-[state=checked]:bg-brand-primary/5",
        className
      )}
      data-slot="field-label"
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        recipe("bodyMediumText"),
        className
      )}
      data-slot="field-title"
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-text-primary [&>a]:rounded-[var(--xforge-radius-sm)] [&>a]:underline [&>a]:underline-offset-4",
        recipe("captionText", "focusRingOnly"),
        className
      )}
      data-slot="field-description"
      {...props}
    />
  );
}

function FieldHint({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <FieldDescription className={className} data-slot="field-hint" {...props} />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative -my-2 h-5", recipe("captionText"), className)}
      data-content={!!children}
      data-slot="field-separator"
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children ? (
        <span
          className="relative mx-auto block w-fit bg-surface px-2 text-text-secondary"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      ) : null}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = getFieldErrorContent(children, errors);

  if (!content) {
    return null;
  }

  return (
    <div
      className={cn(recipe("captionText"), "text-danger", className)}
      data-slot="field-error"
      role="alert"
      {...props}
    >
      {content}
    </div>
  );
}

function FieldRequired({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn("text-danger", className)}
      data-slot="field-required"
      {...props}
    >
      *
    </span>
  );
}

function getFieldErrorContent(
  children: React.ReactNode,
  errors: Array<{ message?: string } | undefined> | undefined
) {
  if (children) {
    return children;
  }

  if (!errors?.length) {
    return null;
  }

  const uniqueErrors = [
    ...new Map(errors.map((error) => [error?.message, error])).values(),
  ];

  if (uniqueErrors.length === 1) {
    return uniqueErrors[0]?.message;
  }

  return (
    <ul className="ml-4 flex list-disc flex-col gap-1">
      {uniqueErrors.map((error) =>
        error?.message ? <li key={error.message}>{error.message}</li> : null
      )}
    </ul>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldHint,
  FieldLabel,
  FieldLegend,
  FieldRequired,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
