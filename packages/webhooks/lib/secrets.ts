import { randomBytes } from "node:crypto";

const WHSEC_PREFIX = "whsec_";

/** Base64-encoded 32-byte signing secret for database storage. */
export const generateWebhookSecret = (): string =>
  randomBytes(32).toString("base64");

export const formatSigningSecretForDisplay = (storedSecret: string): string => {
  if (storedSecret.startsWith(WHSEC_PREFIX)) {
    return storedSecret;
  }

  return `${WHSEC_PREFIX}${storedSecret}`;
};

export const parseSigningSecret = (secret: string): Buffer => {
  const raw = secret.startsWith(WHSEC_PREFIX)
    ? secret.slice(WHSEC_PREFIX.length)
    : secret;

  if (!raw) {
    throw new Error("Invalid webhook signing secret");
  }

  const key = Buffer.from(raw, "base64");

  if (key.length === 0) {
    throw new Error("Invalid webhook signing secret");
  }

  return key;
};
