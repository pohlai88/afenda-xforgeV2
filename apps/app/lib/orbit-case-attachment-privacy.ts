import type { OrbitCaseAttachmentDto, OrbitCaseBlobAccess } from "@repo/orbit-case";
import {
  isOrbitCasePrivateBlobAccess,
  orbitCaseBlobAccessSchema,
} from "@repo/orbit-case";

export const ORBIT_CASE_ATTACHMENT_ACCESS_STORAGE_KEY =
  "xforge.orbitCase.defaultAttachmentAccess";

export const getOrbitCaseAttachmentDownloadHref = (
  attachment: Pick<OrbitCaseAttachmentDto, "blobAccess" | "blobUrl" | "id">
): string =>
  isOrbitCasePrivateBlobAccess(attachment.blobAccess)
    ? `/api/orbit-case/attachments/${attachment.id}`
    : attachment.blobUrl;

export const readOrbitCaseAttachmentAccessPreference =
  (): OrbitCaseBlobAccess => {
    if (typeof window === "undefined") {
      return "public";
    }

    const stored = window.localStorage.getItem(
      ORBIT_CASE_ATTACHMENT_ACCESS_STORAGE_KEY
    );
    const parsed = orbitCaseBlobAccessSchema.safeParse(stored);

    return parsed.success ? parsed.data : "public";
  };

export const writeOrbitCaseAttachmentAccessPreference = (
  value: OrbitCaseBlobAccess
): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORBIT_CASE_ATTACHMENT_ACCESS_STORAGE_KEY, value);
};
