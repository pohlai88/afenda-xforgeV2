import { z } from "zod";
import { baseFrontmatterSchema } from "./shared.schema";

export const legalFrontmatterSchema = baseFrontmatterSchema;

export type LegalFrontmatter = z.infer<typeof legalFrontmatterSchema>;
