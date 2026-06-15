import {
  apiOk,
  methodNotAllowed,
  requireCronSecret,
  withApiRoute,
} from "@repo/api";
import { pruneOldWebhookDeliveries } from "@repo/webhooks/server";

export const GET = withApiRoute(async (request) => {
  requireCronSecret(request);

  const result = await pruneOldWebhookDeliveries();

  return apiOk(result);
});

export const POST = (): Response => methodNotAllowed(["GET"]);
