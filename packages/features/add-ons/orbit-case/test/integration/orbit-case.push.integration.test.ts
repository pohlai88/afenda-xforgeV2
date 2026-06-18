import { createId } from "@paralleldrive/cuid2";
import {
  database,
  orbitBudgetRequest,
  orbitCase,
  orbitCaseActivity,
  orbitApprovalRequest,
  orbitMeetingRequest,
  orbitObjectLink,
  orbitPushEvent,
  organization,
} from "@repo/database";
import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";
import { getApprovalRequestById } from "../../engines/approval/approval-requests";
import { getBudgetRequestById } from "../../engines/budget/budget-requests";
import { getMeetingRequestById } from "../../engines/meeting/meeting-requests";
import { executePush } from "../../engines/morph/push-orchestrator";
import { createOrbitCase } from "../../engines/work/orbit-cases";
import {
  clearPushDestinations,
  registerPushDestination,
} from "../../lib/registry/push-destination-registry";
import {
  clearPushTemplates,
  registerPushTemplate,
} from "../../lib/registry/template-registry";
import { TWO_FIELD_MORPH_PUSH_INTEGRATION_CASES } from "./morph-push-destination-cases";
import { hasIntegrationDatabase } from "./has-integration-database";

const hasDatabase = hasIntegrationDatabase();

const createdOrgIds: string[] = [];
const createdCaseIds: string[] = [];
const createdPushEventIds: string[] = [];
const createdBudgetIds: string[] = [];
const createdMeetingIds: string[] = [];
const createdApprovalIds: string[] = [];
const createdMorphTargetIds: Array<{
  deleteTarget: (targetId: string) => Promise<void>;
  targetId: string;
}> = [];
const createdLinkIds: string[] = [];

afterEach(async () => {
  for (const linkId of createdLinkIds.splice(0)) {
    await database
      .delete(orbitObjectLink)
      .where(eq(orbitObjectLink.id, linkId));
  }

  for (const pushEventId of createdPushEventIds.splice(0)) {
    await database
      .delete(orbitPushEvent)
      .where(eq(orbitPushEvent.id, pushEventId));
  }

  for (const budgetId of createdBudgetIds.splice(0)) {
    await database
      .delete(orbitBudgetRequest)
      .where(eq(orbitBudgetRequest.id, budgetId));
  }

  for (const meetingId of createdMeetingIds.splice(0)) {
    await database
      .delete(orbitMeetingRequest)
      .where(eq(orbitMeetingRequest.id, meetingId));
  }

  for (const approvalId of createdApprovalIds.splice(0)) {
    await database
      .delete(orbitApprovalRequest)
      .where(eq(orbitApprovalRequest.id, approvalId));
  }

  for (const entry of createdMorphTargetIds.splice(0)) {
    await entry.deleteTarget(entry.targetId);
  }

  for (const caseId of createdCaseIds.splice(0)) {
    await database
      .delete(orbitCaseActivity)
      .where(eq(orbitCaseActivity.caseId, caseId));
    await database.delete(orbitCase).where(eq(orbitCase.id, caseId));
  }

  for (const orgId of createdOrgIds.splice(0)) {
    await database.delete(organization).where(eq(organization.id, orgId));
  }

  clearPushDestinations();
  clearPushTemplates();
});

describe.skipIf(!hasDatabase)("orbit case push idempotency", () => {
  it("returns cached result for duplicate idempotency keys", async () => {
    clearPushDestinations();
    clearPushTemplates();

    registerPushDestination({
      id: "budget-request",
      label: "Budget Request",
      templateId: "budget-request-template",
      requiredCapabilities: ["budget"],
      visibleToRoles: ["owner", "editor"],
    });

    registerPushTemplate({
      id: "budget-request-template",
      destinationId: "budget-request",
      label: "Budget Request",
      fields: [{ key: "title", label: "Title", type: "text", required: true }],
    });

    const orgId = createId();
    createdOrgIds.push(orgId);
    const now = new Date();

    await database.insert(organization).values({
      id: orgId,
      name: "Push Org",
      updatedAt: now,
    });

    const created = await createOrbitCase(orgId, "user_owner", {
      title: "Budget push case",
    });
    createdCaseIds.push(created.id);

    const idempotencyKey = createId();
    const context = {
      organizationId: orgId,
      actorId: "user_owner",
      role: "owner" as const,
      userCapabilities: ["budget"] as const,
    };

    const first = await executePush(context, {
      caseId: created.id,
      destinationId: "budget-request",
      idempotencyKey,
      fieldValues: { title: "Budget push case" },
    });

    expect(first.ok).toBe(true);

    if (first.ok) {
      createdPushEventIds.push(first.pushEventId);
      createdBudgetIds.push(first.targetId);
      createdLinkIds.push(first.linkId);
    }

    const second = await executePush(context, {
      caseId: created.id,
      destinationId: "budget-request",
      idempotencyKey,
      fieldValues: { title: "Budget push case" },
    });

    expect(second.ok).toBe(true);

    if (first.ok && second.ok) {
      expect(second.cached).toBe(true);
      expect(second.pushEventId).toBe(first.pushEventId);
      expect(second.targetId).toBe(first.targetId);
    }

    if (first.ok) {
      const budget = await getBudgetRequestById(orgId, first.targetId);
      expect(budget?.originCaseId).toBe(created.id);
      expect(budget?.title).toBe("Budget push case");
    }
  });

  it("denies push when capability is missing", async () => {
    clearPushDestinations();
    clearPushTemplates();

    registerPushDestination({
      id: "budget-request",
      label: "Budget Request",
      templateId: "budget-request-template",
      requiredCapabilities: ["budget"],
      visibleToRoles: ["owner", "editor", "member"],
    });

    registerPushTemplate({
      id: "budget-request-template",
      destinationId: "budget-request",
      label: "Budget Request",
      fields: [{ key: "title", label: "Title", type: "text", required: true }],
    });

    const orgId = createId();
    createdOrgIds.push(orgId);
    const now = new Date();

    await database.insert(organization).values({
      id: orgId,
      name: "Push Org",
      updatedAt: now,
    });

    const created = await createOrbitCase(orgId, "user_member", {
      title: "Forbidden push",
    });
    createdCaseIds.push(created.id);

    const result = await executePush(
      {
        organizationId: orgId,
        actorId: "user_member",
        role: "member",
        userCapabilities: ["meeting"],
      },
      {
        caseId: created.id,
        destinationId: "budget-request",
        idempotencyKey: createId(),
        fieldValues: { title: "Forbidden push" },
      }
    );

    expect(result).toEqual({ ok: false, code: "forbidden" });
  });

  it("allows member to push meeting when capability is present", async () => {
    clearPushDestinations();
    clearPushTemplates();

    registerPushDestination({
      id: "meeting-request",
      label: "Meeting Request",
      templateId: "meeting-request-template",
      requiredCapabilities: ["meeting"],
      visibleToRoles: ["owner", "editor", "member"],
    });

    registerPushTemplate({
      id: "meeting-request-template",
      destinationId: "meeting-request",
      label: "Meeting Request",
      fields: [{ key: "title", label: "Title", type: "text", required: true }],
    });

    const orgId = createId();
    createdOrgIds.push(orgId);
    const now = new Date();

    await database.insert(organization).values({
      id: orgId,
      name: "Meeting Push Org",
      updatedAt: now,
    });

    const created = await createOrbitCase(orgId, "user_member", {
      title: "Meeting push case",
    });
    createdCaseIds.push(created.id);

    const result = await executePush(
      {
        organizationId: orgId,
        actorId: "user_member",
        role: "member",
        userCapabilities: ["meeting"],
      },
      {
        caseId: created.id,
        destinationId: "meeting-request",
        idempotencyKey: createId(),
        fieldValues: {
          title: "Meeting push case",
          location: "Room A",
        },
      }
    );

    expect(result.ok).toBe(true);

    if (result.ok) {
      createdPushEventIds.push(result.pushEventId);
      createdMeetingIds.push(result.targetId);
      createdLinkIds.push(result.linkId);

      const meeting = await getMeetingRequestById(orgId, result.targetId);
      expect(meeting?.originCaseId).toBe(created.id);
      expect(meeting?.title).toBe("Meeting push case");
      expect(meeting?.location).toBe("Room A");
    }
  });

  it("allows editor to push approval when capability is present", async () => {
    clearPushDestinations();
    clearPushTemplates();

    registerPushDestination({
      id: "approval-request",
      label: "Approval Request",
      templateId: "approval-request-template",
      requiredCapabilities: ["approval"],
      visibleToRoles: ["owner", "editor"],
    });

    registerPushTemplate({
      id: "approval-request-template",
      destinationId: "approval-request",
      label: "Approval Request",
      fields: [{ key: "title", label: "Title", type: "text", required: true }],
    });

    const orgId = createId();
    createdOrgIds.push(orgId);
    const now = new Date();

    await database.insert(organization).values({
      id: orgId,
      name: "Approval Push Org",
      updatedAt: now,
    });

    const created = await createOrbitCase(orgId, "user_editor", {
      title: "Approval push case",
    });
    createdCaseIds.push(created.id);

    const result = await executePush(
      {
        organizationId: orgId,
        actorId: "user_editor",
        role: "editor",
        userCapabilities: ["approval"],
      },
      {
        caseId: created.id,
        destinationId: "approval-request",
        idempotencyKey: createId(),
        fieldValues: {
          title: "Approval push case",
          approver: "CFO",
          amount: "RM10000",
        },
      }
    );

    expect(result.ok).toBe(true);

    if (result.ok) {
      createdPushEventIds.push(result.pushEventId);
      createdApprovalIds.push(result.targetId);
      createdLinkIds.push(result.linkId);

      const approval = await getApprovalRequestById(orgId, result.targetId);
      expect(approval?.originCaseId).toBe(created.id);
      expect(approval?.title).toBe("Approval push case");
      expect(approval?.approver).toBe("CFO");
      expect(approval?.amount).toBe("RM10000");
    }
  });

  for (const testCase of TWO_FIELD_MORPH_PUSH_INTEGRATION_CASES) {
    it(`allows ${testCase.role} to push ${testCase.label} when capability is present`, async () => {
      clearPushDestinations();
      clearPushTemplates();

      const templateId = `${testCase.destinationId}-template`;

      registerPushDestination({
        id: testCase.destinationId,
        label: testCase.label,
        templateId,
        requiredCapabilities: [testCase.capability],
        visibleToRoles: ["owner", "editor"],
      });

      registerPushTemplate({
        id: templateId,
        destinationId: testCase.destinationId,
        label: testCase.label,
        fields: [{ key: "title", label: "Title", type: "text", required: true }],
      });

      const orgId = createId();
      createdOrgIds.push(orgId);
      const now = new Date();

      await database.insert(organization).values({
        id: orgId,
        name: testCase.orgName,
        updatedAt: now,
      });

      const created = await createOrbitCase(orgId, testCase.actorId, {
        title: testCase.caseTitle,
      });
      createdCaseIds.push(created.id);

      const result = await executePush(
        {
          organizationId: orgId,
          actorId: testCase.actorId,
          role: testCase.role,
          userCapabilities: [testCase.capability],
        },
        {
          caseId: created.id,
          destinationId: testCase.destinationId,
          idempotencyKey: createId(),
          fieldValues: testCase.fieldValues,
        }
      );

      expect(result.ok).toBe(true);

      if (result.ok) {
        createdPushEventIds.push(result.pushEventId);
        createdLinkIds.push(result.linkId);

        createdMorphTargetIds.push({
          deleteTarget: testCase.deleteTarget,
          targetId: result.targetId,
        });

        const record = await testCase.getById(orgId, result.targetId);
        expect(record?.originCaseId).toBe(created.id);

        if (record) {
          testCase.assertRecord(record);
        }
      }
    });
  }
});
