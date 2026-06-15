export type {
  ContentBody,
  ContentImage,
  LegalPost,
  LegalPostMeta,
  Post,
  PostMeta,
  TocItem,
} from "./types";

export type { BlogReader, LegalReader } from "./readers";
export type { ReaderOptions } from "./collections/types";
export { collections } from "./collections";

import {
  getBlogPost,
  getBlogPosts,
  getLatestBlogPost,
  getLegalPost,
  getLegalPosts,
  getLegalPostsMeta,
} from "./loader";
import type { BlogReader, LegalReader } from "./readers";

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
