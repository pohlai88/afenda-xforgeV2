import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import {
  cmsDocument,
  cmsDocumentRevision,
  type CmsDocumentRevisionAction,
} from "@repo/database/schema";
import { ensureCmsMirrorSchema } from "./ensure-schema";
import type { MirrorDocumentInput } from "./types";

const appendRevision = async (input: {
  documentId: string | null;
  collection: string;
  slug: string;
  locale: string;
  action: CmsDocumentRevisionAction;
  title: string;
  status: string;
}): Promise<void> => {
  await database.insert(cmsDocumentRevision).values({
    id: createId(),
    documentId: input.documentId,
    collection: input.collection,
    slug: input.slug,
    locale: input.locale,
    action: input.action,
    title: input.title,
    status: input.status,
    occurredAt: new Date(),
  });
};

export const upsertDocumentMirror = async (
  input: MirrorDocumentInput
): Promise<string | null> => {
  await ensureCmsMirrorSchema();

  const now = new Date();

  const [row] = await database
    .insert(cmsDocument)
    .values({
      id: createId(),
      collection: input.collection,
      slug: input.slug,
      locale: input.locale,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      frontmatter: input.frontmatter,
      bodyMdx: input.bodyMdx,
      publishedAt: input.publishedAt ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [cmsDocument.collection, cmsDocument.slug, cmsDocument.locale],
      set: {
        title: input.title,
        description: input.description ?? null,
        status: input.status,
        frontmatter: input.frontmatter,
        bodyMdx: input.bodyMdx,
        publishedAt: input.publishedAt ?? null,
        updatedAt: now,
      },
    })
    .returning({ id: cmsDocument.id });

  if (!row) {
    return null;
  }

  await appendRevision({
    documentId: row.id,
    collection: input.collection,
    slug: input.slug,
    locale: input.locale,
    action: input.revisionAction,
    title: input.title,
    status: input.status,
  });

  return row.id;
};
