import { z } from "zod";
import { blogCollection } from "./blog.config";
import { legalCollection } from "./legal.config";

export const collections = {
  blog: blogCollection,
  legal: legalCollection,
} as const;

export type CollectionName = keyof typeof collections;

const collectionNameList = Object.keys(collections) as CollectionName[];

export const cmsCollectionNames = collectionNameList;

export const cmsCollectionSchema = z.enum(
  collectionNameList as [CollectionName, ...CollectionName[]]
);

export const isCmsCollection = (value: string): value is CollectionName =>
  cmsCollectionSchema.safeParse(value).success;

export const getCollectionFrontmatterFields = (
  name: CollectionName
): readonly (typeof collections)[CollectionName]["frontmatterFields"][number][] =>
  collections[name].frontmatterFields;

export const getDefaultFrontmatter = (name: CollectionName) =>
  collections[name].createDefaultFrontmatter();

export { blogCollection } from "./blog.config";
export { legalCollection } from "./legal.config";
export type {
  CollectionConfig,
  CollectionReader,
  FrontmatterField,
  FrontmatterFieldType,
  ReaderOptions,
} from "./types";
