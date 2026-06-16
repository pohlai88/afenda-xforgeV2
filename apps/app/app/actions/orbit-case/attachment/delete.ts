"use server";

import { randomUUID } from "node:crypto";
import { getOrganizationRole } from "@repo/auth/cms";
import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  deleteOrbitCaseAttachmentSchema,
  type OrbitCaseAttachmentDto,
  toOrbitCaseAttachmentDto,
} from "@repo/orbit-case";
import { deleteOrbitCaseAttachment } from "@repo/orbit-case/server";
import { keys as storageKeys } from "@repo/storage/keys";
import { del } from "@repo/storage";
import { revalidatePath } from "next/cache";

export const removeAttachment = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseAttachmentDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = deleteOrbitCaseAttachmentSchema.parse(input);
    const role = await getOrganizationRole(userId, orgId);

    if (!role) {
      throw new Error("Organization membership required");
    }

    const removed = await deleteOrbitCaseAttachment(
      orgId,
      userId,
      role,
      parsed.attachmentId
    );

    if (!removed) {
      throw new Error("Attachment not found or not permitted");
    }

    const blobToken = storageKeys().BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      try {
        await del(removed.blobPathname);
      } catch {
        // Metadata delete succeeded; blob cleanup is best-effort.
      }
    }

    revalidatePath("/orbit-case");
    revalidatePath(`/orbit-case/${removed.caseId}`);
    return toOrbitCaseAttachmentDto(removed);
  });
