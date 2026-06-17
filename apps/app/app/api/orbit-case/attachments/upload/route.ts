import { getAuthSession } from "@repo/auth/server";
import {
  isOrbitCaseAttachmentContentTypeAllowed,
  isOrbitCaseAttachmentPathnameForCase,
  ORBIT_CASE_ATTACHMENT_ALLOWED_CONTENT_TYPES,
  ORBIT_CASE_ATTACHMENT_MAX_BYTES,
  orbitCaseAttachmentUploadClientPayloadSchema,
  orbitCaseAttachmentUploadTokenPayloadSchema,
} from "@repo/orbit-case";
import { keys as orbitCaseKeys } from "@repo/orbit-case/keys";
import { getOrbitCaseById } from "@repo/orbit-case/server";
import {
  isBlobUploadConfigured,
  isPrivateBlobConfigured,
  resolveHandleUploadToken,
} from "@repo/storage";
import {
  handleUpload,
  type HandleUploadBody,
} from "@repo/storage/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const resolveUploadTokenFromBody = (
  body: HandleUploadBody
): string | undefined => {
  if (body.type === "blob.generate-client-token") {
    const parsed = orbitCaseAttachmentUploadClientPayloadSchema.safeParse(
      JSON.parse(body.payload.clientPayload ?? "{}")
    );

    if (!parsed.success) {
      return undefined;
    }

    return resolveHandleUploadToken(parsed.data.blobAccess);
  }

  if (body.type === "blob.upload-completed") {
    const parsed = orbitCaseAttachmentUploadTokenPayloadSchema.safeParse(
      JSON.parse(body.payload.tokenPayload ?? "{}")
    );

    if (!parsed.success) {
      return undefined;
    }

    return resolveHandleUploadToken(parsed.data.blobAccess);
  }

  return undefined;
};

export const POST = async (request: Request): Promise<Response> => {
  const body = (await request.json()) as HandleUploadBody;
  const token = resolveUploadTokenFromBody(body);

  if (!token) {
    return NextResponse.json(
      { error: "Invalid upload request" },
      { status: 400 }
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const session = await getAuthSession();

        if (!session?.orgId || !session.user.id) {
          throw new Error("Unauthorized");
        }

        const payload = orbitCaseAttachmentUploadClientPayloadSchema.parse(
          JSON.parse(clientPayload ?? "{}")
        );

        if (!isOrbitCaseAttachmentContentTypeAllowed(payload.contentType)) {
          throw new Error("File type is not allowed");
        }

        if (payload.sizeBytes > ORBIT_CASE_ATTACHMENT_MAX_BYTES) {
          throw new Error("File exceeds maximum size");
        }

        const storagePrefix = orbitCaseKeys().ORBIT_CASE_STORAGE_PREFIX;

        if (
          !isOrbitCaseAttachmentPathnameForCase(pathname, {
            storagePrefix,
            organizationId: session.orgId,
            caseId: payload.caseId,
          })
        ) {
          throw new Error("Invalid upload path");
        }

        const orbitCaseRecord = await getOrbitCaseById(
          session.orgId,
          payload.caseId
        );

        if (!orbitCaseRecord) {
          throw new Error("Orbit Case not found");
        }

        if (
          payload.blobAccess === "private" &&
          !isPrivateBlobConfigured()
        ) {
          throw new Error("Private uploads are unavailable");
        }

        if (payload.blobAccess === "public" && !isBlobUploadConfigured()) {
          throw new Error("Public uploads are unavailable");
        }

        return {
          allowedContentTypes: [
            ...ORBIT_CASE_ATTACHMENT_ALLOWED_CONTENT_TYPES,
          ],
          maximumSizeInBytes: ORBIT_CASE_ATTACHMENT_MAX_BYTES,
          tokenPayload: JSON.stringify(
            orbitCaseAttachmentUploadTokenPayloadSchema.parse({
              ...payload,
              organizationId: session.orgId,
              userId: session.user.id,
            })
          ),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
