import {
  apiOk,
  methodNotAllowed,
  requireCronSecret,
  withApiRoute,
} from "@repo/api";
import { processPendingDeliveries } from "@repo/webhooks/server";

export const GET = withApiRoute(async (request) => {
  requireCronSecret(request);

  const result = await processPendingDeliveries(50);

  return apiOk(result);
});

export const POST = (): Response => methodNotAllowed(["GET"]);
