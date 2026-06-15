import { WEBHOOK_RESPONSE_BODY_MAX_LENGTH } from "./constants";

export const truncateResponseBody = (value: string): string =>
  value.slice(0, WEBHOOK_RESPONSE_BODY_MAX_LENGTH);
