import "server-only";

import { database } from "@repo/database";
import { orbitComplaintRequest } from "@repo/database/schema";
import type { OrbitComplaintRequestRecord } from "../../contract/orbit-case.types";
import {
  createTypedMorphReads,
  defineTwoFieldMorphMapper,
} from "../morph/create-typed-morph-reads";

const mapComplaintRequestRow = defineTwoFieldMorphMapper<OrbitComplaintRequestRecord>(
  "category",
  "severity"
);

const reads = createTypedMorphReads(
  orbitComplaintRequest,
  mapComplaintRequestRow
);

export const getComplaintRequestById = reads.getById;
export const listComplaintRequestsForOrg = reads.listForOrg;
