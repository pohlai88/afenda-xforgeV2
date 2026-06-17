import {
  resolvePrivateBlobToken,
  resolvePrivateStoreId,
  resolvePublicBlobToken,
  resolvePublicStoreId,
} from "./keys";

export interface PublicBlobPutOptions {
  access: "public";
  contentType: string;
  storeId?: string;
  token?: string;
}

export interface PrivateBlobPutOptions {
  access: "private";
  contentType?: string;
  storeId?: string;
  token?: string;
}

export interface BlobStoreDeleteOptions {
  storeId?: string;
  token?: string;
}

export interface PrivateBlobGetOptions {
  access: "private";
  token?: string;
}

export const isBlobUploadConfigured = (): boolean =>
  Boolean(resolvePublicBlobToken() && resolvePublicStoreId());

export const isPrivateBlobConfigured = (): boolean =>
  Boolean(resolvePrivateBlobToken() && resolvePrivateStoreId());

export const getPublicBlobPutOptions = (
  contentType: string
): PublicBlobPutOptions => {
  const token = resolvePublicBlobToken();
  const storeId = resolvePublicStoreId();

  return {
    access: "public",
    contentType,
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
};

export const getPrivateBlobPutOptions = (
  contentType?: string
): PrivateBlobPutOptions => {
  const token = resolvePrivateBlobToken();
  const storeId = resolvePrivateStoreId();

  return {
    access: "private",
    ...(contentType ? { contentType } : {}),
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
};

export const getPublicBlobDeleteOptions = (): BlobStoreDeleteOptions => {
  const token = resolvePublicBlobToken();
  const storeId = resolvePublicStoreId();

  return {
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
};

export const getPrivateBlobDeleteOptions = (): BlobStoreDeleteOptions => {
  const token = resolvePrivateBlobToken();
  const storeId = resolvePrivateStoreId();

  return {
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
};

export const getPrivateBlobGetOptions = (): PrivateBlobGetOptions => {
  const token = resolvePrivateBlobToken();

  return {
    access: "private",
    ...(token ? { token } : {}),
  };
};
