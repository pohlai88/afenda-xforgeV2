import type { z } from "zod";
import type { CmsLocale } from "../locale";
import type { ContentStatus } from "../schemas";
import type { ContentBody } from "../types";

export type FrontmatterFieldType =
  | "text"
  | "textarea"
  | "date"
  | "status"
  | "image";

export interface FrontmatterField {
  readonly key: string;
  readonly label: string;
  readonly type: FrontmatterFieldType;
}

export interface ReaderOptions {
  includeDrafts?: boolean;
  locale?: CmsLocale;
}

export interface CollectionConfig<
  TFrontmatter extends { status: ContentStatus },
  TMeta extends { _slug: string },
  _TDoc extends TMeta & { body: ContentBody },
> {
  readonly createDefaultFrontmatter: () => TFrontmatter;
  readonly frontmatterFields: readonly FrontmatterField[];
  readonly isPublished: (frontmatter: TFrontmatter) => boolean;
  readonly name: string;
  readonly schema: z.ZodType<TFrontmatter>;
  readonly sortMeta?: (left: TMeta, right: TMeta) => number;
  readonly toMeta: (slug: string, frontmatter: TFrontmatter) => TMeta;
}

export interface CollectionReader<
  TMeta extends { _slug: string },
  TDoc extends TMeta & { body: ContentBody },
> {
  getPost: (slug: string, options?: ReaderOptions) => Promise<TDoc | null>;
  getPosts: (options?: ReaderOptions) => Promise<TDoc[]>;
  getPostsMeta: (options?: ReaderOptions) => Promise<TMeta[]>;
}
