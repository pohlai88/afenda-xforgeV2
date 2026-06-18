import "server-only";

import { database, orbitPurchaseRequest } from "@repo/database";
import type { OrbitPurchaseRequestRecord } from "../../contract/orbit-case.types";
import {
  createTypedMorphReads,
  defineTwoFieldMorphMapper,
} from "../morph/create-typed-morph-reads";

const mapPurchaseRequestRow =
  defineTwoFieldMorphMapper<OrbitPurchaseRequestRecord>("vendor", "amount");

const reads = createTypedMorphReads(
  orbitPurchaseRequest,
  mapPurchaseRequestRow
);

export const getPurchaseRequestById = reads.getById;
export const listPurchaseRequestsForOrg = reads.listForOrg;
