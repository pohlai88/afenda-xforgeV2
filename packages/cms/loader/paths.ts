import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeLocale } from "../locale";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export const contentRoot = path.join(packageRoot, "..", "content");

export const collectionDirectory = (collectionName: string): string =>
  path.join(contentRoot, collectionName);

export const localeDirectory = (
  collectionName: string,
  locale: string
): string => path.join(collectionDirectory(collectionName), normalizeLocale(locale));

export const documentPath = (
  collectionName: string,
  locale: string,
  slug: string
): string => path.join(localeDirectory(collectionName, locale), `${slug}.mdx`);

export const slugFromPath = (filePath: string): string =>
  path.basename(filePath, ".mdx");
