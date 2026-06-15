import { blogCollection } from "./blog.config";
import { legalCollection } from "./legal.config";

export const collections = {
  blog: blogCollection,
  legal: legalCollection,
} as const;

export type CollectionName = keyof typeof collections;

export { blogCollection } from "./blog.config";
export { legalCollection } from "./legal.config";
export type {
  CollectionConfig,
  CollectionReader,
  ReaderOptions,
} from "./types";
