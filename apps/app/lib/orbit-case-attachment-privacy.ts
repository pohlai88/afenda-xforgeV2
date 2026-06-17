import type { OrbitCaseAttachmentDto } from "@repo/orbit-case";
import { isOrbitCasePrivateBlobAccess } from "@repo/orbit-case";

export const ORBIT_CASE_ATTACHMENT_ACCESS_STORAGE_KEY =
  "xforge.orbitCase.defaultAttachmentAccess";

export type OrbitCaseAttachmentAccessPreference = "public" | "private";

export const getOrbitCaseAttachmentDownloadHref = (
  attachment: Pick<OrbitCaseAttachmentDto, "blobAccess" | "blobUrl" | "id">
): string =>
  isOrbitCasePrivateBlobAccess(attachment.blobAccess)
    ? `/api/orbit-case/attachments/${attachment.id}`
    : attachment.blobUrl;

export const readOrbitCaseAttachmentAccessPreference =
  (): OrbitCaseAttachmentAccessPreference => {
    if (typeof window === "undefined") {
      return "public";
    }

    const stored = window.localStorage.getItem(
      ORBIT_CASE_ATTACHMENT_ACCESS_STORAGE_KEY
    );

    return stored === "private" ? "private" : "public";
  };

export const writeOrbitCaseAttachmentAccessPreference = (
  value: OrbitCaseAttachmentAccessPreference
): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORBIT_CASE_ATTACHMENT_ACCESS_STORAGE_KEY, value);
};
