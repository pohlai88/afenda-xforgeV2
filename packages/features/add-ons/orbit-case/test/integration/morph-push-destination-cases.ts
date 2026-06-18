import {
  database,
  orbitCapaRequest,
  orbitComplaintRequest,
  orbitContractReviewRequest,
  orbitInvestigationRequest,
  orbitLeadRequest,
  orbitProjectRequest,
  orbitPurchaseRequest,
  orbitRiskRequest,
} from "@repo/database";
import { eq } from "drizzle-orm";
import { expect } from "vitest";
import type { OrbitPushCapability } from "../../contract/push.schema";
import { getCapaRequestById } from "../../engines/capa/capa-requests";
import { getComplaintRequestById } from "../../engines/complaint/complaint-requests";
import { getContractReviewRequestById } from "../../engines/contract-review/contract-review-requests";
import { getInvestigationRequestById } from "../../engines/investigation/investigation-requests";
import { getLeadRequestById } from "../../engines/lead/lead-requests";
import { getProjectRequestById } from "../../engines/project/project-requests";
import { getPurchaseRequestById } from "../../engines/purchase/purchase-requests";
import { getRiskRequestById } from "../../engines/risk/risk-requests";

type MorphPushRole = "owner" | "editor" | "member";

export interface MorphPushIntegrationCase {
  actorId: string;
  assertRecord: (record: {
    originCaseId: string;
    title: string;
    [key: string]: string | Date | null;
  }) => void;
  capability: OrbitPushCapability;
  caseTitle: string;
  deleteTarget: (targetId: string) => Promise<void>;
  destinationId: string;
  fieldValues: Record<string, string>;
  getById: (
    organizationId: string,
    targetId: string
  ) => Promise<{
    originCaseId: string;
    title: string;
    [key: string]: string | Date | null;
  } | null>;
  label: string;
  orgName: string;
  role: MorphPushRole;
}

export const TWO_FIELD_MORPH_PUSH_INTEGRATION_CASES: MorphPushIntegrationCase[] =
  [
    {
      actorId: "user_editor",
      capability: "purchase",
      caseTitle: "Purchase push case",
      destinationId: "purchase-request",
      fieldValues: {
        title: "Purchase push case",
        vendor: "Acme Corp",
      },
      getById: getPurchaseRequestById,
      label: "Purchase Request",
      orgName: "Purchase Push Org",
      role: "editor",
      assertRecord: (record) => {
        expect(record.title).toBe("Purchase push case");
        expect(record.vendor).toBe("Acme Corp");
      },
      deleteTarget: async (targetId) => {
        await database
          .delete(orbitPurchaseRequest)
          .where(eq(orbitPurchaseRequest.id, targetId));
      },
    },
    {
      actorId: "user_editor",
      capability: "lead",
      caseTitle: "Lead push case",
      destinationId: "lead-request",
      fieldValues: {
        title: "Lead push case",
        contact: "Jane Doe",
        company: "Acme Corp",
      },
      getById: getLeadRequestById,
      label: "Lead Request",
      orgName: "Lead Push Org",
      role: "editor",
      assertRecord: (record) => {
        expect(record.title).toBe("Lead push case");
        expect(record.contact).toBe("Jane Doe");
        expect(record.company).toBe("Acme Corp");
      },
      deleteTarget: async (targetId) => {
        await database
          .delete(orbitLeadRequest)
          .where(eq(orbitLeadRequest.id, targetId));
      },
    },
    {
      actorId: "user_editor",
      capability: "complaint",
      caseTitle: "Complaint push case",
      destinationId: "complaint-request",
      fieldValues: {
        title: "Complaint push case",
        category: "Service",
        severity: "High",
      },
      getById: getComplaintRequestById,
      label: "Complaint Request",
      orgName: "Complaint Push Org",
      role: "editor",
      assertRecord: (record) => {
        expect(record.title).toBe("Complaint push case");
        expect(record.category).toBe("Service");
        expect(record.severity).toBe("High");
      },
      deleteTarget: async (targetId) => {
        await database
          .delete(orbitComplaintRequest)
          .where(eq(orbitComplaintRequest.id, targetId));
      },
    },
    {
      actorId: "user_editor",
      capability: "risk",
      caseTitle: "Risk push case",
      destinationId: "risk-request",
      fieldValues: {
        title: "Risk push case",
        riskLevel: "High",
        owner: "Risk Officer",
      },
      getById: getRiskRequestById,
      label: "Risk Request",
      orgName: "Risk Push Org",
      role: "editor",
      assertRecord: (record) => {
        expect(record.title).toBe("Risk push case");
        expect(record.riskLevel).toBe("High");
        expect(record.owner).toBe("Risk Officer");
      },
      deleteTarget: async (targetId) => {
        await database
          .delete(orbitRiskRequest)
          .where(eq(orbitRiskRequest.id, targetId));
      },
    },
    {
      actorId: "user_editor",
      capability: "project",
      caseTitle: "Project push case",
      destinationId: "project-request",
      fieldValues: {
        title: "Project push case",
        startDate: "2026-07-01",
        budget: "RM50000",
      },
      getById: getProjectRequestById,
      label: "Project Request",
      orgName: "Project Push Org",
      role: "editor",
      assertRecord: (record) => {
        expect(record.title).toBe("Project push case");
        expect(record.startDate).toBe("2026-07-01");
        expect(record.budget).toBe("RM50000");
      },
      deleteTarget: async (targetId) => {
        await database
          .delete(orbitProjectRequest)
          .where(eq(orbitProjectRequest.id, targetId));
      },
    },
    {
      actorId: "user_editor",
      capability: "investigation",
      caseTitle: "Investigation push case",
      destinationId: "investigation-request",
      fieldValues: {
        title: "Investigation push case",
        subject: "Incident 42",
        priority: "Urgent",
      },
      getById: getInvestigationRequestById,
      label: "Investigation Request",
      orgName: "Investigation Push Org",
      role: "editor",
      assertRecord: (record) => {
        expect(record.title).toBe("Investigation push case");
        expect(record.subject).toBe("Incident 42");
        expect(record.priority).toBe("Urgent");
      },
      deleteTarget: async (targetId) => {
        await database
          .delete(orbitInvestigationRequest)
          .where(eq(orbitInvestigationRequest.id, targetId));
      },
    },
    {
      actorId: "user_editor",
      capability: "capa",
      caseTitle: "CAPA push case",
      destinationId: "capa-request",
      fieldValues: {
        title: "CAPA push case",
        rootCause: "Process gap",
        dueDate: "2026-08-01",
      },
      getById: getCapaRequestById,
      label: "CAPA Request",
      orgName: "CAPA Push Org",
      role: "editor",
      assertRecord: (record) => {
        expect(record.title).toBe("CAPA push case");
        expect(record.rootCause).toBe("Process gap");
        expect(record.dueDate).toBe("2026-08-01");
      },
      deleteTarget: async (targetId) => {
        await database
          .delete(orbitCapaRequest)
          .where(eq(orbitCapaRequest.id, targetId));
      },
    },
    {
      actorId: "user_editor",
      capability: "contract-review",
      caseTitle: "Contract review push case",
      destinationId: "contract-review-request",
      fieldValues: {
        title: "Contract review push case",
        counterparty: "Vendor Ltd",
        expiryDate: "2027-01-01",
      },
      getById: getContractReviewRequestById,
      label: "Contract Review Request",
      orgName: "Contract Review Push Org",
      role: "editor",
      assertRecord: (record) => {
        expect(record.title).toBe("Contract review push case");
        expect(record.counterparty).toBe("Vendor Ltd");
        expect(record.expiryDate).toBe("2027-01-01");
      },
      deleteTarget: async (targetId) => {
        await database
          .delete(orbitContractReviewRequest)
          .where(eq(orbitContractReviewRequest.id, targetId));
      },
    },
  ];
