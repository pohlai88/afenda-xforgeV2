import "server-only";

import { database, orbitContractReviewRequest } from "@repo/database";
import type { OrbitContractReviewRequestRecord } from "../../contract/orbit-case.types";
import {
  createTypedMorphReads,
  defineTwoFieldMorphMapper,
} from "../morph/create-typed-morph-reads";

const mapContractReviewRequestRow =
  defineTwoFieldMorphMapper<OrbitContractReviewRequestRecord>(
    "counterparty",
    "expiryDate"
  );

const reads = createTypedMorphReads(
  orbitContractReviewRequest,
  mapContractReviewRequestRow
);

export const getContractReviewRequestById = reads.getById;
export const listContractReviewRequestsForOrg = reads.listForOrg;
