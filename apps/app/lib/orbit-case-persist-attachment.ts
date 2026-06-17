import type { OrbitCaseAttachmentDto } from "@repo/orbit-case";
import {
  createOrbitCaseAttachmentSchema,
  toOrbitCaseAttachmentDto,
} from "@repo/orbit-case";
import { createOrbitCaseAttachment } from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";

export interface PersistOrbitCaseAttachmentInput {
  blobAccess: "public" | "private";
  blobPathname: string;
  blobUrl: string;
  caseId: string;
  contentType: string;
  fileName: string;
  sizeBytes: number;
}

export const persistOrbitCaseUploadedAttachment = async (
  organizationId: string,
  userId: string,
  input: PersistOrbitCaseAttachmentInput
): Promise<OrbitCaseAttachmentDto> => {
  const metadataInput = createOrbitCaseAttachmentSchema.parse({
    caseId: input.caseId,
    fileName: input.fileName,
    contentType: input.contentType,
    sizeBytes: input.sizeBytes,
    blobUrl: input.blobUrl,
    blobPathname: input.blobPathname,
    blobAccess: input.blobAccess,
  });

  const attachment = await createOrbitCaseAttachment(organizationId, userId, {
    caseId: metadataInput.caseId,
    fileName: metadataInput.fileName,
    contentType: metadataInput.contentType,
    sizeBytes: metadataInput.sizeBytes,
    blobUrl: metadataInput.blobUrl,
    blobPathname: metadataInput.blobPathname,
    blobAccess: metadataInput.blobAccess,
  });

  if (!attachment) {
    throw new Error("Orbit Case not found");
  }

  revalidatePath("/orbit-case");
  revalidatePath(`/orbit-case/${input.caseId}`);
  return toOrbitCaseAttachmentDto(attachment);
};
