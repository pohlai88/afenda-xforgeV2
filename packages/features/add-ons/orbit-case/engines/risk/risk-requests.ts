import "server-only";

import { database } from "@repo/database";
import { orbitRiskRequest } from "@repo/database/schema";
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
