import { type CollectionName, collections } from "../collections";
import {
  listLocaleDirectories,
  localContentSource,
} from "../loader/local-source";
import { ensureCmsMirrorSchema } from "./ensure-schema";
import type { MirrorBackfillResult } from "./types";
import { upsertDocumentMirror } from "./upsert-mirror";

const parsePublishedAt = (
  frontmatter: Record<string, unknown>
): Date | null => {
  const value = frontmatter.date;

  if (typeof value !== "string") {
    return null;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const backfillDocumentMirror =
  async (): Promise<MirrorBackfillResult> => {
    await ensureCmsMirrorSchema();

    let upserted = 0;
    let skipped = 0;

    for (const collection of Object.keys(collections) as CollectionName[]) {
      const locales = await listLocaleDirectories(collection);

      for (const locale of locales) {
        const slugs = await localContentSource.listSlugs(collection, locale);

        for (const slug of slugs) {
          const document = await localContentSource.readDocument(
            collection,
            locale,
            slug
          );

          if (!document) {
            skipped += 1;
            continue;
          }

          const frontmatter = document.data as Record<string, unknown>;
          const status =
            frontmatter.status === "draft"
              ? ("draft" as const)
              : ("published" as const);

          if (status !== "published") {
            skipped += 1;
            continue;
          }

          await upsertDocumentMirror({
            collection,
            slug,
            locale,
            title: String(frontmatter.title ?? slug),
            description:
              typeof frontmatter.description === "string"
                ? frontmatter.description
                : null,
            status,
            frontmatter,
            bodyMdx: document.content,
            publishedAt: parsePublishedAt(frontmatter),
            revisionAction: "published",
          });

          upserted += 1;
        }
      }
    }

    return { upserted, skipped };
  };
