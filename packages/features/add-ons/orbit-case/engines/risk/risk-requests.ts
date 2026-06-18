import "server-only";

import { database, orbitRiskRequest } from "@repo/database";
import type { OrbitRiskRequestRecord } from "../../contract/orbit-case.types";
import {
  createTypedMorphReads,
  defineTwoFieldMorphMapper,
} from "../morph/create-typed-morph-reads";

const mapRiskRequestRow =
  defineTwoFieldMorphMapper<OrbitRiskRequestRecord>("riskLevel", "owner");

const reads = createTypedMorphReads(orbitRiskRequest, mapRiskRequestRow);

export const getRiskRequestById = reads.getById;
export const listRiskRequestsForOrg = reads.listForOrg;
