import { z } from "zod";
import {
  authorSchema,
  baseFrontmatterSchema,
  imageSchema,
} from "./shared.schema";

export const blogFrontmatterSchema = baseFrontmatterSchema.extend({
  date: z.string().min(1),
  image: imageSchema.optional(),
  authors: z.array(authorSchema).default([]),
  categories: z.array(z.object({ name: z.string().min(1) })).default([]),
});

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
