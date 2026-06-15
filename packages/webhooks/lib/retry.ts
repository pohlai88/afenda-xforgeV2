export const MAX_WEBHOOK_ATTEMPTS = 5;

export const WEBHOOK_RETRY_DELAYS_MS = [
  60_000,
  5 * 60_000,
  15 * 60_000,
  60 * 60_000,
  6 * 60 * 60_000,
] as const;

export const getNextAttemptAt = (attempts: number): Date | null => {
  if (attempts >= MAX_WEBHOOK_ATTEMPTS) {
    return null;
  }

  const delay =
    WEBHOOK_RETRY_DELAYS_MS[attempts] ??
    WEBHOOK_RETRY_DELAYS_MS[WEBHOOK_RETRY_DELAYS_MS.length - 1];

  return new Date(Date.now() + delay);
};
