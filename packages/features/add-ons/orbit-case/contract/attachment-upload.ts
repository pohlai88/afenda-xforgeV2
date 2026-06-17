import { z } from "zod";
import { orbitCaseBlobAccessSchema } from "./blob-access";

export const ORBIT_CASE_ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;

export const ORBIT_CASE_ATTACHMENT_HANDLE_UPLOAD_URL =
  "/api/orbit-case/attachments/upload" as const;

/** Exact MIME types allowed for Orbit Case attachments (server + client token policy). */
export const ORBIT_CASE_ATTACHMENT_ALLOWED_CONTENT_TYPES = [
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
] as const;

export type OrbitCaseAttachmentContentType =
  (typeof ORBIT_CASE_ATTACHMENT_ALLOWED_CONTENT_TYPES)[number];

const allowedContentTypeSet = new Set<string>(
  ORBIT_CASE_ATTACHMENT_ALLOWED_CONTENT_TYPES
);

export const orbitCaseAttachmentUploadClientPayloadSchema = z.object({
  caseId: z.string().min(1),
  blobAccess: orbitCaseBlobAccessSchema,
  fileName: z.string().trim().min(1).max(255),
  contentType: z.string().trim().min(1).max(200),
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(ORBIT_CASE_ATTACHMENT_MAX_BYTES),
});

export type OrbitCaseAttachmentUploadClientPayload = z.infer<
  typeof orbitCaseAttachmentUploadClientPayloadSchema
>;

export const orbitCaseAttachmentUploadTokenPayloadSchema =
  orbitCaseAttachmentUploadClientPayloadSchema.extend({
    organizationId: z.string().min(1),
    userId: z.string().min(1),
  });

export type OrbitCaseAttachmentUploadTokenPayload = z.infer<
  typeof orbitCaseAttachmentUploadTokenPayloadSchema
>;

export const isOrbitCaseAttachmentContentTypeAllowed = (
  contentType: string
): contentType is OrbitCaseAttachmentContentType =>
  allowedContentTypeSet.has(contentType);

export const sanitizeOrbitCaseAttachmentExtension = (
  fileName: string
): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  return extension.replace(/[^a-z0-9]/g, "") || "bin";
};

export const buildOrbitCaseAttachmentPathname = (input: {
  storagePrefix: string;
  organizationId: string;
  caseId: string;
  fileName: string;
  blobId: string;
}): string => {
  const extension = sanitizeOrbitCaseAttachmentExtension(input.fileName);
  return `${input.storagePrefix}/${input.organizationId}/${input.caseId}/${input.blobId}.${extension}`;
};

export const isOrbitCaseAttachmentPathnameForCase = (
  pathname: string,
  input: {
    storagePrefix: string;
    organizationId: string;
    caseId: string;
  }
): boolean => {
  const expectedPrefix = `${input.storagePrefix}/${input.organizationId}/${input.caseId}/`;
  return (
    pathname.startsWith(expectedPrefix) &&
    pathname.length > expectedPrefix.length
  );
};

export const sanitizeOrbitCaseAttachmentFileName = (fileName: string): string =>
  fileName.replaceAll('"', "");
