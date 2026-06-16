import "server-only";

import type { OrbitCaseCalendarResult } from "../../contract/orbit-case.types";
import { listOrbitCases } from "../work/orbit-cases";
import {
  formatOrbitCaseCalendarMonth,
  toUtcDateKey,
} from "./board-timeline-utils";

export const getOrbitCaseCalendar = async (
  organizationId: string,
  year: number,
  month: number
): Promise<OrbitCaseCalendarResult> => {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const cases = await listOrbitCases(organizationId, {
    dueFrom: monthStart,
    dueTo: monthEnd,
    includeCancelled: false,
  });

  const dayMap = new Map<string, typeof cases>();

  for (const orbitCaseRecord of cases) {
    if (!orbitCaseRecord.dueAt) {
      continue;
    }

    const dateKey = toUtcDateKey(orbitCaseRecord.dueAt);
    const existing = dayMap.get(dateKey) ?? [];
    existing.push(orbitCaseRecord);
    dayMap.set(dateKey, existing);
  }

  const days = [...dayMap.entries()]
    .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
    .map(([date, dayCases]) => ({
      date,
      cases: dayCases,
    }));

  return {
    month: formatOrbitCaseCalendarMonth(year, month),
    days,
  };
};
