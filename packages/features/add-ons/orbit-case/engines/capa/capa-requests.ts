import "server-only";

import { database, orbitCapaRequest } from "@repo/database";
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
