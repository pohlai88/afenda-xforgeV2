import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { documentPath } from "../loader/paths";

export const writeLocalDocument = async (
  collection: string,
  locale: string,
  slug: string,
  content: string
): Promise<{ path: string }> => {
  const filePath = documentPath(collection, locale, slug);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");

  return { path: filePath };
};

export const deleteLocalDocument = async (
  collection: string,
  locale: string,
  slug: string
): Promise<boolean> => {
  const filePath = documentPath(collection, locale, slug);

  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
};
