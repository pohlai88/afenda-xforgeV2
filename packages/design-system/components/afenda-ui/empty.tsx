import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center text-balance rounded-[var(--card-radius)] border border-border-default border-dashed bg-surface-raised/60 p-6 text-center md:p-10",
        recipe("sectionGap", "bodyText"),
        className
      )}
      data-slot="empty"
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      data-slot="empty-header"
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  [
    "mb-1 flex shrink-0 items-center justify-center text-text-secondary",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent [&_svg:not([class*='size-'])]:size-8",
        icon: "size-10 rounded-[var(--xforge-radius-md)] border border-border-default bg-surface-muted [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      className={cn(
        emptyMediaVariants({ variant }),
        recipe("motionReduce"),
        className
      )}
      data-slot="empty-media"
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(recipe("titleText"), className)}
      data-slot="empty-title"
      {...props}
    />
  );
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-sm text-balance [&>a]:rounded-[var(--xforge-radius-sm)] [&>a]:text-text-link [&>a]:underline [&>a]:underline-offset-4",
        recipe("captionText", "focusRingOnly"),
        className
      )}
      data-slot="empty-description"
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-3 text-balance",
        recipe("captionText"),
        className
      )}
      data-slot="empty-content"
      {...props}
    />
  );
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
