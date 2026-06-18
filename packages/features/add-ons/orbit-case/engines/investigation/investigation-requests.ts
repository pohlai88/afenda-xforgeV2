import "server-only";

import { database, orbitInvestigationRequest } from "@repo/database";
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
