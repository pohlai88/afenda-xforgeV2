import { z } from "zod";

export const templateFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "number", "date", "select", "textarea"]),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

export const pushTemplateSchema = z.object({
  id: z.string().min(1),
  destinationId: z.string().min(1),
  label: z.string().min(1),
  fields: z.array(templateFieldSchema).min(1),
});

export type PushTemplateDefinition = z.infer<typeof pushTemplateSchema>;

export const resolveMissingFieldsSchema = z.object({
  templateId: z.string().min(1),
  provided: z.record(z.string(), z.unknown()),
});
