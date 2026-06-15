import type { CmsDocumentRevisionAction } from "@repo/database/schema";
import type { CollectionName } from "../collections";
import type { ContentStatus } from "../schemas";

export type MirrorDocumentInput = {
  collection: CollectionName;
  slug: string;
  locale: string;
  title: string;
  description?: string | null;
  status: ContentStatus;
  frontmatter: Record<string, unknown>;
  bodyMdx: string;
  publishedAt?: Date | null;
  revisionAction: CmsDocumentRevisionAction;
};

export type CmsSearchHit = {
  collection: string;
  slug: string;
  locale: string;
  title: string;
  description: string | null;
  status: ContentStatus;
  rank: number;
};

export type MirrorBackfillResult = {
  upserted: number;
  skipped: number;
};
