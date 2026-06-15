export type {
  ContentBody,
  ContentImage,
  LegalPost,
  LegalPostMeta,
  Post,
  PostMeta,
  TocItem,
} from "./types";

export type { ReaderOptions } from "./collections/types";
export {
  collections,
  cmsCollectionNames,
  cmsCollectionSchema,
  getCollectionFrontmatterFields,
  getDefaultFrontmatter,
  isCmsCollection,
  type CollectionName,
} from "./collections";
export type { SiteSettings } from "./settings";
export { getSiteSettings } from "./settings";

import type { LegalPost, LegalPostMeta, Post, PostMeta } from "./types";
import type { ReaderOptions } from "./collections/types";
import {
  getBlogPost,
  getBlogPosts,
  getLatestBlogPost,
  getLegalPost,
  getLegalPosts,
  getLegalPostsMeta,
} from "./loader";

export interface BlogReader {
  getPosts(options?: ReaderOptions): Promise<PostMeta[]>;
  getPost(slug: string, options?: ReaderOptions): Promise<Post | null>;
  getLatestPost(options?: ReaderOptions): Promise<Post | null>;
}

export interface LegalReader {
  getPostsMeta(options?: ReaderOptions): Promise<LegalPostMeta[]>;
  getPosts(options?: ReaderOptions): Promise<LegalPost[]>;
  getPost(slug: string, options?: ReaderOptions): Promise<LegalPost | null>;
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
