"use server";

import { randomUUID } from "node:crypto";
import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  createOrbitCaseAttachmentSchema,
  type OrbitCaseAttachmentDto,
  toOrbitCaseAttachmentDto,
} from "@repo/orbit-case";
import { keys as orbitCaseKeys } from "@repo/orbit-case/keys";
import { createOrbitCaseAttachment } from "@repo/orbit-case/server";
import { put } from "@repo/storage";
import { keys as storageKeys } from "@repo/storage/keys";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ORBIT_CASE_ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
]);

const uploadFormSchema = z.object({
  caseId: z.string().min(1),
  filename: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().int().positive().max(5 * 1024 * 1024),
});

const sanitizeExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "bin";
  return extension.replace(/[^a-z0-9]/g, "") || "bin";
};

export const uploadAttachment = async (
  formData: FormData
): Promise<AuthActionResult<OrbitCaseAttachmentDto>> =>
  withOrg(async ({ orgId, userId }) => {
    if (!storageKeys().BLOB_READ_WRITE_TOKEN) {
      throw new Error(
        "File uploads are unavailable — configure BLOB_READ_WRITE_TOKEN"
      );
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("Missing file");
    }

    const parsed = uploadFormSchema.parse({
      caseId: formData.get("caseId"),
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    if (!ORBIT_CASE_ALLOWED_CONTENT_TYPES.has(parsed.contentType)) {
      throw new Error("File type is not allowed");
    }

    const storagePrefix = orbitCaseKeys().ORBIT_CASE_STORAGE_PREFIX;
    const extension = sanitizeExtension(parsed.filename);
    const pathname = `${storagePrefix}/${orgId}/${parsed.caseId}/${randomUUID()}.${extension}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: parsed.contentType,
    });

    const metadataInput = createOrbitCaseAttachmentSchema.parse({
      caseId: parsed.caseId,
      fileName: parsed.filename,
      contentType: parsed.contentType,
      sizeBytes: parsed.size,
      blobUrl: blob.url,
      blobPathname: pathname,
    });

    const attachment = await createOrbitCaseAttachment(orgId, userId, {
      caseId: metadataInput.caseId,
      fileName: metadataInput.fileName,
      contentType: metadataInput.contentType,
      sizeBytes: metadataInput.sizeBytes,
      blobUrl: metadataInput.blobUrl,
      blobPathname: metadataInput.blobPathname,
    });

    if (!attachment) {
      throw new Error("Orbit Case not found");
    }

    revalidatePath("/orbit-case");
    revalidatePath(`/orbit-case/${parsed.caseId}`);
    return toOrbitCaseAttachmentDto(attachment);
  });
