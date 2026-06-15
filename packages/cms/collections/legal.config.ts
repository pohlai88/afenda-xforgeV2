import {
  legalFrontmatterSchema,
  type LegalFrontmatter,
} from "../schemas/legal.schema";
import type { LegalPost, LegalPostMeta } from "../types";
import type { CollectionConfig } from "./types";

export const legalCollection = {
  name: "legal",
  schema: legalFrontmatterSchema,
  isPublished: (frontmatter) => frontmatter.status === "published",
  toMeta: (slug, frontmatter) => ({
    _slug: slug,
    _title: frontmatter.title,
    status: frontmatter.status,
    description: frontmatter.description,
  }),
} satisfies CollectionConfig<LegalFrontmatter, LegalPostMeta, LegalPost>;

export type LegalCollectionMeta = LegalPostMeta;
export type LegalCollectionDocument = LegalPost;
