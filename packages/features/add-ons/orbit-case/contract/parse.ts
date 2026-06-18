import {
  ORBIT_CASE_PRIORITIES,
  ORBIT_CASE_STATUSES,
  type OrbitCasePriority,
  type OrbitCaseStatus,
} from "./status";

const statusSet = new Set<string>(ORBIT_CASE_STATUSES);
const prioritySet = new Set<string>(ORBIT_CASE_PRIORITIES);

const isOrbitCaseStatus = (value: string): value is OrbitCaseStatus =>
  statusSet.has(value);

const isOrbitCasePriority = (value: string): value is OrbitCasePriority =>
  prioritySet.has(value);

export const parseOrbitCaseStatus = (value: unknown): OrbitCaseStatus | null =>
  typeof value === "string" && isOrbitCaseStatus(value) ? value : null;

export const parseOrbitCasePriority = (
  value: unknown
): OrbitCasePriority | null =>
  typeof value === "string" && isOrbitCasePriority(value) ? value : null;
