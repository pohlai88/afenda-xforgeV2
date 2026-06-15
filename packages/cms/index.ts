export {
  type CollectionName,
  cmsCollectionNames,
  cmsCollectionSchema,
  collections,
  getCollectionFrontmatterFields,
  getDefaultFrontmatter,
  isCmsCollection,
} from "./collections";

export type { ReaderOptions } from "./collections/types";
export type { SiteSettings } from "./settings";
export { getSiteSettings } from "./settings";
export type {
  ContentBody,
  ContentImage,
  LegalPost,
  LegalPostMeta,
  Post,
  PostMeta,
  TocItem,
} from "./types";

import type { ReaderOptions } from "./collections/types";
import {
  getBlogPost,
  getBlogPosts,
  getLatestBlogPost,
  getLegalPost,
  getLegalPosts,
  getLegalPostsMeta,
} from "./loader";
import type { LegalPost, LegalPostMeta, Post, PostMeta } from "./types";

export interface BlogReader {
  getLatestPost(options?: ReaderOptions): Promise<Post | null>;
  getPost(slug: string, options?: ReaderOptions): Promise<Post | null>;
  getPosts(options?: ReaderOptions): Promise<PostMeta[]>;
}

export interface LegalReader {
  getPost(slug: string, options?: ReaderOptions): Promise<LegalPost | null>;
  getPosts(options?: ReaderOptions): Promise<LegalPost[]>;
  getPostsMeta(options?: ReaderOptions): Promise<LegalPostMeta[]>;
}

export const blog = {
  getPosts: getBlogPosts,
  getLatestPost: getLatestBlogPost,
  getPost: getBlogPost,
} satisfies BlogReader;

export const legal = {
  getPostsMeta: getLegalPostsMeta,
  getPosts: getLegalPosts,
  getPost: getLegalPost,
} satisfies LegalReader;
