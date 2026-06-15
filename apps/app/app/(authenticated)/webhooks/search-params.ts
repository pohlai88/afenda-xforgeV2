import { webhookDeliveryStatusSchema } from "@repo/webhooks";
import { z } from "zod";

export const webhooksSearchParamsSchema = z.object({
  status: webhookDeliveryStatusSchema.optional(),
  endpointId: z.string().min(1).optional(),
});

export type WebhooksSearchParams = z.infer<typeof webhooksSearchParamsSchema>;

export const parseWebhooksSearchParams = (
  params: Record<string, string | string[] | undefined>
): WebhooksSearchParams => {
  const parsed = webhooksSearchParamsSchema.safeParse({
    status: typeof params.status === "string" ? params.status : undefined,
    endpointId:
      typeof params.endpointId === "string" ? params.endpointId : undefined,
  });

  return parsed.success ? parsed.data : {};
};
