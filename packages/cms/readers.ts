import type { LegalPost, LegalPostMeta, Post, PostMeta } from "./types";

export interface BlogReader {
  getPosts(): Promise<PostMeta[]>;
  getPost(slug: string): Promise<Post | null>;
  getLatestPost(): Promise<Post | null>;
}

export interface LegalReader {
  getPostsMeta(): Promise<LegalPostMeta[]>;
  getPosts(): Promise<LegalPost[]>;
  getPost(slug: string): Promise<LegalPost | null>;
}
