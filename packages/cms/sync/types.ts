import type { CmsDocumentRevisionAction } from "@repo/database/schema";
import type { CollectionName } from "../collections";
import type { ContentStatus } from "../schemas";

export interface MirrorDocumentInput {
  bodyMdx: string;
  collection: CollectionName;
  description?: string | null;
  frontmatter: Record<string, unknown>;
  locale: string;
  publishedAt?: Date | null;
  revisionAction: CmsDocumentRevisionAction;
  slug: string;
  status: ContentStatus;
  title: string;
}

export interface CmsSearchHit {
  collection: string;
  description: string | null;
  locale: string;
  rank: number;
  slug: string;
  status: ContentStatus;
  title: string;
}

export interface MirrorBackfillResult {
  skipped: number;
  upserted: number;
}
