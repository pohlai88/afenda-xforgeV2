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

export type FrontmatterField = {
  readonly key: string;
  readonly label: string;
  readonly type: FrontmatterFieldType;
};

export type ReaderOptions = {
  includeDrafts?: boolean;
  locale?: CmsLocale;
};

export type CollectionConfig<
  TFrontmatter extends { status: ContentStatus },
  TMeta extends { _slug: string },
  TDoc extends TMeta & { body: ContentBody },
> = {
  readonly name: string;
  readonly schema: z.ZodType<TFrontmatter>;
  readonly frontmatterFields: readonly FrontmatterField[];
  readonly createDefaultFrontmatter: () => TFrontmatter;
  readonly toMeta: (slug: string, frontmatter: TFrontmatter) => TMeta;
  readonly sortMeta?: (left: TMeta, right: TMeta) => number;
  readonly isPublished: (frontmatter: TFrontmatter) => boolean;
};

export type CollectionReader<
  TMeta extends { _slug: string },
  TDoc extends TMeta & { body: ContentBody },
> = {
  getPostsMeta: (options?: ReaderOptions) => Promise<TMeta[]>;
  getPosts: (options?: ReaderOptions) => Promise<TDoc[]>;
  getPost: (slug: string, options?: ReaderOptions) => Promise<TDoc | null>;
};
