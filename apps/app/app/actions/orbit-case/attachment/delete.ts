"use server";

import { getOrganizationRole } from "@repo/auth/cms";
import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  deleteOrbitCaseAttachmentSchema,
  isOrbitCasePrivateBlobAccess,
  type OrbitCaseAttachmentDto,
  toOrbitCaseAttachmentDto,
} from "@repo/orbit-case";
import { deleteOrbitCaseAttachment } from "@repo/orbit-case/server";
import {
  del,
  getPrivateBlobDeleteOptions,
  getPublicBlobDeleteOptions,
} from "@repo/storage";
import { revalidateOrbitCaseMutation } from "@/lib/orbit-case-revalidate";

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

    try {
      await del(
        removed.blobPathname,
        isOrbitCasePrivateBlobAccess(removed.blobAccess)
          ? getPrivateBlobDeleteOptions()
          : getPublicBlobDeleteOptions()
      );
    } catch {
      // Metadata delete succeeded; blob cleanup is best-effort.
    }

    revalidateOrbitCaseMutation({
      organizationId: orgId,
      caseId: removed.caseId,
    });
    return toOrbitCaseAttachmentDto(removed);
  });
