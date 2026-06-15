import { database } from "@repo/database";
import { cmsDocument } from "@repo/database/schema";
import { and, eq, sql } from "drizzle-orm";
import type { CmsSearchHit } from "./types";

export const searchDocumentMirror = async (input: {
  query: string;
  collection?: string;
  locale?: string;
  limit?: number;
  /** When true, only published documents are returned (public search). */
  publishedOnly?: boolean;
}): Promise<CmsSearchHit[]> => {
  const trimmedQuery = input.query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const filters = [
    sql`"next_forge"."cms_documents"."search_vector" @@ plainto_tsquery('english', ${trimmedQuery})`,
  ];

  if (input.collection) {
    filters.push(eq(cmsDocument.collection, input.collection));
  }

  if (input.locale) {
    filters.push(eq(cmsDocument.locale, input.locale));
  }

  if (input.publishedOnly) {
    filters.push(eq(cmsDocument.status, "published"));
  }

  const rows = await database
    .select({
      collection: cmsDocument.collection,
      slug: cmsDocument.slug,
      locale: cmsDocument.locale,
      title: cmsDocument.title,
      description: cmsDocument.description,
      status: cmsDocument.status,
      rank: sql<number>`ts_rank("next_forge"."cms_documents"."search_vector", plainto_tsquery('english', ${trimmedQuery}))`.as(
        "rank"
      ),
    })
    .from(cmsDocument)
    .where(and(...filters))
    .orderBy(sql`rank DESC`)
    .limit(input.limit ?? 20);

  return rows.map((row) => ({
    collection: row.collection,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    description: row.description,
    status: row.status,
    rank: row.rank,
  }));
};
