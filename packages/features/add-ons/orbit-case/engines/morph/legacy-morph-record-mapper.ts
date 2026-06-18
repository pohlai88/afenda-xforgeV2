import type {
  OrbitApprovalRequestRecord,
  OrbitBudgetRequestRecord,
  OrbitCapaRequestRecord,
  OrbitComplaintRequestRecord,
  OrbitContractReviewRequestRecord,
  OrbitInvestigationRequestRecord,
  OrbitLeadRequestRecord,
  OrbitMeetingRequestRecord,
  OrbitProjectRequestRecord,
  OrbitPurchaseRequestRecord,
  OrbitRiskRequestRecord,
} from "../../contract/orbit-case.types";
import type { OrbitMorphRequestRecord } from "../../contract/morph-request-shared";

type MorphRecordCore = Pick<
  OrbitMorphRequestRecord,
  | "createdAt"
  | "createdBy"
  | "id"
  | "organizationId"
  | "originCaseId"
  | "title"
>;

const toMorphRecord = (
  record: MorphRecordCore,
  values: Record<string, string | null>
): OrbitMorphRequestRecord => ({
  ...record,
  values,
});

export const mapBudgetToMorphRecord = (
  record: OrbitBudgetRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, { amount: record.amount });

export const mapMeetingToMorphRecord = (
  record: OrbitMeetingRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    location: record.location,
    scheduledAt: record.scheduledAt,
  });

export const mapApprovalToMorphRecord = (
  record: OrbitApprovalRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    amount: record.amount,
    approver: record.approver,
  });

export const mapPurchaseToMorphRecord = (
  record: OrbitPurchaseRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    amount: record.amount,
    vendor: record.vendor,
  });

export const mapLeadToMorphRecord = (
  record: OrbitLeadRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    company: record.company,
    contact: record.contact,
  });

export const mapComplaintToMorphRecord = (
  record: OrbitComplaintRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    category: record.category,
    severity: record.severity,
  });

export const mapRiskToMorphRecord = (
  record: OrbitRiskRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    owner: record.owner,
    riskLevel: record.riskLevel,
  });

export const mapProjectToMorphRecord = (
  record: OrbitProjectRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    budget: record.budget,
    startDate: record.startDate,
  });

export const mapInvestigationToMorphRecord = (
  record: OrbitInvestigationRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    priority: record.priority,
    subject: record.subject,
  });

export const mapCapaToMorphRecord = (
  record: OrbitCapaRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    dueDate: record.dueDate,
    rootCause: record.rootCause,
  });

export const mapContractReviewToMorphRecord = (
  record: OrbitContractReviewRequestRecord
): OrbitMorphRequestRecord =>
  toMorphRecord(record, {
    counterparty: record.counterparty,
    expiryDate: record.expiryDate,
  });
