import { apiError, apiOk, methodNotAllowed } from "@repo/api";
import { handleInboundWebhook } from "@repo/webhooks/inbound";

export const POST = async (request: Request): Promise<Response> => {
  const result = await handleInboundWebhook("auth", request);

  if (result.ok) {
    return apiOk({ received: true, type: result.type });
  }

  if (result.status === 501) {
    return apiError("not_implemented", result.error, 501);
  }

  return apiError("bad_request", result.error, 400);
};

export const GET = (): Response => methodNotAllowed(["POST"]);
