import { apiError } from "@repo/api";
import { getAuthSession } from "@repo/auth/server";
import { isOrbitCasePrivateBlobAccess } from "@repo/orbit-case";
import { getOrbitCaseAttachmentById } from "@repo/orbit-case/server";
import { readPrivateBlob } from "@repo/storage";
import { buildOrbitCaseAttachmentDeliveryHeaders } from "@/lib/orbit-case-attachment-delivery";

interface RouteContext {
  params: Promise<{ attachmentId: string }>;
}

export const GET = async (
  _request: Request,
  context: RouteContext
): Promise<Response> => {
  try {
    const session = await getAuthSession();

    if (!session?.orgId) {
      return apiError("unauthorized", "Unauthorized", 401);
    }

    const { attachmentId } = await context.params;

    if (!attachmentId) {
      return apiError("bad_request", "Missing attachment id", 400);
    }

    const attachment = await getOrbitCaseAttachmentById(
      session.orgId,
      attachmentId
    );

    if (!attachment) {
      return apiError("not_found", "Attachment not found", 404);
    }

    if (!isOrbitCasePrivateBlobAccess(attachment.blobAccess)) {
      return Response.redirect(attachment.blobUrl, 302);
    }

    const file = await readPrivateBlob(attachment.blobUrl);

    if (!file?.stream) {
      return apiError("not_found", "Attachment file not found", 404);
    }

    return new Response(file.stream, {
      headers: buildOrbitCaseAttachmentDeliveryHeaders({
        contentType: attachment.contentType,
        fileName: attachment.fileName,
      }),
    });
  } catch {
    return apiError("internal_error", "Internal server error", 500);
  }
};
