import "server-only";

import { blogCollection, legalCollection } from "./collections";
import type { ReaderOptions } from "./collections/types";
import { wrapCachedCollectionReader } from "./loader/cached-reads";
import { createCollectionReader } from "./loader/read-collection";

const blogReader = createCollectionReader(blogCollection);
const legalReader = createCollectionReader(legalCollection);

const cachedBlogReader = wrapCachedCollectionReader("blog", blogReader);
const cachedLegalReader = wrapCachedCollectionReader("legal", legalReader);

export const getBlogPosts = cachedBlogReader.getPostsMeta;
export const getBlogPost = cachedBlogReader.getPost;

export const getLatestBlogPost = async (options?: ReaderOptions) => {
  const posts = await cachedBlogReader.getPostsMeta(options);

  if (posts.length === 0) {
    return null;
  }

  return cachedBlogReader.getPost(posts[0]._slug, options);
};

export const getLegalPostsMeta = cachedLegalReader.getPostsMeta;
export const getLegalPosts = cachedLegalReader.getPosts;
export const getLegalPost = cachedLegalReader.getPost;

export const cmsReaders = {
  blog: cachedBlogReader,
  legal: cachedLegalReader,
} as const;
