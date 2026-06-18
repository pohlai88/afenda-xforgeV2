import "server-only";

import type { OrbitApprovalRequestRecord } from "../../contract/orbit-case.types";
import type { OrbitBudgetRequestRecord } from "../../contract/orbit-case.types";
import type { OrbitMeetingRequestRecord } from "../../contract/orbit-case.types";
import type { OrbitMorphRequestRecord } from "../../contract/morph-request-shared";
import {
  getApprovalRequestById,
  listApprovalRequestsForOrg,
} from "../approval/approval-requests";
import {
  getBudgetRequestById,
  listBudgetRequestsForOrg,
} from "../budget/budget-requests";
import {
  getMeetingRequestById,
  listMeetingRequestsForOrg,
} from "../meeting/meeting-requests";
import {
  getCapaRequestById,
  getComplaintRequestById,
  getContractReviewRequestById,
  getInvestigationRequestById,
  getLeadRequestById,
  getProjectRequestById,
  getPurchaseRequestById,
  getRiskRequestById,
  listCapaRequestsForOrg,
  listComplaintRequestsForOrg,
  listContractReviewRequestsForOrg,
  listInvestigationRequestsForOrg,
  listLeadRequestsForOrg,
  listProjectRequestsForOrg,
  listPurchaseRequestsForOrg,
  listRiskRequestsForOrg,
} from "./remaining-morph-requests";

const toMorphRecord = (
  record: {
    createdAt: Date;
    createdBy: string;
    id: string;
    organizationId: string;
    originCaseId: string;
    title: string;
  },
  values: Record<string, string | null>
): OrbitMorphRequestRecord => ({
  createdAt: record.createdAt,
  createdBy: record.createdBy,
  id: record.id,
  organizationId: record.organizationId,
  originCaseId: record.originCaseId,
  title: record.title,
  values,
});

const mapBudget = (record: OrbitBudgetRequestRecord): OrbitMorphRequestRecord =>
  toMorphRecord(record, { amount: record.amount });

const mapMeeting = (
  record: OrbitMeetingRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    location: record.location,
    scheduledAt: record.scheduledAt,
  });

const mapApproval = (
  record: OrbitApprovalRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    amount: record.amount,
    approver: record.approver,
  });

export interface OrbitMorphRouteLoader {
  getById: (
    organizationId: string,
    requestId: string
  ) => Promise<OrbitMorphRequestRecord | null>;
  listForOrg: (organizationId: string) => Promise<OrbitMorphRequestRecord[]>;
}

export const ORBIT_MORPH_ROUTE_LOADERS: Record<string, OrbitMorphRouteLoader> = {
  approval: {
    getById: async (organizationId, requestId) => {
      const record = await getApprovalRequestById(organizationId, requestId);
      return record ? mapApproval(record) : null;
    },
    listForOrg: async (organizationId) => {
      const records = await listApprovalRequestsForOrg(organizationId);
      return records.map(mapApproval);
    },
  },
  budget: {
    getById: async (organizationId, requestId) => {
      const record = await getBudgetRequestById(organizationId, requestId);
      return record ? mapBudget(record) : null;
    },
    listForOrg: async (organizationId) => {
      const records = await listBudgetRequestsForOrg(organizationId);
      return records.map(mapBudget);
    },
  },
  capa: {
    getById: getCapaRequestById,
    listForOrg: listCapaRequestsForOrg,
  },
  complaint: {
    getById: getComplaintRequestById,
    listForOrg: listComplaintRequestsForOrg,
  },
  "contract-review": {
    getById: getContractReviewRequestById,
    listForOrg: listContractReviewRequestsForOrg,
  },
  investigation: {
    getById: getInvestigationRequestById,
    listForOrg: listInvestigationRequestsForOrg,
  },
  lead: {
    getById: getLeadRequestById,
    listForOrg: listLeadRequestsForOrg,
  },
  meeting: {
    getById: async (organizationId, requestId) => {
      const record = await getMeetingRequestById(organizationId, requestId);
      return record ? mapMeeting(record) : null;
    },
    listForOrg: async (organizationId) => {
      const records = await listMeetingRequestsForOrg(organizationId);
      return records.map(mapMeeting);
    },
  },
  project: {
    getById: getProjectRequestById,
    listForOrg: listProjectRequestsForOrg,
  },
  purchase: {
    getById: getPurchaseRequestById,
    listForOrg: listPurchaseRequestsForOrg,
  },
  risk: {
    getById: getRiskRequestById,
    listForOrg: listRiskRequestsForOrg,
  },
};

export const resolveOrbitMorphRouteLoader = (
  segment: string
): OrbitMorphRouteLoader | null => ORBIT_MORPH_ROUTE_LOADERS[segment] ?? null;
