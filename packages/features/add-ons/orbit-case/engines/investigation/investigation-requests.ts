import "server-only";

import { database } from "@repo/database";
import { orbitInvestigationRequest } from "@repo/database/schema";
import type { OrbitInvestigationRequestRecord } from "../../contract/orbit-case.types";
import {
  createTypedMorphReads,
  defineTwoFieldMorphMapper,
} from "../morph/create-typed-morph-reads";

const mapInvestigationRequestRow =
  defineTwoFieldMorphMapper<OrbitInvestigationRequestRecord>(
    "subject",
    "priority"
  );

const reads = createTypedMorphReads(
  orbitInvestigationRequest,
  mapInvestigationRequestRow
);

export const getInvestigationRequestById = reads.getById;
export const listInvestigationRequestsForOrg = reads.listForOrg;
