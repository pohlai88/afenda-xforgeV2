import type { OrbitCaseBlobAccess } from "../../contract/blob-access";
import { orbitCaseBlobAccessSchema } from "../../contract/blob-access";
import type { OrbitCaseAttachmentRecord } from "../../contract/orbit-case.types";

export const parseOrbitCaseBlobAccess = (
  value: string | null | undefined
): OrbitCaseBlobAccess =>
  value === "private"
    ? "private"
    : orbitCaseBlobAccessSchema.parse("public");

export const mapOrbitCaseAttachmentRow = (row: {
  blobAccess?: string | null;
  blobPathname: string;
  blobUrl: string;
  caseId: string;
  contentType: string;
  createdAt: Date;
  fileName: string;
  id: string;
  organizationId: string;
  sizeBytes: number;
  uploadedBy: string;
}): OrbitCaseAttachmentRecord => ({
  id: row.id,
  caseId: row.caseId,
  organizationId: row.organizationId,
  uploadedBy: row.uploadedBy,
  fileName: row.fileName,
  contentType: row.contentType,
  sizeBytes: row.sizeBytes,
  blobUrl: row.blobUrl,
  blobPathname: row.blobPathname,
  blobAccess: parseOrbitCaseBlobAccess(row.blobAccess),
  createdAt: row.createdAt,
});
