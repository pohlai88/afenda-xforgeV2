import "server-only";

import type { OrbitCaseTimelineResult } from "../../contract/orbit-case.types";
import { listOrbitCases } from "../work/orbit-cases";
import { groupOrbitCasesForTimeline } from "./board-timeline-utils";

export const getOrbitCaseTimeline = async (
  organizationId: string,
  referenceDate: Date = new Date()
): Promise<OrbitCaseTimelineResult> => {
  const cases = await listOrbitCases(organizationId, {
    includeCancelled: false,
  });

  return {
    groups: groupOrbitCasesForTimeline(cases, referenceDate),
  };
};
