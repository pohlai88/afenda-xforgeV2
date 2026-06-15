import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { cmsDocument, cmsDocumentRevision } from "@repo/database/schema";
import { and, eq } from "drizzle-orm";
import type { CollectionName } from "../collections";

export const deleteDocumentMirror = async (input: {
  collection: CollectionName;
  slug: string;
  locale: string;
  title: string;
  status: string;
}): Promise<boolean> => {
  const [existing] = await database
    .select({ id: cmsDocument.id })
    .from(cmsDocument)
    .where(
      and(
        eq(cmsDocument.collection, input.collection),
        eq(cmsDocument.slug, input.slug),
        eq(cmsDocument.locale, input.locale)
      )
    )
    .limit(1);

  if (!existing) {
    return false;
  }

  await database.insert(cmsDocumentRevision).values({
    id: createId(),
    documentId: existing.id,
    collection: input.collection,
    slug: input.slug,
    locale: input.locale,
    action: "deleted",
    title: input.title,
    status: input.status,
    occurredAt: new Date(),
  });

  await database
    .delete(cmsDocument)
    .where(eq(cmsDocument.id, existing.id));

  return true;
};
