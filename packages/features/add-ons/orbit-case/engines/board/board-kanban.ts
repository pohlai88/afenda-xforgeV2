import "server-only";

import type { OrbitCaseBoardResult } from "../../contract/orbit-case.types";
import { ORBIT_CASE_BOARD_COLUMNS } from "../../contract/status";
import { listOrbitCases } from "../work/orbit-cases";

export const getOrbitCaseBoard = async (
  organizationId: string
): Promise<OrbitCaseBoardResult> => {
  const cases = await listOrbitCases(organizationId, {
    includeCancelled: false,
  });

  return {
    columns: ORBIT_CASE_BOARD_COLUMNS.map((status) => ({
      status,
      cases: cases.filter(
        (orbitCaseRecord) => orbitCaseRecord.status === status
      ),
    })),
  };
};
