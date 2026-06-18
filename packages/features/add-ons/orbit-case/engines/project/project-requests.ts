import "server-only";

import { database, orbitProjectRequest } from "@repo/database";
import type { OrbitProjectRequestRecord } from "../../contract/orbit-case.types";
import {
  createTypedMorphReads,
  defineTwoFieldMorphMapper,
} from "../morph/create-typed-morph-reads";

const mapProjectRequestRow = defineTwoFieldMorphMapper<OrbitProjectRequestRecord>(
  "startDate",
  "budget"
);

const reads = createTypedMorphReads(orbitProjectRequest, mapProjectRequestRow);

export const getProjectRequestById = reads.getById;
export const listProjectRequestsForOrg = reads.listForOrg;
