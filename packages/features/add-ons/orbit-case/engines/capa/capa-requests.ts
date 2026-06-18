import "server-only";

import { database } from "@repo/database";
import { orbitCapaRequest } from "@repo/database/schema";
import type { OrbitCapaRequestRecord } from "../../contract/orbit-case.types";
import {
  createTypedMorphReads,
  defineTwoFieldMorphMapper,
} from "../morph/create-typed-morph-reads";

const mapCapaRequestRow =
  defineTwoFieldMorphMapper<OrbitCapaRequestRecord>("rootCause", "dueDate");

const reads = createTypedMorphReads(orbitCapaRequest, mapCapaRequestRow);

export const getCapaRequestById = reads.getById;
export const listCapaRequestsForOrg = reads.listForOrg;
