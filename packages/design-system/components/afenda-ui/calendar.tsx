"use client";

import { cn } from "../../lib/utils";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { type ComponentProps, useEffect, useRef } from "react";
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";
import { Button, buttonVariants } from "./button";
import { recipe } from "./recipes";

type CalendarComponents = NonNullable<
  ComponentProps<typeof DayPicker>["components"]
>;
type CalendarRootProps = Parameters<NonNullable<CalendarComponents["Root"]>>[0];
type CalendarChevronProps = Parameters<
  NonNullable<CalendarComponents["Chevron"]>
>[0];
type CalendarWeekNumberProps = Parameters<
  NonNullable<CalendarComponents["WeekNumber"]>
>[0];

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "quiet",
  formatters,
  components,
  ...props
}: ComponentProps<typeof DayPicker> & {
  buttonVariant?: ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      captionLayout={captionLayout}
      className={cn(
        "group/calendar bg-transparent p-3 [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        recipe("bodyText"),
        className
      )}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon-sm" }),
          "size-[var(--calendar-cell-size)] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon-sm" }),
          "size-[var(--calendar-cell-size)] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[var(--calendar-cell-size)] w-full items-center justify-center px-[var(--calendar-cell-size)]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[var(--calendar-cell-size)] w-full items-center justify-center gap-1.5",
          recipe("bodyMediumText"),
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-[var(--button-radius)] border border-border-default bg-surface-raised has-focus:border-border-active has-focus:ring-2 has-focus:ring-ring/30",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-surface-overlay opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none",
          captionLayout === "label"
            ? recipe("bodyMediumText")
            : "flex h-8 items-center gap-1 rounded-[var(--button-radius)] pr-1 pl-2 text-[length:var(--xforge-font-body-size)] [&>svg]:size-3.5 [&>svg]:text-text-secondary",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-[var(--xforge-radius-sm)] font-normal text-text-secondary",
          recipe("captionText"),
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[var(--calendar-cell-size)] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "select-none text-text-secondary",
          recipe("captionText"),
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-[var(--button-radius)]",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-[var(--button-radius)]"
            : "[&:first-child[data-selected=true]_button]:rounded-l-[var(--button-radius)]",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-[var(--button-radius)] bg-brand-primary/15",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "rounded-r-[var(--button-radius)] bg-brand-primary/15",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-[var(--button-radius)] bg-surface-muted text-text-primary data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-text-tertiary aria-selected:text-text-secondary",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-text-tertiary opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

function CalendarRoot({ className, rootRef, ...props }: CalendarRootProps) {
  return (
    <div
      className={cn(className)}
      data-slot="calendar"
      ref={rootRef}
      {...props}
    />
  );
}

function CalendarChevron({
  className,
  orientation,
  ...props
}: CalendarChevronProps) {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
  }

  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
  }

  return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
}

function CalendarWeekNumber({ children, ...props }: CalendarWeekNumberProps) {
  return (
    <td {...props}>
      <div className={cn(recipe("calendarWeekNumberCell"))}>
        {children}
      </div>
    </td>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <Button
      className={cn(
        "flex aspect-square size-auto w-full min-w-[var(--calendar-cell-size)] flex-col gap-1 font-normal leading-none",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-border-active group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-ring/30",
        "data-[selected-single=true]:bg-brand-primary data-[selected-single=true]:text-text-inverse",
        "data-[range-start=true]:rounded-l-[var(--button-radius)] data-[range-start=true]:bg-brand-primary data-[range-start=true]:text-text-inverse",
        "data-[range-end=true]:rounded-r-[var(--button-radius)] data-[range-end=true]:bg-brand-primary data-[range-end=true]:text-text-inverse",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-brand-primary/15 data-[range-middle=true]:text-text-primary",
        "[&>span]:text-[length:var(--xforge-font-caption-size)] [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      data-day={day.date.toLocaleDateString()}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      ref={ref}
      size="icon"
      variant="quiet"
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
