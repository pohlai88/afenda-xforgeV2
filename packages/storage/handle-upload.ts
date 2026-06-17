import {
  resolvePrivateBlobToken,
  resolvePublicBlobToken,
} from "./keys";

export type BlobHandleUploadAccess = "public" | "private";

export const resolveHandleUploadToken = (
  blobAccess: BlobHandleUploadAccess
): string | undefined =>
  blobAccess === "private"
    ? resolvePrivateBlobToken()
    : resolvePublicBlobToken();
