import type * as React from "react";
import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

function Table({
  className,
  variant = "panel",
  ...props
}: React.ComponentProps<"table"> & {
  variant?: "panel" | "plain";
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto",
        variant === "panel" && recipe("panelSurface"),
        variant === "plain" &&
          "rounded-[var(--card-radius)] border border-border-default bg-surface-raised text-text-primary",
        className
      )}
      data-slot="table-container"
    >
      <table
        className={cn("w-full caption-bottom tabular-nums", recipe("bodyText"))}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-[var(--xforge-z-raised)] [&_tr]:border-border-default [&_tr]:border-b",
        className
      )}
      data-slot="table-header"
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn(
        "border-border-default border-t bg-surface-muted font-medium [&>tr]:last:border-b-0",
        className
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-border-default border-b transition-colors hover:bg-surface-hover data-[state=selected]:bg-surface-active motion-reduce:transition-none",
        className
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "sticky top-0 z-[var(--xforge-z-raised)] h-10 whitespace-nowrap bg-surface-muted px-3 text-left align-middle font-medium text-text-secondary [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[var(--table-checkbox-offset)]",
        recipe("captionText"),
        className
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "h-10 whitespace-nowrap px-3 py-2 align-middle text-text-primary [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[var(--table-checkbox-offset)]",
        className
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn("mt-3", recipe("captionText"), className)}
      data-slot="table-caption"
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
