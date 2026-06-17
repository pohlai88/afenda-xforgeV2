import { sanitizeOrbitCaseAttachmentFileName } from "@repo/orbit-case";

export const buildOrbitCaseAttachmentDeliveryHeaders = (input: {
  contentType: string;
  fileName: string;
  disposition?: "inline" | "attachment";
}): HeadersInit => ({
  "Content-Type": input.contentType,
  "Content-Disposition": `${input.disposition ?? "inline"}; filename="${sanitizeOrbitCaseAttachmentFileName(input.fileName)}"`,
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
});
