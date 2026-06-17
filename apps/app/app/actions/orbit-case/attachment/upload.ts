"use server";

import { randomUUID } from "node:crypto";
import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  buildOrbitCaseAttachmentPathname,
  type OrbitCaseAttachmentDto,
} from "@repo/orbit-case";
import { keys as orbitCaseKeys } from "@repo/orbit-case/keys";
import {
  getPrivateBlobPutOptions,
  getPublicBlobPutOptions,
  put,
} from "@repo/storage";
import {
  assertOrbitCaseAttachmentUploadReady,
  orbitCaseAttachmentUploadInputSchema,
} from "@/lib/orbit-case-attachment-upload-input";
import { persistOrbitCaseUploadedAttachment } from "@/lib/orbit-case-persist-attachment";

export const uploadAttachment = async (
  formData: FormData
): Promise<AuthActionResult<OrbitCaseAttachmentDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("Missing file");
    }

    const parsed = orbitCaseAttachmentUploadInputSchema.parse({
      caseId: formData.get("caseId"),
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      blobAccess: formData.get("blobAccess") ?? "public",
    });

    assertOrbitCaseAttachmentUploadReady(parsed);

    const pathname = buildOrbitCaseAttachmentPathname({
      storagePrefix: orbitCaseKeys().ORBIT_CASE_STORAGE_PREFIX,
      organizationId: orgId,
      caseId: parsed.caseId,
      fileName: parsed.fileName,
      blobId: randomUUID(),
    });

    const blob = await put(
      pathname,
      file,
      parsed.blobAccess === "private"
        ? getPrivateBlobPutOptions(parsed.contentType)
        : getPublicBlobPutOptions(parsed.contentType)
    );

    return persistOrbitCaseUploadedAttachment(orgId, userId, {
      ...parsed,
      blobUrl: blob.url,
      blobPathname: pathname,
    });
  });
