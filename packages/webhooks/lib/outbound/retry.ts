/** Svix-inspired transient ladder + GitLab-style client-error fast-fail. */

export const MAX_TRANSIENT_ATTEMPTS = 8;

export const WEBHOOK_TRANSIENT_RETRY_DELAYS_MS = [
  0,
  5000,
  5 * 60_000,
  30 * 60_000,
  2 * 60 * 60_000,
  5 * 60 * 60_000,
  10 * 60 * 60_000,
  10 * 60 * 60_000,
] as const;

export const MAX_CLIENT_ERROR_ATTEMPTS = 4;

export const CLIENT_ERROR_RETRY_DELAY_MS = 60_000;

export const ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT = 4;

export const ENDPOINT_TRANSIENT_DISABLE_MS = 10 * 60_000;

export const ENDPOINT_TRANSIENT_DISABLE_MAX_MS = 24 * 60 * 60_000;

export type WebhookFailureClass = "transient" | "client";

export const classifyHttpFailure = (
  status: number | null
): WebhookFailureClass => {
  if (status === null) {
    return "transient";
  }

  if (status === 408 || status === 429 || status >= 500) {
    return "transient";
  }

  if (status >= 400 && status < 500) {
    return "client";
  }

  return "transient";
};

export const getNextAttemptAt = (
  attempts: number,
  failureClass: WebhookFailureClass
): Date | null => {
  if (failureClass === "client") {
    if (attempts >= MAX_CLIENT_ERROR_ATTEMPTS) {
      return null;
    }

    return new Date(Date.now() + CLIENT_ERROR_RETRY_DELAY_MS);
  }

  if (attempts >= MAX_TRANSIENT_ATTEMPTS) {
    return null;
  }

  const delay =
    WEBHOOK_TRANSIENT_RETRY_DELAYS_MS[attempts] ??
    WEBHOOK_TRANSIENT_RETRY_DELAYS_MS[
      WEBHOOK_TRANSIENT_RETRY_DELAYS_MS.length - 1
    ];

  return new Date(Date.now() + delay);
};

export const getEndpointTransientCooldownMs = (
  recentTransientFailures: number
): number => {
  const cooldown =
    ENDPOINT_TRANSIENT_DISABLE_MS *
    2 ** Math.max(0, recentTransientFailures - 1);

  return Math.min(cooldown, ENDPOINT_TRANSIENT_DISABLE_MAX_MS);
};

/** @deprecated Use MAX_TRANSIENT_ATTEMPTS */
export const MAX_WEBHOOK_ATTEMPTS = MAX_TRANSIENT_ATTEMPTS;
