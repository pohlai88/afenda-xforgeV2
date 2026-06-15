import type { ContentStatus } from "./schemas";

export type ContentImage = {
  url: string;
  width: number;
  height: number;
  alt: string | null;
};

export type ContentAuthor = {
  _title: string;
  avatar?: ContentImage;
  xUrl?: string;
};

export type ContentCategory = {
  _title: string;
};

export type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export type ContentBody = {
  plainText: string;
  readingTime: number;
  code: string;
  toc: TocItem[];
};

export type PostMeta = {
  _slug: string;
  _title: string;
  status: ContentStatus;
  date: string;
  description: string;
  image: ContentImage;
  authors: ContentAuthor[];
  categories: ContentCategory[];
};

export type Post = PostMeta & {
  body: ContentBody;
};

export type LegalPostMeta = {
  _slug: string;
  _title: string;
  status: ContentStatus;
  description: string;
};

export type LegalPost = LegalPostMeta & {
  body: ContentBody;
};
