import { describe, expect, it } from "vitest";
import {
  buildOrbitCaseAttachmentPathname,
  isOrbitCaseAttachmentContentTypeAllowed,
  isOrbitCaseAttachmentPathnameForCase,
  orbitCaseAttachmentUploadClientPayloadSchema,
  sanitizeOrbitCaseAttachmentExtension,
  sanitizeOrbitCaseAttachmentFileName,
} from "../contract/attachment-upload";

describe("orbit case attachment upload contract", () => {
  it("builds org-scoped pathnames", () => {
    expect(
      buildOrbitCaseAttachmentPathname({
        storagePrefix: "orbit-case",
        organizationId: "org_1",
        caseId: "case_1",
        fileName: "Notes.PDF",
        blobId: "blob_1",
      })
    ).toBe("orbit-case/org_1/case_1/blob_1.pdf");
  });

  it("validates pathname prefix for a case", () => {
    const pathname = "orbit-case/org_1/case_1/blob_1.pdf";

    expect(
      isOrbitCaseAttachmentPathnameForCase(pathname, {
        storagePrefix: "orbit-case",
        organizationId: "org_1",
        caseId: "case_1",
      })
    ).toBe(true);

    expect(
      isOrbitCaseAttachmentPathnameForCase("orbit-case/org_2/case_1/blob_1.pdf", {
        storagePrefix: "orbit-case",
        organizationId: "org_1",
        caseId: "case_1",
      })
    ).toBe(false);
  });

  it("accepts allowed content types only", () => {
    expect(isOrbitCaseAttachmentContentTypeAllowed("text/plain")).toBe(true);
    expect(isOrbitCaseAttachmentContentTypeAllowed("application/zip")).toBe(
      false
    );
  });

  it("parses client upload payload", () => {
    expect(
      orbitCaseAttachmentUploadClientPayloadSchema.parse({
        caseId: "case_1",
        blobAccess: "private",
        fileName: "notes.txt",
        contentType: "text/plain",
        sizeBytes: 12,
      })
    ).toEqual({
      caseId: "case_1",
      blobAccess: "private",
      fileName: "notes.txt",
      contentType: "text/plain",
      sizeBytes: 12,
    });
  });

  it("sanitizes file names and extensions", () => {
    expect(sanitizeOrbitCaseAttachmentExtension("report.v2.pdf")).toBe("pdf");
    expect(sanitizeOrbitCaseAttachmentFileName('file"name.txt')).toBe(
      'filename.txt'
    );
  });
});
