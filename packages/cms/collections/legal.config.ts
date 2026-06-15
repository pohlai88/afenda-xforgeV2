import {
  type LegalFrontmatter,
  legalFrontmatterSchema,
} from "../schemas/legal.schema";
import type { LegalPost, LegalPostMeta } from "../types";
import type { CollectionConfig, FrontmatterField } from "./types";

const legalFrontmatterFields = [
  { key: "title", label: "Title", type: "text" },
  { key: "status", label: "Status", type: "status" },
  { key: "description", label: "Description", type: "textarea" },
] as const satisfies readonly FrontmatterField[];

export const legalCollection = {
  name: "legal",
  schema: legalFrontmatterSchema,
  frontmatterFields: legalFrontmatterFields,
  createDefaultFrontmatter: (): LegalFrontmatter => ({
    title: "",
    description: "",
    status: "draft",
  }),
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
