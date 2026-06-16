import "server-only";

import { createId } from "@paralleldrive/cuid2";
import type { OrganizationRole } from "@repo/auth/organization-roles";
import { database } from "@repo/database";
import { orbitCaseAttachment } from "@repo/database/schema";
import { and, desc, eq } from "drizzle-orm";
import type { OrbitCaseAttachmentRecord } from "../../contract/orbit-case.types";
import { recordOrbitCaseActivity } from "../activity/record-activity";
import { getOrbitCaseById } from "../work/orbit-cases";
import { canDeleteOrbitCaseAttachment } from "../work/permissions";

export interface CreateOrbitCaseAttachmentInput {
  blobPathname: string;
  blobUrl: string;
  caseId: string;
  contentType: string;
  fileName: string;
  sizeBytes: number;
}

export const createOrbitCaseAttachment = async (
  organizationId: string,
  actorId: string,
  input: CreateOrbitCaseAttachmentInput
): Promise<OrbitCaseAttachmentRecord | null> => {
  const orbitCaseRecord = await getOrbitCaseById(organizationId, input.caseId);

  if (!orbitCaseRecord) {
    return null;
  }

  const id = createId();
  const now = new Date();

  await database.insert(orbitCaseAttachment).values({
    id,
    caseId: input.caseId,
    organizationId,
    uploadedBy: actorId,
    fileName: input.fileName,
    contentType: input.contentType,
    sizeBytes: input.sizeBytes,
    blobUrl: input.blobUrl,
    blobPathname: input.blobPathname,
    createdAt: now,
  });

  await recordOrbitCaseActivity({
    organizationId,
    caseId: input.caseId,
    actorId,
    action: "attachment.added",
    payload: { attachmentId: id, fileName: input.fileName },
  });

  return {
    id,
    caseId: input.caseId,
    organizationId,
    uploadedBy: actorId,
    fileName: input.fileName,
    contentType: input.contentType,
    sizeBytes: input.sizeBytes,
    blobUrl: input.blobUrl,
    blobPathname: input.blobPathname,
    createdAt: now,
  };
};

export const listOrbitCaseAttachments = async (
  organizationId: string,
  caseId: string
): Promise<OrbitCaseAttachmentRecord[]> => {
  const rows = await database
    .select()
    .from(orbitCaseAttachment)
    .where(
      and(
        eq(orbitCaseAttachment.caseId, caseId),
        eq(orbitCaseAttachment.organizationId, organizationId)
      )
    )
    .orderBy(desc(orbitCaseAttachment.createdAt));

  return rows.map((row) => ({
    id: row.id,
    caseId: row.caseId,
    organizationId: row.organizationId,
    uploadedBy: row.uploadedBy,
    fileName: row.fileName,
    contentType: row.contentType,
    sizeBytes: row.sizeBytes,
    blobUrl: row.blobUrl,
    blobPathname: row.blobPathname,
    createdAt: row.createdAt,
  }));
};

export const deleteOrbitCaseAttachment = async (
  organizationId: string,
  actorId: string,
  role: OrganizationRole,
  attachmentId: string
): Promise<OrbitCaseAttachmentRecord | null> => {
  const [row] = await database
    .select()
    .from(orbitCaseAttachment)
    .where(
      and(
        eq(orbitCaseAttachment.id, attachmentId),
        eq(orbitCaseAttachment.organizationId, organizationId)
      )
    )
    .limit(1);

  if (!row) {
    return null;
  }

  const record: OrbitCaseAttachmentRecord = {
    id: row.id,
    caseId: row.caseId,
    organizationId: row.organizationId,
    uploadedBy: row.uploadedBy,
    fileName: row.fileName,
    contentType: row.contentType,
    sizeBytes: row.sizeBytes,
    blobUrl: row.blobUrl,
    blobPathname: row.blobPathname,
    createdAt: row.createdAt,
  };

  if (!canDeleteOrbitCaseAttachment(role, record, actorId)) {
    return null;
  }

  await database
    .delete(orbitCaseAttachment)
    .where(eq(orbitCaseAttachment.id, attachmentId));

  await recordOrbitCaseActivity({
    organizationId,
    caseId: row.caseId,
    actorId,
    action: "attachment.removed",
    payload: { attachmentId, fileName: row.fileName },
  });

  return record;
};

export const getOrbitCaseAttachmentById = async (
  organizationId: string,
  attachmentId: string
): Promise<OrbitCaseAttachmentRecord | null> => {
  const [row] = await database
    .select()
    .from(orbitCaseAttachment)
    .where(
      and(
        eq(orbitCaseAttachment.id, attachmentId),
        eq(orbitCaseAttachment.organizationId, organizationId)
      )
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    caseId: row.caseId,
    organizationId: row.organizationId,
    uploadedBy: row.uploadedBy,
    fileName: row.fileName,
    contentType: row.contentType,
    sizeBytes: row.sizeBytes,
    blobUrl: row.blobUrl,
    blobPathname: row.blobPathname,
    createdAt: row.createdAt,
  };
};
