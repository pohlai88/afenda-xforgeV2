import type {
  OrbitCaseRecord,
  OrbitCaseTimelineBucket,
  OrbitCaseTimelineGroup,
} from "../../contract/orbit-case.types";

export const ORBIT_CASE_TIMELINE_BUCKET_LABELS: Record<
  OrbitCaseTimelineBucket,
  string
> = {
  overdue: "Overdue",
  today: "Today",
  this_week: "This week",
  later: "Later",
  no_due_date: "No due date",
};

export const ORBIT_CASE_TIMELINE_BUCKET_ORDER: readonly OrbitCaseTimelineBucket[] =
  ["overdue", "today", "this_week", "later", "no_due_date"];

const startOfUtcDay = (value: Date): Date =>
  new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
  );

const addUtcDays = (value: Date, days: number): Date => {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

export const classifyOrbitCaseTimelineBucket = (
  dueAt: Date | null,
  referenceDate: Date
): OrbitCaseTimelineBucket => {
  if (dueAt === null) {
    return "no_due_date";
  }

  const todayStart = startOfUtcDay(referenceDate);
  const tomorrowStart = addUtcDays(todayStart, 1);
  const weekEndExclusive = addUtcDays(todayStart, 8);
  const dueStart = startOfUtcDay(dueAt);

  if (dueStart < todayStart) {
    return "overdue";
  }

  if (dueStart < tomorrowStart) {
    return "today";
  }

  if (dueStart < weekEndExclusive) {
    return "this_week";
  }

  return "later";
};

export const groupOrbitCasesForTimeline = (
  cases: readonly OrbitCaseRecord[],
  referenceDate: Date
): OrbitCaseTimelineGroup[] => {
  const buckets = new Map<OrbitCaseTimelineBucket, OrbitCaseRecord[]>();

  for (const bucket of ORBIT_CASE_TIMELINE_BUCKET_ORDER) {
    buckets.set(bucket, []);
  }

  for (const orbitCaseRecord of cases) {
    const bucket = classifyOrbitCaseTimelineBucket(
      orbitCaseRecord.dueAt,
      referenceDate
    );
    buckets.get(bucket)?.push(orbitCaseRecord);
  }

  const sortByDueThenCreated = (
    left: OrbitCaseRecord,
    right: OrbitCaseRecord
  ): number => {
    const leftDue = left.dueAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const rightDue = right.dueAt?.getTime() ?? Number.MAX_SAFE_INTEGER;

    if (leftDue !== rightDue) {
      return leftDue - rightDue;
    }

    return left.createdAt.getTime() - right.createdAt.getTime();
  };

  return ORBIT_CASE_TIMELINE_BUCKET_ORDER.map((bucket) => {
    const bucketCases = [...(buckets.get(bucket) ?? [])];
    bucketCases.sort(sortByDueThenCreated);

    return {
      bucket,
      label: ORBIT_CASE_TIMELINE_BUCKET_LABELS[bucket],
      cases: bucketCases,
    };
  });
};

export const toUtcDateKey = (value: Date): string => {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatOrbitCaseCalendarMonth = (
  year: number,
  month: number
): string => `${year}-${String(month).padStart(2, "0")}`;
