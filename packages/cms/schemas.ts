import { z } from "zod";

const imageSchema = z.object({
  url: z.string().min(1),
  width: z.number().int().positive().default(1200),
  height: z.number().int().positive().default(630),
  alt: z.string().nullable().default(null),
});

const authorSchema = z.object({
  name: z.string().min(1),
  avatar: imageSchema.optional(),
  xUrl: z.string().url().optional(),
});

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  image: imageSchema.optional(),
  authors: z.array(authorSchema).default([]),
  categories: z.array(z.object({ name: z.string().min(1) })).default([]),
});

export const legalFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
export type LegalFrontmatter = z.infer<typeof legalFrontmatterSchema>;
