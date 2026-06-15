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

export type SaveDocumentInput<
  TFrontmatter extends { status: ContentStatus; title: string },
> = {
  slug?: string;
  locale: string;
  frontmatter: TFrontmatter;
  body: string;
};

export type WriterConfig<
  TFrontmatter extends { status: ContentStatus; title: string },
> = {
  readonly name: CollectionName;
  readonly schema: z.ZodType<TFrontmatter>;
  readonly defaultFrontmatter?: Partial<TFrontmatter>;
};

export type CollectionWriter<
  TFrontmatter extends { status: ContentStatus; title: string },
> = {
  save: (input: SaveDocumentInput<TFrontmatter>) => Promise<SaveResult>;
  delete: (slug: string, locale: string) => Promise<DeleteResult>;
  listSlugs: (locale: string) => Promise<string[]>;
};

export type RawDocument<TFrontmatter extends { status: ContentStatus }> = {
  slug: string;
  locale: string;
  frontmatter: TFrontmatter;
  body: string;
};
