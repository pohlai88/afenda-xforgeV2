import {
  type BlogFrontmatter,
  blogFrontmatterSchema,
} from "../schemas/blog.schema";
import type { Post, PostMeta } from "../types";
import { defaultBlogImage } from "./defaults";
import type { CollectionConfig, FrontmatterField } from "./types";

const blogFrontmatterFields = [
  { key: "title", label: "Title", type: "text" },
  { key: "status", label: "Status", type: "status" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "date", label: "Date", type: "date" },
  { key: "image", label: "Image", type: "image" },
] as const satisfies readonly FrontmatterField[];

const compareBlogPostsByDate = (left: PostMeta, right: PostMeta): number =>
  new Date(right.date).getTime() - new Date(left.date).getTime();

export const blogCollection = {
  name: "blog",
  schema: blogFrontmatterSchema,
  frontmatterFields: blogFrontmatterFields,
  createDefaultFrontmatter: (): BlogFrontmatter => ({
    title: "",
    description: "",
    status: "draft",
    date: new Date().toISOString().slice(0, 10),
    authors: [],
    categories: [],
  }),
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
