import "server-only";

import type {
  orbitCapaRequest,
  orbitComplaintRequest,
  orbitContractReviewRequest,
  orbitInvestigationRequest,
  orbitLeadRequest,
  orbitProjectRequest,
  orbitPurchaseRequest,
  orbitRiskRequest,
} from "@repo/database/schema";

/** Shared Drizzle handle for Phase 3 two-field morph tables (migration 0031). */
export type MorphTwoFieldTable =
  | typeof orbitCapaRequest
  | typeof orbitComplaintRequest
  | typeof orbitContractReviewRequest
  | typeof orbitInvestigationRequest
  | typeof orbitLeadRequest
  | typeof orbitProjectRequest
  | typeof orbitPurchaseRequest
  | typeof orbitRiskRequest;
