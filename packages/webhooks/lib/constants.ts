/** Default timestamp skew tolerance for `verifyStandardWebhook` (seconds). */
export const DEFAULT_WEBHOOK_SIGNATURE_TOLERANCE_SEC = 300;

/** Grace period after secret rotation before the previous secret expires. */
export const WEBHOOK_SECRET_ROTATION_GRACE_MS = 24 * 60 * 60 * 1000;

/** Max persisted subscriber response body length on delivery failure. */
export const WEBHOOK_RESPONSE_BODY_MAX_LENGTH = 1024;
