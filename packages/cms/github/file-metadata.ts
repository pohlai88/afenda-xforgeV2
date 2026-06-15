import "server-only";

import { githubHeaders } from "./config";

interface GitHubFileMetadataResponse {
  sha?: string;
}

export const decodeGitHubBase64Content = (encoded: string): string =>
  Buffer.from(encoded.replace(/\n/g, ""), "base64").toString("utf8");

export const getGitHubFileSha = async (
  owner: string,
  repo: string,
  path: string,
  token: string,
  branch: string
): Promise<string | undefined> => {
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  );
  url.searchParams.set("ref", branch);

  const response = await fetch(url, {
    headers: githubHeaders(token),
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`GitHub read failed: ${response.status}`);
  }

  const data = (await response.json()) as GitHubFileMetadataResponse;
  return data.sha;
};
