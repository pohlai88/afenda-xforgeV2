import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import {
  orbitCase,
  orbitCaseActivity,
  orbitCaseAttachment,
  organization,
} from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it } from "vitest";
import {
  createOrbitCaseAttachment,
  deleteOrbitCaseAttachment,
  listOrbitCaseAttachments,
} from "../../engines/attachment/attachments";
import { createOrbitCase } from "../../engines/work/orbit-cases";

const createdOrgIds: string[] = [];
const createdCaseIds: string[] = [];
const createdAttachmentIds: string[] = [];

afterEach(async () => {
  for (const attachmentId of createdAttachmentIds.splice(0)) {
    await database
      .delete(orbitCaseAttachment)
      .where(eq(orbitCaseAttachment.id, attachmentId));
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
});

describe("orbit case attachment isolation", () => {
  it("does not list or delete attachments across organizations", async () => {
    const orgA = createId();
    const orgB = createId();
    createdOrgIds.push(orgA, orgB);

    const now = new Date();
    await database.insert(organization).values([
      { id: orgA, name: "Org A", updatedAt: now },
      { id: orgB, name: "Org B", updatedAt: now },
    ]);

    const created = await createOrbitCase(orgA, "user_a", {
      title: "Attachment case",
    });
    createdCaseIds.push(created.id);

    const attachment = await createOrbitCaseAttachment(orgA, "user_a", {
      caseId: created.id,
      fileName: "notes.txt",
      contentType: "text/plain",
      sizeBytes: 12,
      blobUrl: "https://example.com/notes.txt",
      blobPathname: `orbit-case/${orgA}/${created.id}/notes.txt`,
      blobAccess: "public",
    });

    expect(attachment).not.toBeNull();
    createdAttachmentIds.push(attachment!.id);

    const crossOrgList = await listOrbitCaseAttachments(orgB, created.id);
    expect(crossOrgList).toHaveLength(0);

    const crossOrgDelete = await deleteOrbitCaseAttachment(
      orgB,
      "user_b",
      "owner",
      attachment!.id
    );
    expect(crossOrgDelete).toBeNull();

    const orgAList = await listOrbitCaseAttachments(orgA, created.id);
    expect(orgAList).toHaveLength(1);
  });
});
