import "server-only";

import {
  documentContentPath,
  getGitHubConfig,
  githubHeaders,
} from "../github/config";
import { getGitHubFileSha } from "../github/file-metadata";

export const writeGitHubDocument = async (
  collection: string,
  locale: string,
  slug: string,
  content: string,
  message: string
): Promise<{ path: string }> => {
  const { token, owner, repo, branch } = getGitHubConfig();
  const path = documentContentPath(collection, locale, slug);
  const sha = await getGitHubFileSha(owner, repo, path, token, branch);

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        ...githubHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf8").toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub write failed: ${response.status} ${errorBody}`);
  }

  return { path };
};

export const deleteGitHubDocument = async (
  collection: string,
  locale: string,
  slug: string,
  message: string
): Promise<boolean> => {
  const { token, owner, repo, branch } = getGitHubConfig();
  const path = documentContentPath(collection, locale, slug);
  const sha = await getGitHubFileSha(owner, repo, path, token, branch);

  if (!sha) {
    return false;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: "DELETE",
      headers: {
        ...githubHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        sha,
        branch,
      }),
    }
  );

  return response.ok;
};
