import { z } from "zod";
import { pushDestinationSchema } from "./push.schema";
import { pushTemplateSchema } from "./template.schema";

export const upsertPushDestinationSchema = pushDestinationSchema.extend({
  enabled: z.boolean().default(true),
});

export type UpsertPushDestinationInput = z.infer<
  typeof upsertPushDestinationSchema
>;

export const deletePushDestinationSchema = z.object({
  destinationId: z.string().min(1),
});

export const upsertPushTemplateSchema = pushTemplateSchema;

export type UpsertPushTemplateInput = z.infer<typeof upsertPushTemplateSchema>;

export const deletePushTemplateSchema = z.object({
  templateId: z.string().min(1),
});
