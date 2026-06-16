import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { keys } from "./keys";
import { normalizeLocale } from "./locale";

const TOKEN_TTL_MS = 60 * 60 * 1000;

interface PreviewPayload {
  collection: string;
  exp: number;
  locale: string;
  slug: string;
}

const encodePayload = (payload: PreviewPayload): string =>
  Buffer.from(JSON.stringify(payload)).toString("base64url");

const decodePayload = (encoded: string): PreviewPayload | null => {
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as PreviewPayload;

    if (
      typeof parsed.collection !== "string" ||
      typeof parsed.locale !== "string" ||
      typeof parsed.slug !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const createPreviewToken = (
  collection: string,
  locale: string,
  slug: string
): string | null => {
  const secret = keys().CMS_PREVIEW_SECRET;

  if (!secret) {
    return null;
  }

  const payload = encodePayload({
    collection,
    locale: normalizeLocale(locale),
    slug,
    exp: Date.now() + TOKEN_TTL_MS,
  });
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
};

export const verifyPreviewToken = (
  token: string,
  collection: string,
  locale: string,
  slug: string
): boolean => {
  const secret = keys().CMS_PREVIEW_SECRET;

  if (!secret) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!(payload && signature)) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }

  const decoded = decodePayload(payload);

  if (!decoded) {
    return false;
  }

  if (
    decoded.collection !== collection ||
    decoded.locale !== normalizeLocale(locale) ||
    decoded.slug !== slug
  ) {
    return false;
  }

  return decoded.exp >= Date.now();
};
