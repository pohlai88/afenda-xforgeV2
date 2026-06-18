import { cn } from "../../lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import type * as React from "react";
import { buttonVariants } from "./button";
import { recipe } from "./recipes";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "mx-auto flex w-full justify-center",
        recipe("motionReduce"),
        className
      )}
      data-slot="pagination"
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "flex flex-row items-center gap-1",
        recipe("motionReduce"),
        className
      )}
      data-slot="pagination-content"
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("shrink-0", className)}
      data-slot="pagination-item"
      {...props}
    />
  );
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<"button">, "type"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "quiet",
          size: "icon-sm",
        }),
        "min-w-8 tabular-nums",
        isActive &&
          "pointer-events-none border-border-active bg-surface-raised text-text-primary",
        recipe("motionReduce"),
        className
      )}
      data-active={isActive ? "" : undefined}
      data-slot="pagination-link"
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("w-auto gap-1 px-2.5 sm:pl-2", className)}
      {...props}
    >
      <ChevronLeftIcon className={cn(recipe("paginationIcon"))} />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("w-auto gap-1 px-2.5 sm:pr-2", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon className={cn(recipe("paginationIcon"))} />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center text-text-tertiary",
        recipe("captionText", "motionReduce"),
        className
      )}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <MoreHorizontalIcon
        aria-hidden="true"
        className={cn(recipe("paginationIcon"))}
      />
      <span className={cn(recipe("visuallyHidden"))}>More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
