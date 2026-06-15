export type { ParsedMdxDocument } from "./content-source";
export {
  listMdxFilesInDirectory as listMdxFiles,
  readMdxFileFromPath as readMdxFile,
} from "./local-source";

import path from "node:path";
import { collectionDirectory } from "./paths";

export const resolveMdxFile = async (
  directory: string,
  slug: string
): Promise<string | null> => {
  const filePath = path.join(directory, `${slug}.mdx`);

  try {
    const { access } = await import("node:fs/promises");
    await access(filePath);
  } catch {
    return null;
  }

  return filePath;
};

// Re-export for validation scripts that pass collection directory paths.
export { collectionDirectory };
