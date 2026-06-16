import {
  ORBIT_CASE_PRIORITIES,
  ORBIT_CASE_STATUSES,
  type OrbitCasePriority,
  type OrbitCaseStatus,
} from "./status";

const statusSet = new Set<string>(ORBIT_CASE_STATUSES);
const prioritySet = new Set<string>(ORBIT_CASE_PRIORITIES);

export const parseOrbitCaseStatus = (value: unknown): OrbitCaseStatus | null =>
  typeof value === "string" && statusSet.has(value)
    ? (value as OrbitCaseStatus)
    : null;

export const parseOrbitCasePriority = (
  value: unknown
): OrbitCasePriority | null =>
  typeof value === "string" && prioritySet.has(value)
    ? (value as OrbitCasePriority)
    : null;
