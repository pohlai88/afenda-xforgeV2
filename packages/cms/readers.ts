import type { LegalPost, LegalPostMeta, Post, PostMeta } from "./types";
import type { ReaderOptions } from "./collections/types";

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
