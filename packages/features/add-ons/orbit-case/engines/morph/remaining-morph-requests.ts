import "server-only";

import { database } from "@repo/database";
import {
  orbitCapaRequest,
  orbitComplaintRequest,
  orbitContractReviewRequest,
  orbitInvestigationRequest,
  orbitLeadRequest,
  orbitProjectRequest,
  orbitPurchaseRequest,
  orbitRiskRequest,
} from "@repo/database/schema";
import { and, desc, eq } from "drizzle-orm";
import type { OrbitMorphRequestRecord } from "../../contract/morph-request-shared";
import { createTwoFieldMorphPushHandler } from "./create-two-field-morph-push-handler";

const mapTwoFieldRow = (
  row: {
    createdAt: Date;
    createdBy: string;
    id: string;
    organizationId: string;
    originCaseId: string;
    title: string;
  },
  fieldAKey: string,
  fieldAValue: string | null,
  fieldBKey: string,
  fieldBValue: string | null
): OrbitMorphRequestRecord => ({
  createdAt: row.createdAt,
  createdBy: row.createdBy,
  id: row.id,
  organizationId: row.organizationId,
  originCaseId: row.originCaseId,
  title: row.title,
  values: {
    [fieldAKey]: fieldAValue,
    [fieldBKey]: fieldBValue,
  },
});

const createReads = (
  table: typeof orbitPurchaseRequest,
  fieldKeys: readonly [string, string],
  pickFields: (
    row: Record<string, unknown>
  ) => readonly [string | null, string | null]
) => ({
  getById: async (
    organizationId: string,
    requestId: string
  ): Promise<OrbitMorphRequestRecord | null> => {
    const [row] = await database
      .select()
      .from(table)
      .where(
        and(
          eq(table.organizationId, organizationId),
          eq(table.id, requestId)
        )
      )
      .limit(1);

    if (!row) {
      return null;
    }

    const [fieldA, fieldB] = pickFields(row as Record<string, unknown>);
    return mapTwoFieldRow(
      row,
      fieldKeys[0],
      fieldA,
      fieldKeys[1],
      fieldB
    );
  },
  listForOrg: async (
    organizationId: string,
    limit = 200
  ): Promise<OrbitMorphRequestRecord[]> => {
    const rows = await database
      .select()
      .from(table)
      .where(eq(table.organizationId, organizationId))
      .orderBy(desc(table.createdAt))
      .limit(limit);

    return rows.map((row) => {
      const [fieldA, fieldB] = pickFields(row as Record<string, unknown>);
      return mapTwoFieldRow(
        row,
        fieldKeys[0],
        fieldA,
        fieldKeys[1],
        fieldB
      );
    });
  },
});

const purchaseReads = createReads(
  orbitPurchaseRequest,
  ["vendor", "amount"],
  (row) => [row.vendor as string | null, row.amount as string | null]
);
export const getPurchaseRequestById = purchaseReads.getById;
export const listPurchaseRequestsForOrg = purchaseReads.listForOrg;
export const executePurchaseRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["vendor", "amount"],
  targetType: "purchase-request",
  insertRow: async (row) => {
    await database.insert(orbitPurchaseRequest).values({
      amount: row.fieldB,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
      vendor: row.fieldA,
    });
  },
});

const leadReads = createReads(
  orbitLeadRequest as typeof orbitPurchaseRequest,
  ["contact", "company"],
  (row) => [row.contact as string | null, row.company as string | null]
);
export const getLeadRequestById = leadReads.getById;
export const listLeadRequestsForOrg = leadReads.listForOrg;
export const executeLeadRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["contact", "company"],
  targetType: "lead-request",
  insertRow: async (row) => {
    await database.insert(orbitLeadRequest).values({
      company: row.fieldB,
      contact: row.fieldA,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
    });
  },
});

const complaintReads = createReads(
  orbitComplaintRequest as typeof orbitPurchaseRequest,
  ["category", "severity"],
  (row) => [row.category as string | null, row.severity as string | null]
);
export const getComplaintRequestById = complaintReads.getById;
export const listComplaintRequestsForOrg = complaintReads.listForOrg;
export const executeComplaintRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["category", "severity"],
  targetType: "complaint-request",
  insertRow: async (row) => {
    await database.insert(orbitComplaintRequest).values({
      category: row.fieldA,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      severity: row.fieldB,
      title: row.title,
    });
  },
});

const riskReads = createReads(
  orbitRiskRequest as typeof orbitPurchaseRequest,
  ["riskLevel", "owner"],
  (row) => [row.riskLevel as string | null, row.owner as string | null]
);
export const getRiskRequestById = riskReads.getById;
export const listRiskRequestsForOrg = riskReads.listForOrg;
export const executeRiskRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["riskLevel", "owner"],
  targetType: "risk-request",
  insertRow: async (row) => {
    await database.insert(orbitRiskRequest).values({
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      owner: row.fieldB,
      riskLevel: row.fieldA,
      title: row.title,
    });
  },
});

const projectReads = createReads(
  orbitProjectRequest as typeof orbitPurchaseRequest,
  ["startDate", "budget"],
  (row) => [row.startDate as string | null, row.budget as string | null]
);
export const getProjectRequestById = projectReads.getById;
export const listProjectRequestsForOrg = projectReads.listForOrg;
export const executeProjectRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["startDate", "budget"],
  targetType: "project-request",
  insertRow: async (row) => {
    await database.insert(orbitProjectRequest).values({
      budget: row.fieldB,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      startDate: row.fieldA,
      title: row.title,
    });
  },
});

const investigationReads = createReads(
  orbitInvestigationRequest as typeof orbitPurchaseRequest,
  ["subject", "priority"],
  (row) => [row.subject as string | null, row.priority as string | null]
);
export const getInvestigationRequestById = investigationReads.getById;
export const listInvestigationRequestsForOrg = investigationReads.listForOrg;
export const executeInvestigationRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["subject", "priority"],
  targetType: "investigation-request",
  insertRow: async (row) => {
    await database.insert(orbitInvestigationRequest).values({
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      priority: row.fieldB,
      subject: row.fieldA,
      title: row.title,
    });
  },
});

const capaReads = createReads(
  orbitCapaRequest as typeof orbitPurchaseRequest,
  ["rootCause", "dueDate"],
  (row) => [row.rootCause as string | null, row.dueDate as string | null]
);
export const getCapaRequestById = capaReads.getById;
export const listCapaRequestsForOrg = capaReads.listForOrg;
export const executeCapaRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["rootCause", "dueDate"],
  targetType: "capa-request",
  insertRow: async (row) => {
    await database.insert(orbitCapaRequest).values({
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      dueDate: row.fieldB,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      rootCause: row.fieldA,
      title: row.title,
    });
  },
});

const contractReviewReads = createReads(
  orbitContractReviewRequest as typeof orbitPurchaseRequest,
  ["counterparty", "expiryDate"],
  (row) => [
    row.counterparty as string | null,
    row.expiryDate as string | null,
  ]
);
export const getContractReviewRequestById = contractReviewReads.getById;
export const listContractReviewRequestsForOrg = contractReviewReads.listForOrg;
export const executeContractReviewRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["counterparty", "expiryDate"],
  targetType: "contract-review-request",
  insertRow: async (row) => {
    await database.insert(orbitContractReviewRequest).values({
      counterparty: row.fieldA,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      expiryDate: row.fieldB,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
    });
  },
});
