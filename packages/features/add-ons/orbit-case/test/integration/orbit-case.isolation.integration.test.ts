import { createId } from "@paralleldrive/cuid2";
import {
  database,
  orbitCase,
  orbitCaseActivity,
  organization,
} from "@repo/database";
import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";
import {
  createOrbitCase,
  getOrbitCaseById,
} from "../../engines/work/orbit-cases";
import { hasIntegrationDatabase } from "./has-integration-database";

const hasDatabase = hasIntegrationDatabase();

const createdOrgIds: string[] = [];
const createdCaseIds: string[] = [];

afterEach(async () => {
  for (const caseId of createdCaseIds.splice(0)) {
    await database
      .delete(orbitCaseActivity)
      .where(eq(orbitCaseActivity.caseId, caseId));
    await database.delete(orbitCase).where(eq(orbitCase.id, caseId));
  }

  for (const orgId of createdOrgIds.splice(0)) {
    await database.delete(organization).where(eq(organization.id, orgId));
  }
});

describe.skipIf(!hasDatabase)("orbit case org isolation", () => {
  it("does not return a case from another organization", async () => {
    const orgA = createId();
    const orgB = createId();
    createdOrgIds.push(orgA, orgB);

    const now = new Date();
    await database.insert(organization).values([
      { id: orgA, name: "Org A", updatedAt: now },
      { id: orgB, name: "Org B", updatedAt: now },
    ]);

    const created = await createOrbitCase(orgA, "user_a", {
      title: "Private case",
    });
    createdCaseIds.push(created.id);

    const crossOrgRead = await getOrbitCaseById(orgB, created.id);
    expect(crossOrgRead).toBeNull();
  });
});
