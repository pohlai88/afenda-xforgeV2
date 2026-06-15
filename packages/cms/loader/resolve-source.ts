import "server-only";

import type { ContentSource } from "./content-source";
import { githubContentSource } from "./github-source";
import { localContentSource } from "./local-source";
import { getReadMode } from "./read-mode";

export const getContentSource = (): ContentSource => {
  if (getReadMode() === "github") {
    return githubContentSource;
  }

  return localContentSource;
};
