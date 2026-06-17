import { del, get, put } from "@vercel/blob";
import {
  getPrivateBlobDeleteOptions,
  getPrivateBlobGetOptions,
  getPrivateBlobPutOptions,
  isPrivateBlobConfigured,
} from "./blob-stores";

type BlobBody = Parameters<typeof put>[1];

const assertPrivateBlobConfigured = (): void => {
  if (!isPrivateBlobConfigured()) {
    throw new Error(
      "Private blob storage is unavailable — configure XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN and XFORGE_STORE_ID"
    );
  }
};

export const uploadPrivateBlob = async (
  pathname: string,
  body: BlobBody,
  contentType?: string
) => {
  assertPrivateBlobConfigured();
  return put(pathname, body, getPrivateBlobPutOptions(contentType));
};

export const readPrivateBlob = async (url: string) => {
  assertPrivateBlobConfigured();
  return get(url, getPrivateBlobGetOptions());
};

export const deletePrivateBlob = async (pathnameOrUrl: string) => {
  assertPrivateBlobConfigured();
  return del(pathnameOrUrl, getPrivateBlobDeleteOptions());
};
