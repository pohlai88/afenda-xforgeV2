export interface ParsedMdxDocument {
  content: string;
  data: unknown;
  slug: string;
}

export interface ContentSource {
  documentExists: (
    collection: string,
    locale: string,
    slug: string
  ) => Promise<boolean>;
  listSlugs: (collection: string, locale: string) => Promise<string[]>;
  readDocument: (
    collection: string,
    locale: string,
    slug: string
  ) => Promise<ParsedMdxDocument | null>;
}
