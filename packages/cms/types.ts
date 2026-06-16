import type { ContentStatus } from "./schemas";

export interface ContentImage {
  alt: string | null;
  height: number;
  url: string;
  width: number;
}

export interface ContentAuthor {
  _title: string;
  avatar?: ContentImage;
  xUrl?: string;
}

export interface ContentCategory {
  _title: string;
}

export interface TocItem {
  id: string;
  level: 2 | 3;
  title: string;
}

export interface ContentBody {
  code: string;
  plainText: string;
  readingTime: number;
  toc: TocItem[];
}

export interface PostMeta {
  _slug: string;
  _title: string;
  authors: ContentAuthor[];
  categories: ContentCategory[];
  date: string;
  description: string;
  image: ContentImage;
  status: ContentStatus;
}

export type Post = PostMeta & {
  body: ContentBody;
};

export interface LegalPostMeta {
  _slug: string;
  _title: string;
  description: string;
  status: ContentStatus;
}

export type LegalPost = LegalPostMeta & {
  body: ContentBody;
};
