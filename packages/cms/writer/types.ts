import type { z } from "zod";
import type { CollectionName } from "../collections";
import type { ContentStatus } from "../schemas";

export type SaveResult =
  | { ok: true; slug: string; path: string }
  | {
      ok: false;
      code: "validation" | "slug_conflict" | "not_found" | "io" | "github";
      message: string;
    };

export type DeleteResult =
  | { ok: true; slug: string }
  | {
      ok: false;
      code: "not_found" | "io" | "github";
      message: string;
    };

export interface SaveDocumentInput<
  TFrontmatter extends { status: ContentStatus; title: string },
> {
  body: string;
  frontmatter: TFrontmatter;
  locale: string;
  slug?: string;
}

export interface WriterConfig<
  TFrontmatter extends { status: ContentStatus; title: string },
> {
  readonly defaultFrontmatter?: Partial<TFrontmatter>;
  readonly name: CollectionName;
  readonly schema: z.ZodType<TFrontmatter>;
}

export interface CollectionWriter<
  TFrontmatter extends { status: ContentStatus; title: string },
> {
  delete: (slug: string, locale: string) => Promise<DeleteResult>;
  listSlugs: (locale: string) => Promise<string[]>;
  save: (input: SaveDocumentInput<TFrontmatter>) => Promise<SaveResult>;
}

export interface RawDocument<TFrontmatter extends { status: ContentStatus }> {
  body: string;
  frontmatter: TFrontmatter;
  locale: string;
  slug: string;
}
