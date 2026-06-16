import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import {
  orbitBudgetRequest,
  orbitCase,
  orbitCaseActivity,
  orbitObjectLink,
  orbitPushEvent,
  organization,
} from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";
import { executePush } from "../../engines/morph/push-orchestrator";
import { createOrbitCase } from "../../engines/work/orbit-cases";
import {
  clearPushDestinations,
  registerPushDestination,
} from "../../lib/registry/push-destination-registry";
import { clearPushTemplates, registerPushTemplate } from "../../lib/registry/template-registry";

const createdOrgIds: string[] = [];
const createdCaseIds: string[] = [];
const createdPushEventIds: string[] = [];
const createdBudgetIds: string[] = [];
const createdLinkIds: string[] = [];

afterEach(async () => {
  for (const linkId of createdLinkIds.splice(0)) {
    await database.delete(orbitObjectLink).where(eq(orbitObjectLink.id, linkId));
  }

  for (const pushEventId of createdPushEventIds.splice(0)) {
    await database.delete(orbitPushEvent).where(eq(orbitPushEvent.id, pushEventId));
  }

  for (const budgetId of createdBudgetIds.splice(0)) {
    await database
      .delete(orbitBudgetRequest)
      .where(eq(orbitBudgetRequest.id, budgetId));
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

describe("orbit case push idempotency", () => {
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
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
      ],
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
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
      ],
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
});
