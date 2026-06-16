export const ORBIT_CASE_STATUSES = [
  "backlog",
  "ready",
  "doing",
  "waiting",
  "done",
  "cancelled",
] as const;

export type OrbitCaseStatus = (typeof ORBIT_CASE_STATUSES)[number];

export const ORBIT_CASE_PRIORITIES = [
  "none",
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export type OrbitCasePriority = (typeof ORBIT_CASE_PRIORITIES)[number];

/** Statuses shown on the default board and list (excludes cancelled). */
export const ORBIT_CASE_ACTIVE_STATUSES = [
  "backlog",
  "ready",
  "doing",
  "waiting",
  "done",
] as const satisfies readonly OrbitCaseStatus[];

export const ORBIT_CASE_BOARD_COLUMNS: readonly OrbitCaseStatus[] =
  ORBIT_CASE_ACTIVE_STATUSES;
