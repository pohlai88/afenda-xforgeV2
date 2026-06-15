import { createHmac, timingSafeEqual } from "node:crypto";
import { DEFAULT_WEBHOOK_SIGNATURE_TOLERANCE_SEC } from "./constants";
import { buildSignedContent } from "./signing";
import { parseSigningSecret } from "./secrets";

export type VerifyStandardWebhookInput = {
  secret: string;
  rawBody: string;
  headers: Record<string, string | undefined> | Headers;
  toleranceSeconds?: number;
};

export type VerifyStandardWebhookResult =
  | { ok: true; id: string; timestamp: number }
  | { ok: false; error: string };

const readDefaultToleranceSeconds = (): number => {
  const fromEnv = Number(process.env.WEBHOOK_SIGNATURE_TOLERANCE_SEC);

  if (Number.isFinite(fromEnv) && fromEnv > 0) {
    return fromEnv;
  }

  return DEFAULT_WEBHOOK_SIGNATURE_TOLERANCE_SEC;
};

const normalizeHeaders = (
  headers: Record<string, string | undefined> | Headers
): Record<string, string> => {
  if (headers instanceof Headers) {
    const normalized: Record<string, string> = {};

    for (const [key, value] of headers.entries()) {
      normalized[key.toLowerCase()] = value;
    }

    return normalized;
  }

  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      normalized[key.toLowerCase()] = value;
    }
  }

  return normalized;
};

const verifySignaturePart = (
  key: Buffer,
  signedContent: string,
  signaturePart: string
): boolean => {
  const [version, encoded] = signaturePart.split(",", 2);

  if (version !== "v1" || !encoded) {
    return false;
  }

  try {
    const expected = createHmac("sha256", key)
      .update(signedContent, "utf8")
      .digest();
    const actual = Buffer.from(encoded, "base64");

    if (expected.length !== actual.length) {
      return false;
    }

    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
};

export const verifyStandardWebhook = (
  input: VerifyStandardWebhookInput
): VerifyStandardWebhookResult => {
  const headers = normalizeHeaders(input.headers);
  const id = headers["webhook-id"];
  const timestamp = headers["webhook-timestamp"];
  const signatureHeader = headers["webhook-signature"];

  if (!id || !timestamp || !signatureHeader) {
    return { ok: false, error: "Missing webhook headers" };
  }

  const parsedTimestamp = Number(timestamp);

  if (!Number.isFinite(parsedTimestamp)) {
    return { ok: false, error: "Invalid webhook-timestamp" };
  }

  const tolerance = input.toleranceSeconds ?? readDefaultToleranceSeconds();
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - parsedTimestamp) > tolerance) {
    return { ok: false, error: "Timestamp outside tolerance" };
  }

  let key: Buffer;

  try {
    key = parseSigningSecret(input.secret);
  } catch {
    return { ok: false, error: "Invalid webhook signing secret" };
  }

  const signedContent = buildSignedContent(id, timestamp, input.rawBody);
  const signatureParts = signatureHeader.split(" ");

  for (const part of signatureParts) {
    if (verifySignaturePart(key, signedContent, part)) {
      return { ok: true, id, timestamp: parsedTimestamp };
    }
  }

  return { ok: false, error: "Invalid signature" };
};
