import {
  blogFrontmatterSchema,
  type BlogFrontmatter,
} from "../schemas/blog.schema";
import type { Post, PostMeta } from "../types";
import { defaultBlogImage } from "./defaults";
import type { CollectionConfig } from "./types";

const compareBlogPostsByDate = (left: PostMeta, right: PostMeta): number =>
  new Date(right.date).getTime() - new Date(left.date).getTime();

export const blogCollection = {
  name: "blog",
  schema: blogFrontmatterSchema,
  isPublished: (frontmatter) => frontmatter.status === "published",
  toMeta: (slug, frontmatter) => {
    const image = frontmatter.image ?? defaultBlogImage();

    return {
      _slug: slug,
      _title: frontmatter.title,
      status: frontmatter.status,
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
  },
  sortMeta: compareBlogPostsByDate,
} satisfies CollectionConfig<BlogFrontmatter, PostMeta, Post>;

export type BlogCollectionMeta = PostMeta;
export type BlogCollectionDocument = Post;
