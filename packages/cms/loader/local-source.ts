import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { isValidLocale } from "../locale";
import type { ContentSource, ParsedMdxDocument } from "./content-source";
import {
  collectionDirectory,
  localeDirectory,
  slugFromPath,
} from "./paths";

const listMdxFiles = async (directory: string): Promise<string[]> => {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => path.join(directory, entry.name));
};

const readMdxFile = async (filePath: string): Promise<ParsedMdxDocument> => {
  const source = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(source);

  return {
    slug: slugFromPath(filePath),
    content,
    data,
  };
};

export const listLocaleDirectories = async (
  collection: string
): Promise<string[]> => {
  const entries = await fs.readdir(collectionDirectory(collection), {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isDirectory() && isValidLocale(entry.name))
    .map((entry) => entry.name);
};

export const localContentSource: ContentSource = {
  listSlugs: async (collection: string, locale: string): Promise<string[]> => {
    const files = await listMdxFiles(localeDirectory(collection, locale));
    return files.map((file) => slugFromPath(file));
  },

  readDocument: async (
    collection: string,
    locale: string,
    slug: string
  ): Promise<ParsedMdxDocument | null> => {
    const filePath = path.join(
      localeDirectory(collection, locale),
      `${slug}.mdx`
    );

    try {
      await fs.access(filePath);
    } catch {
      return null;
    }

    return readMdxFile(filePath);
  },

  documentExists: async (
    collection: string,
    locale: string,
    slug: string
  ): Promise<boolean> => {
    const filePath = path.join(
      localeDirectory(collection, locale),
      `${slug}.mdx`
    );

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  },
};

export const listMdxFilesInDirectory = listMdxFiles;
export const readMdxFileFromPath = readMdxFile;
