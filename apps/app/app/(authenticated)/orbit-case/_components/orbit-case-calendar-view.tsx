"use client";

import { Badge, Button, blockRecipe, Calendar } from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { OrbitCaseCalendarDto, OrbitCaseDto } from "@repo/orbit-case";
import { formatOrbitCaseDueDateLabel } from "@repo/orbit-case";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { getCalendarBoard } from "@/app/actions/orbit-case/board";

interface OrbitCaseCalendarViewProps {
  initialCalendar: OrbitCaseCalendarDto;
}

const localDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const utcDateKeyToLocalDate = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const statusLabel = {
  backlog: "Backlog",
  ready: "Ready",
  doing: "Doing",
  waiting: "Waiting",
  done: "Done",
  cancelled: "Cancelled",
} as const;

const parseCalendarMonth = (month: string): { month: number; year: number } => {
  const [yearText, monthText] = month.split("-");
  return {
    year: Number(yearText),
    month: Number(monthText),
  };
};

export function OrbitCaseCalendarView({
  initialCalendar,
}: OrbitCaseCalendarViewProps) {
  const [calendar, setCalendar] = useState(initialCalendar);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isPending, startTransition] = useTransition();

  const { year, month } = parseCalendarMonth(calendar.month);
  const visibleMonth = useMemo(
    () => new Date(Date.UTC(year, month - 1, 1)),
    [month, year]
  );

  const dueDates = useMemo(
    () => calendar.days.map((day) => utcDateKeyToLocalDate(day.date)),
    [calendar.days]
  );

  const selectedDayCases = useMemo((): OrbitCaseDto[] => {
    if (!selectedDate) {
      return [];
    }

    const key = localDateKey(selectedDate);
    return calendar.days.find((day) => day.date === key)?.cases ?? [];
  }, [calendar.days, selectedDate]);

  const shiftMonth = (delta: number) => {
    const nextMonthIndex = month - 1 + delta;
    const nextDate = new Date(Date.UTC(year, nextMonthIndex, 1));
    const nextYear = nextDate.getUTCFullYear();
    const nextMonth = nextDate.getUTCMonth() + 1;

    startTransition(async () => {
      const result = await getCalendarBoard({
        year: nextYear,
        month: nextMonth,
      });

      if (result.ok) {
        setCalendar(result.data);
        setSelectedDate(undefined);
      }
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
      <section
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "grid content-start gap-3"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <Button
            disabled={isPending}
            onClick={() => shiftMonth(-1)}
            size="sm"
            variant="secondary"
          >
            Previous
          </Button>
          <p className="font-medium text-sm">{calendar.month}</p>
          <Button
            disabled={isPending}
            onClick={() => shiftMonth(1)}
            size="sm"
            variant="secondary"
          >
            Next
          </Button>
        </div>
        <Calendar
          mode="single"
          modifiers={{ due: dueDates }}
          modifiersClassNames={{
            due: "bg-primary/15 font-medium",
          }}
          month={visibleMonth}
          onMonthChange={() => undefined}
          onSelect={setSelectedDate}
          selected={selectedDate}
        />
      </section>

      <section
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "grid content-start gap-3"
        )}
      >
        <h3 className={blockRecipe("blockTitle")}>
          {selectedDate
            ? `Due ${formatOrbitCaseDueDateLabel(selectedDate.toISOString())}`
            : "Select a day"}
        </h3>
        {selectedDate && selectedDayCases.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No cases due on this day.
          </p>
        ) : null}
        {selectedDayCases.map((orbitCase) => (
          <Link href={`/orbit-case/${orbitCase.id}`} key={orbitCase.id}>
            <article className="rounded-md border bg-background p-3 text-sm transition-colors hover:bg-muted/30">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{orbitCase.title}</p>
                <Badge variant="outline">{statusLabel[orbitCase.status]}</Badge>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </div>
  );
}
