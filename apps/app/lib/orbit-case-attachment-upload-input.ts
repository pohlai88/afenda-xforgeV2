import {
  isOrbitCaseAttachmentContentTypeAllowed,
  ORBIT_CASE_ATTACHMENT_MAX_BYTES,
  orbitCaseBlobAccessSchema,
} from "@repo/orbit-case";
import {
  isBlobUploadConfigured,
  isPrivateBlobConfigured,
} from "@repo/storage";
import { z } from "zod";

export const orbitCaseAttachmentUploadInputSchema = z.object({
  caseId: z.string().min(1),
  fileName: z.string().trim().min(1).max(255),
  contentType: z.string().trim().min(1).max(200),
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(ORBIT_CASE_ATTACHMENT_MAX_BYTES),
  blobAccess: orbitCaseBlobAccessSchema.default("public"),
});

export type OrbitCaseAttachmentUploadInput = z.infer<
  typeof orbitCaseAttachmentUploadInputSchema
>;

export const orbitCaseAttachmentFinalizeInputSchema =
  orbitCaseAttachmentUploadInputSchema.extend({
    blobUrl: z.string().url(),
    blobPathname: z.string().trim().min(1).max(500),
  });

export type OrbitCaseAttachmentFinalizeInput = z.infer<
  typeof orbitCaseAttachmentFinalizeInputSchema
>;

export const assertOrbitCaseAttachmentUploadReady = (
  parsed: OrbitCaseAttachmentUploadInput
): void => {
  if (!isOrbitCaseAttachmentContentTypeAllowed(parsed.contentType)) {
    throw new Error("File type is not allowed");
  }

  if (parsed.blobAccess === "private" && !isPrivateBlobConfigured()) {
    throw new Error(
      "Private uploads are unavailable — configure XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN and XFORGE_STORE_ID"
    );
  }

  if (parsed.blobAccess === "public" && !isBlobUploadConfigured()) {
    throw new Error(
      "Public uploads are unavailable — configure XFORGE_PUB_BLOB_READ_WRITE_TOKEN and XFORGE_PUB_STORE_ID"
    );
  }
};
