import { z } from "zod";
import { cmsLocaleSchema } from "../locale";

export const contentStatusSchema = z.enum(["draft", "published"]);

export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const imageSchema = z.object({
  url: z.string().min(1),
  width: z.number().int().positive().default(1200),
  height: z.number().int().positive().default(630),
  alt: z.string().nullable().default(null),
});

export const authorSchema = z.object({
  name: z.string().min(1),
  avatar: imageSchema.optional(),
  xUrl: z.string().url().optional(),
});

export const baseFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: contentStatusSchema.default("published"),
  locale: cmsLocaleSchema.optional(),
});
