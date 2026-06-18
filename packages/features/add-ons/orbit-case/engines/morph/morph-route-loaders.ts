import "server-only";

import type { OrbitMorphSegment } from "../../contract/morph-destination-manifest";
import {
  getApprovalRequestById,
  listApprovalRequestsForOrg,
} from "../approval/approval-requests";
import {
  getBudgetRequestById,
  listBudgetRequestsForOrg,
} from "../budget/budget-requests";
import {
  getCapaRequestById,
  listCapaRequestsForOrg,
} from "../capa/capa-requests";
import {
  getComplaintRequestById,
  listComplaintRequestsForOrg,
} from "../complaint/complaint-requests";
import {
  getContractReviewRequestById,
  listContractReviewRequestsForOrg,
} from "../contract-review/contract-review-requests";
import {
  getInvestigationRequestById,
  listInvestigationRequestsForOrg,
} from "../investigation/investigation-requests";
import {
  getLeadRequestById,
  listLeadRequestsForOrg,
} from "../lead/lead-requests";
import {
  getMeetingRequestById,
  listMeetingRequestsForOrg,
} from "../meeting/meeting-requests";
import {
  getProjectRequestById,
  listProjectRequestsForOrg,
} from "../project/project-requests";
import {
  getPurchaseRequestById,
  listPurchaseRequestsForOrg,
} from "../purchase/purchase-requests";
import {
  getRiskRequestById,
  listRiskRequestsForOrg,
} from "../risk/risk-requests";
import {
  mapApprovalToMorphRecord,
  mapBudgetToMorphRecord,
  mapCapaToMorphRecord,
  mapComplaintToMorphRecord,
  mapContractReviewToMorphRecord,
  mapInvestigationToMorphRecord,
  mapLeadToMorphRecord,
  mapMeetingToMorphRecord,
  mapProjectToMorphRecord,
  mapPurchaseToMorphRecord,
  mapRiskToMorphRecord,
} from "./legacy-morph-record-mapper";
import type { OrbitMorphRouteLoader } from "./morph-route-loader.types";
import { wrapMorphRouteLoader } from "./wrap-morph-route-loader";

export type { OrbitMorphRouteLoader } from "./morph-route-loader.types";

export const ORBIT_MORPH_ROUTE_LOADERS = {
  approval: wrapMorphRouteLoader(
    {
      getById: getApprovalRequestById,
      listForOrg: listApprovalRequestsForOrg,
    },
    mapApprovalToMorphRecord
  ),
  budget: wrapMorphRouteLoader(
    {
      getById: getBudgetRequestById,
      listForOrg: listBudgetRequestsForOrg,
    },
    mapBudgetToMorphRecord
  ),
  capa: wrapMorphRouteLoader(
    {
      getById: getCapaRequestById,
      listForOrg: listCapaRequestsForOrg,
    },
    mapCapaToMorphRecord
  ),
  complaint: wrapMorphRouteLoader(
    {
      getById: getComplaintRequestById,
      listForOrg: listComplaintRequestsForOrg,
    },
    mapComplaintToMorphRecord
  ),
  "contract-review": wrapMorphRouteLoader(
    {
      getById: getContractReviewRequestById,
      listForOrg: listContractReviewRequestsForOrg,
    },
    mapContractReviewToMorphRecord
  ),
  investigation: wrapMorphRouteLoader(
    {
      getById: getInvestigationRequestById,
      listForOrg: listInvestigationRequestsForOrg,
    },
    mapInvestigationToMorphRecord
  ),
  lead: wrapMorphRouteLoader(
    {
      getById: getLeadRequestById,
      listForOrg: listLeadRequestsForOrg,
    },
    mapLeadToMorphRecord
  ),
  meeting: wrapMorphRouteLoader(
    {
      getById: getMeetingRequestById,
      listForOrg: listMeetingRequestsForOrg,
    },
    mapMeetingToMorphRecord
  ),
  project: wrapMorphRouteLoader(
    {
      getById: getProjectRequestById,
      listForOrg: listProjectRequestsForOrg,
    },
    mapProjectToMorphRecord
  ),
  purchase: wrapMorphRouteLoader(
    {
      getById: getPurchaseRequestById,
      listForOrg: listPurchaseRequestsForOrg,
    },
    mapPurchaseToMorphRecord
  ),
  risk: wrapMorphRouteLoader(
    {
      getById: getRiskRequestById,
      listForOrg: listRiskRequestsForOrg,
    },
    mapRiskToMorphRecord
  ),
} satisfies Record<OrbitMorphSegment, OrbitMorphRouteLoader>;

export const resolveOrbitMorphRouteLoader = (
  segment: OrbitMorphSegment
): OrbitMorphRouteLoader => ORBIT_MORPH_ROUTE_LOADERS[segment];
