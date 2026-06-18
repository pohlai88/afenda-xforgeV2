import "server-only";

import { database } from "@repo/database";
import { orbitProjectRequest } from "@repo/database/schema";
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
