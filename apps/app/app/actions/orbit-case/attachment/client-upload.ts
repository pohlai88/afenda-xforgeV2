"use server";

import { randomUUID } from "node:crypto";
import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  buildOrbitCaseAttachmentPathname,
  ORBIT_CASE_ATTACHMENT_HANDLE_UPLOAD_URL,
  type OrbitCaseAttachmentDto,
} from "@repo/orbit-case";
import { keys as orbitCaseKeys } from "@repo/orbit-case/keys";
import { getOrbitCaseById } from "@repo/orbit-case/server";
import { persistOrbitCaseUploadedAttachment } from "@/lib/orbit-case-persist-attachment";
import {
  assertOrbitCaseAttachmentUploadReady,
  orbitCaseAttachmentFinalizeInputSchema,
  orbitCaseAttachmentUploadInputSchema,
} from "@/lib/orbit-case-attachment-upload-input";

export interface PrepareAttachmentUploadResult {
  handleUploadUrl: typeof ORBIT_CASE_ATTACHMENT_HANDLE_UPLOAD_URL;
  pathname: string;
}

export const prepareAttachmentUpload = async (
  input: unknown
): Promise<AuthActionResult<PrepareAttachmentUploadResult>> =>
  withOrg(async ({ orgId }) => {
    const parsed = orbitCaseAttachmentUploadInputSchema.parse(input);
    assertOrbitCaseAttachmentUploadReady(parsed);

    const orbitCaseRecord = await getOrbitCaseById(orgId, parsed.caseId);

    if (!orbitCaseRecord) {
      throw new Error("Orbit Case not found");
    }

    return {
      pathname: buildOrbitCaseAttachmentPathname({
        storagePrefix: orbitCaseKeys().ORBIT_CASE_STORAGE_PREFIX,
        organizationId: orgId,
        caseId: parsed.caseId,
        fileName: parsed.fileName,
        blobId: randomUUID(),
      }),
      handleUploadUrl: ORBIT_CASE_ATTACHMENT_HANDLE_UPLOAD_URL,
    };
  });

export const finalizeAttachmentUpload = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseAttachmentDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = orbitCaseAttachmentFinalizeInputSchema.parse(input);
    assertOrbitCaseAttachmentUploadReady(parsed);

    return persistOrbitCaseUploadedAttachment(orgId, userId, parsed);
  });
