"use server";

import { withOrg, withOwner } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  cmsWebhookEventTypeSchema,
  type ListWebhookDeliveriesResult,
  type ReplayWebhookDeliveryResult,
  type WebhookEndpointPublic,
  type WebhookEndpointWithSecret,
  webhookDeliveryStatusSchema,
} from "@repo/webhooks";
import {
  createWebhookEndpoint,
  deleteWebhookEndpoint,
  enqueueTestWebhook,
  listWebhookDeliveries,
  listWebhookEndpoints,
  processWebhookDeliveries,
  replayWebhookDelivery,
  resetWebhookEndpointHealth,
  rotateWebhookEndpointSecret,
  updateWebhookEndpoint,
  validateWebhookUrl,
} from "@repo/webhooks/server";
import { z } from "zod";

const webhookUrlSchema = z
  .string()
  .min(1)
  .superRefine((value, context) => {
    try {
      validateWebhookUrl(value);
    } catch (error) {
      context.addIssue({
        code: "custom",
        message: error instanceof Error ? error.message : "Invalid webhook URL",
      });
    }
  });

const createEndpointSchema = z.object({
  url: webhookUrlSchema,
  description: z.string().max(200).optional(),
  events: z.array(cmsWebhookEventTypeSchema).min(1),
});

const updateEndpointSchema = z.object({
  endpointId: z.string().min(1),
  url: webhookUrlSchema.optional(),
  description: z.string().max(200).nullable().optional(),
  events: z.array(cmsWebhookEventTypeSchema).min(1).optional(),
  enabled: z.boolean().optional(),
});

const deliveryFiltersSchema = z.object({
  endpointId: z.string().min(1).optional(),
  status: webhookDeliveryStatusSchema.optional(),
  limit: z.number().int().positive().max(100).optional(),
  cursor: z.string().min(1).optional(),
});

export const getWebhookEndpoints = async (): Promise<
  AuthActionResult<WebhookEndpointPublic[]>
> => withOrg(async ({ orgId }) => listWebhookEndpoints(orgId));

export const getWebhookDeliveries = async (
  filters?: z.infer<typeof deliveryFiltersSchema>
): Promise<AuthActionResult<ListWebhookDeliveriesResult>> =>
  withOrg(async ({ orgId }) => {
    const parsed = deliveryFiltersSchema.parse(filters ?? {});

    return listWebhookDeliveries(orgId, parsed);
  });

export const createEndpoint = async (
  input: z.infer<typeof createEndpointSchema>
): Promise<AuthActionResult<WebhookEndpointWithSecret>> =>
  withOwner(async ({ orgId }) => {
    const parsed = createEndpointSchema.parse(input);

    return createWebhookEndpoint({
      organizationId: orgId,
      url: parsed.url,
      events: parsed.events,
      description: parsed.description,
    });
  });

export const updateEndpoint = async (
  input: z.infer<typeof updateEndpointSchema>
): Promise<AuthActionResult<WebhookEndpointPublic | null>> =>
  withOwner(async ({ orgId }) => {
    const parsed = updateEndpointSchema.parse(input);

    return updateWebhookEndpoint({
      organizationId: orgId,
      endpointId: parsed.endpointId,
      url: parsed.url,
      events: parsed.events,
      description: parsed.description,
      enabled: parsed.enabled,
    });
  });

export const removeEndpoint = async (
  endpointId: string
): Promise<AuthActionResult<boolean>> =>
  withOwner(async ({ orgId }) => deleteWebhookEndpoint(orgId, endpointId));

export const rotateEndpointSecret = async (
  endpointId: string
): Promise<AuthActionResult<{ secret: string } | null>> =>
  withOwner(async ({ orgId }) =>
    rotateWebhookEndpointSecret(orgId, endpointId)
  );

export const replayDelivery = async (
  deliveryId: string
): Promise<AuthActionResult<ReplayWebhookDeliveryResult>> =>
  withOwner(async ({ orgId }) => {
    const replayed = await replayWebhookDelivery(orgId, deliveryId);

    if (!replayed) {
      throw new Error("Only failed deliveries can be replayed");
    }

    return { queued: true };
  });

export const testEndpoint = async (
  endpointId: string
): Promise<AuthActionResult<boolean>> =>
  withOwner(async ({ orgId }) => {
    const deliveryId = await enqueueTestWebhook(orgId, endpointId);

    if (!deliveryId) {
      return false;
    }

    const result = await processWebhookDeliveries({
      deliveryIds: [deliveryId],
    });

    return result.delivered > 0;
  });

export const resetEndpointHealth = async (
  endpointId: string
): Promise<AuthActionResult<boolean>> =>
  withOwner(async ({ orgId }) => resetWebhookEndpointHealth(orgId, endpointId));
