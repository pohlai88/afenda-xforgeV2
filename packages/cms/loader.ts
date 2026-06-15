import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { compileMdx } from "./mdx";
import {
  blogFrontmatterSchema,
  legalFrontmatterSchema,
} from "./schemas";
import type {
  ContentImage,
  LegalPost,
  LegalPostMeta,
  Post,
  PostMeta,
} from "./types";

const contentRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "content"
);

const defaultImage = (): ContentImage => ({
  url: "/blog/placeholder.svg",
  width: 1200,
  height: 630,
  alt: null,
});

const slugFromPath = (filePath: string): string =>
  path.basename(filePath, ".mdx");

const listMdxFiles = async (directory: string): Promise<string[]> => {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => path.join(directory, entry.name));
};

const readMdxFile = async (filePath: string) => {
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);

  return { content, data };
};

const buildBlogMeta = (slug: string, data: unknown): PostMeta => {
  const frontmatter = blogFrontmatterSchema.parse(data);
  const image = frontmatter.image ?? defaultImage();

  return {
    _slug: slug,
    _title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    image,
    authors: frontmatter.authors.map((author) => ({
      _title: author.name,
      avatar: author.avatar,
      xUrl: author.xUrl,
    })),
    categories: frontmatter.categories.map((category) => ({
      _title: category.name,
    })),
  };
};

const buildLegalMeta = (slug: string, data: unknown): LegalPostMeta => {
  const frontmatter = legalFrontmatterSchema.parse(data);

  return {
    _slug: slug,
    _title: frontmatter.title,
    description: frontmatter.description,
  };
};

const readBlogFile = async (filePath: string) => {
  const slug = slugFromPath(filePath);
  const { content, data } = await readMdxFile(filePath);

  return {
    content,
    meta: buildBlogMeta(slug, data),
  };
};

const readLegalFile = async (filePath: string) => {
  const slug = slugFromPath(filePath);
  const { content, data } = await readMdxFile(filePath);

  return {
    content,
    meta: buildLegalMeta(slug, data),
  };
};

const loadBlogPost = async (filePath: string): Promise<Post> => {
  const { content, meta } = await readBlogFile(filePath);
  const body = await compileMdx(content);

  return {
    ...meta,
    body,
  };
};

const loadLegalPost = async (filePath: string): Promise<LegalPost> => {
  const { content, meta } = await readLegalFile(filePath);
  const body = await compileMdx(content);

  return {
    ...meta,
    body,
  };
};

const blogDirectory = () => path.join(contentRoot, "blog");
const legalDirectory = () => path.join(contentRoot, "legal");

const compareBlogPostsByDate = (left: PostMeta, right: PostMeta): number =>
  new Date(right.date).getTime() - new Date(left.date).getTime();

const resolveMdxFile = async (
  directory: string,
  slug: string
): Promise<string | null> => {
  const filePath = path.join(directory, `${slug}.mdx`);

  try {
    await fs.access(filePath);
  } catch {
    return null;
  }

  return filePath;
};

export const getBlogPosts = async (): Promise<PostMeta[]> => {
  const files = await listMdxFiles(blogDirectory());
  const posts = await Promise.all(
    files.map(async (file) => (await readBlogFile(file)).meta)
  );

  return posts.sort(compareBlogPostsByDate);
};

export const getBlogPost = async (slug: string): Promise<Post | null> => {
  const filePath = await resolveMdxFile(blogDirectory(), slug);

  if (!filePath) {
    return null;
  }

  return loadBlogPost(filePath);
};

export const getLatestBlogPost = async (): Promise<Post | null> => {
  const files = await listMdxFiles(blogDirectory());

  if (files.length === 0) {
    return null;
  }

  const parsed = await Promise.all(files.map((file) => readBlogFile(file)));
  const latest = parsed.sort((left, right) =>
    compareBlogPostsByDate(left.meta, right.meta)
  )[0];
  const body = await compileMdx(latest.content);

  return {
    ...latest.meta,
    body,
  };
};

export const getLegalPostsMeta = async (): Promise<LegalPostMeta[]> => {
  const files = await listMdxFiles(legalDirectory());

  return Promise.all(
    files.map(async (file) => (await readLegalFile(file)).meta)
  );
};

export const getLegalPosts = async (): Promise<LegalPost[]> => {
  const files = await listMdxFiles(legalDirectory());

  return Promise.all(files.map((file) => loadLegalPost(file)));
};

export const getLegalPost = async (slug: string): Promise<LegalPost | null> => {
  const filePath = await resolveMdxFile(legalDirectory(), slug);

  if (!filePath) {
    return null;
  }

  return loadLegalPost(filePath);
};
