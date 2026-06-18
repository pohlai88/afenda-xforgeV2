import "server-only";

import { database } from "@repo/database";
import { orbitLeadRequest } from "@repo/database/schema";
import type { OrbitLeadRequestRecord } from "../../contract/orbit-case.types";
import {
  createTypedMorphReads,
  defineTwoFieldMorphMapper,
} from "../morph/create-typed-morph-reads";

const mapLeadRequestRow =
  defineTwoFieldMorphMapper<OrbitLeadRequestRecord>("contact", "company");

const reads = createTypedMorphReads(orbitLeadRequest, mapLeadRequestRow);

export const getLeadRequestById = reads.getById;
export const listLeadRequestsForOrg = reads.listForOrg;
