export type ParsedMdxDocument = {
  slug: string;
  content: string;
  data: unknown;
};

export type ContentSource = {
  listSlugs: (collection: string, locale: string) => Promise<string[]>;
  readDocument: (
    collection: string,
    locale: string,
    slug: string
  ) => Promise<ParsedMdxDocument | null>;
  documentExists: (
    collection: string,
    locale: string,
    slug: string
  ) => Promise<boolean>;
};
