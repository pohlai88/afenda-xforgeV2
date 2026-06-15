import { createHmac } from "node:crypto";
import { parseSigningSecret } from "./secrets";

export type StandardWebhookSignInput = {
  id: string;
  timestamp: string;
  body: string;
};

export const buildSignedContent = (
  id: string,
  timestamp: string,
  body: string
): string => `${id}.${timestamp}.${body}`;

export const signStandardWebhook = (
  secret: string,
  input: StandardWebhookSignInput
): string => {
  const key = parseSigningSecret(secret);
  const signedContent = buildSignedContent(
    input.id,
    input.timestamp,
    input.body
  );
  const digest = createHmac("sha256", key)
    .update(signedContent, "utf8")
    .digest("base64");

  return `v1,${digest}`;
};

/** Space-delimited Standard Webhooks signatures (e.g. during secret rotation). */
export const signStandardWebhookHeader = (
  secrets: string[],
  input: StandardWebhookSignInput
): string =>
  secrets.map((secret) => signStandardWebhook(secret, input)).join(" ");
