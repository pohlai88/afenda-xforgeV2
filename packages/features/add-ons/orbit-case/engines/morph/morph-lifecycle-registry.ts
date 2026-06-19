import "server-only";

import type { ListMorphLifecycleFilter } from "../../contract/morph-lifecycle.schema";
import type {
  MorphLifecycleSegment,
  OrbitMorphLifecycleRequestDto,
} from "../../contract/morph-lifecycle.types";
import type { OrbitMorphStatus } from "../../contract/morph-status";
import { toOrbitMorphLifecycleRequestDto } from "../../contract/morph-lifecycle-serialize";
import {
  getApprovalRequestById,
  listApprovalRequestsForOrg,
  updateApprovalRequestFields,
} from "../approval/approval-requests";
import {
  getBudgetRequestById,
  listBudgetRequestsForOrg,
  updateBudgetRequestFields,
} from "../budget/budget-requests";
import {
  getMeetingRequestById,
  listMeetingRequestsForOrg,
  updateMeetingRequestFields,
} from "../meeting/meeting-requests";
import {
  getCapaRequestById,
  listCapaRequestsForOrg,
  updateCapaRequestFields,
} from "../capa/capa-requests";
import {
  getComplaintRequestById,
  listComplaintRequestsForOrg,
  updateComplaintRequestFields,
} from "../complaint/complaint-requests";
import {
  getContractReviewRequestById,
  listContractReviewRequestsForOrg,
  updateContractReviewRequestFields,
} from "../contract-review/contract-review-requests";
import {
  getInvestigationRequestById,
  listInvestigationRequestsForOrg,
  updateInvestigationRequestFields,
} from "../investigation/investigation-requests";
import {
  getLeadRequestById,
  listLeadRequestsForOrg,
  updateLeadRequestFields,
} from "../lead/lead-requests";
import {
  getProjectRequestById,
  listProjectRequestsForOrg,
  updateProjectRequestFields,
} from "../project/project-requests";
import {
  getPurchaseRequestById,
  listPurchaseRequestsForOrg,
  updatePurchaseRequestFields,
} from "../purchase/purchase-requests";
import {
  getRiskRequestById,
  listRiskRequestsForOrg,
  updateRiskRequestFields,
} from "../risk/risk-requests";

export interface MorphLifecycleUpdatePatch {
  assigneeId?: string | null;
  status?: OrbitMorphStatus;
  title?: string;
  values?: Record<string, string | null>;
}

type MorphLifecycleLoader = {
  getById: (
    organizationId: string,
    requestId: string
  ) => Promise<OrbitMorphLifecycleRequestDto | null>;
  listForOrg: (
    organizationId: string,
    filters?: ListMorphLifecycleFilter
  ) => Promise<OrbitMorphLifecycleRequestDto[]>;
  updateFields: (
    organizationId: string,
    actorId: string,
    requestId: string,
    patch: MorphLifecycleUpdatePatch
  ) => Promise<OrbitMorphLifecycleRequestDto | null>;
};

const toBudgetDto = (
  record: NonNullable<Awaited<ReturnType<typeof getBudgetRequestById>>>
): OrbitMorphLifecycleRequestDto =>
  toOrbitMorphLifecycleRequestDto(record, {
    amount: record.amount,
    costCenter: record.costCenter,
    currency: record.currency,
    externalRefId: record.externalRefId,
    justification: record.justification,
  });

const toApprovalDto = (
  record: NonNullable<Awaited<ReturnType<typeof getApprovalRequestById>>>
): OrbitMorphLifecycleRequestDto =>
  toOrbitMorphLifecycleRequestDto(record, {
    amount: record.amount,
    approver: record.approver,
    decisionNotes: record.decisionNotes,
    dueDate: record.dueDate,
    externalRefId: record.externalRefId,
  });

const toPurchaseDto = (
  record: NonNullable<Awaited<ReturnType<typeof getPurchaseRequestById>>>
): OrbitMorphLifecycleRequestDto =>
  toOrbitMorphLifecycleRequestDto(record, {
    amount: record.amount,
    externalRefId: record.externalRefId,
    poReference: record.poReference,
    vendor: record.vendor,
  });

const toMeetingDto = (
  record: NonNullable<Awaited<ReturnType<typeof getMeetingRequestById>>>
): OrbitMorphLifecycleRequestDto =>
  toOrbitMorphLifecycleRequestDto(record, {
    location: record.location,
    scheduledAt: record.scheduledAt,
  });

const readFieldValue = (
  record: object,
  key: string
): string | null => {
  const value = (record as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
};

const wrapTwoFieldEngine = (
  engine: {
    getById: (
      organizationId: string,
      requestId: string
    ) => Promise<object | null>;
    listForOrg: (
      organizationId: string,
      filters?: ListMorphLifecycleFilter
    ) => Promise<object[]>;
    updateFields: (
      organizationId: string,
      actorId: string,
      requestId: string,
      patch: MorphLifecycleUpdatePatch
    ) => Promise<object | null>;
  },
  fieldAKey: string,
  fieldBKey: string
): MorphLifecycleLoader => ({
  getById: async (organizationId, requestId) => {
    const record = await engine.getById(organizationId, requestId);
    return record
      ? toOrbitMorphLifecycleRequestDto(
          record as Parameters<typeof toOrbitMorphLifecycleRequestDto>[0],
          {
            [fieldAKey]: readFieldValue(record, fieldAKey),
            [fieldBKey]: readFieldValue(record, fieldBKey),
          }
        )
      : null;
  },
  listForOrg: async (organizationId, filters) => {
    const records = await engine.listForOrg(organizationId, filters);
    return records.map((record) =>
      toOrbitMorphLifecycleRequestDto(
        record as Parameters<typeof toOrbitMorphLifecycleRequestDto>[0],
        {
          [fieldAKey]: readFieldValue(record, fieldAKey),
          [fieldBKey]: readFieldValue(record, fieldBKey),
        }
      )
    );
  },
  updateFields: async (organizationId, actorId, requestId, patch) => {
    const record = await engine.updateFields(
      organizationId,
      actorId,
      requestId,
      patch
    );
    return record
      ? toOrbitMorphLifecycleRequestDto(
          record as Parameters<typeof toOrbitMorphLifecycleRequestDto>[0],
          {
            [fieldAKey]: readFieldValue(record, fieldAKey),
            [fieldBKey]: readFieldValue(record, fieldBKey),
          }
        )
      : null;
  },
});

const MORPH_LIFECYCLE_LOADERS: Record<MorphLifecycleSegment, MorphLifecycleLoader> =
  {
    approval: {
      getById: async (organizationId, requestId) => {
        const record = await getApprovalRequestById(organizationId, requestId);
        return record ? toApprovalDto(record) : null;
      },
      listForOrg: async (organizationId, filters) => {
        const records = await listApprovalRequestsForOrg(organizationId, filters);
        return records.map(toApprovalDto);
      },
      updateFields: async (organizationId, actorId, requestId, patch) => {
        const record = await updateApprovalRequestFields(
          organizationId,
          actorId,
          requestId,
          {
            assigneeId: patch.assigneeId,
            status: patch.status,
            title: patch.title,
            amount: patch.values?.amount,
            approver: patch.values?.approver,
            decisionNotes: patch.values?.decisionNotes,
            dueDate: patch.values?.dueDate,
            externalRefId: patch.values?.externalRefId,
          }
        );
        return record ? toApprovalDto(record) : null;
      },
    },
    budget: {
      getById: async (organizationId, requestId) => {
        const record = await getBudgetRequestById(organizationId, requestId);
        return record ? toBudgetDto(record) : null;
      },
      listForOrg: async (organizationId, filters) => {
        const records = await listBudgetRequestsForOrg(organizationId, filters);
        return records.map(toBudgetDto);
      },
      updateFields: async (organizationId, actorId, requestId, patch) => {
        const record = await updateBudgetRequestFields(
          organizationId,
          actorId,
          requestId,
          {
            assigneeId: patch.assigneeId,
            status: patch.status,
            title: patch.title,
            amount: patch.values?.amount,
            costCenter: patch.values?.costCenter,
            currency: patch.values?.currency,
            externalRefId: patch.values?.externalRefId,
            justification: patch.values?.justification,
          }
        );
        return record ? toBudgetDto(record) : null;
      },
    },
    capa: wrapTwoFieldEngine(
      {
        getById: getCapaRequestById,
        listForOrg: listCapaRequestsForOrg,
        updateFields: updateCapaRequestFields,
      },
      "rootCause",
      "dueDate"
    ),
    complaint: wrapTwoFieldEngine(
      {
        getById: getComplaintRequestById,
        listForOrg: listComplaintRequestsForOrg,
        updateFields: updateComplaintRequestFields,
      },
      "category",
      "severity"
    ),
    "contract-review": wrapTwoFieldEngine(
      {
        getById: getContractReviewRequestById,
        listForOrg: listContractReviewRequestsForOrg,
        updateFields: updateContractReviewRequestFields,
      },
      "counterparty",
      "expiryDate"
    ),
    investigation: wrapTwoFieldEngine(
      {
        getById: getInvestigationRequestById,
        listForOrg: listInvestigationRequestsForOrg,
        updateFields: updateInvestigationRequestFields,
      },
      "subject",
      "priority"
    ),
    lead: wrapTwoFieldEngine(
      {
        getById: getLeadRequestById,
        listForOrg: listLeadRequestsForOrg,
        updateFields: updateLeadRequestFields,
      },
      "contact",
      "company"
    ),
    meeting: {
      getById: async (organizationId, requestId) => {
        const record = await getMeetingRequestById(organizationId, requestId);
        return record ? toMeetingDto(record) : null;
      },
      listForOrg: async (organizationId, filters) => {
        const records = await listMeetingRequestsForOrg(organizationId, filters);
        return records.map(toMeetingDto);
      },
      updateFields: async (organizationId, actorId, requestId, patch) => {
        const record = await updateMeetingRequestFields(
          organizationId,
          actorId,
          requestId,
          {
            assigneeId: patch.assigneeId,
            status: patch.status,
            title: patch.title,
            location: patch.values?.location,
            scheduledAt: patch.values?.scheduledAt,
          }
        );
        return record ? toMeetingDto(record) : null;
      },
    },
    project: wrapTwoFieldEngine(
      {
        getById: getProjectRequestById,
        listForOrg: listProjectRequestsForOrg,
        updateFields: updateProjectRequestFields,
      },
      "startDate",
      "budget"
    ),
    purchase: {
      getById: async (organizationId, requestId) => {
        const record = await getPurchaseRequestById(organizationId, requestId);
        return record ? toPurchaseDto(record) : null;
      },
      listForOrg: async (organizationId, filters) => {
        const records = await listPurchaseRequestsForOrg(organizationId, filters);
        return records.map(toPurchaseDto);
      },
      updateFields: async (organizationId, actorId, requestId, patch) => {
        const record = await updatePurchaseRequestFields(
          organizationId,
          actorId,
          requestId,
          {
            assigneeId: patch.assigneeId,
            status: patch.status,
            title: patch.title,
            amount: patch.values?.amount,
            vendor: patch.values?.vendor,
            poReference: patch.values?.poReference,
            externalRefId: patch.values?.externalRefId,
          }
        );
        return record ? toPurchaseDto(record) : null;
      },
    },
    risk: wrapTwoFieldEngine(
      {
        getById: getRiskRequestById,
        listForOrg: listRiskRequestsForOrg,
        updateFields: updateRiskRequestFields,
      },
      "riskLevel",
      "owner"
    ),
  };

export const resolveMorphLifecycleLoader = (
  segment: MorphLifecycleSegment
): MorphLifecycleLoader => MORPH_LIFECYCLE_LOADERS[segment];
