import "server-only";

import matter from "gray-matter";
import { isValidLocale } from "../locale";
import {
  documentContentPath,
  getGitHubConfig,
  githubHeaders,
  localeContentDirectory,
} from "../github/config";
import {
  decodeGitHubBase64Content,
  getGitHubFileSha,
} from "../github/file-metadata";
import type { ContentSource, ParsedMdxDocument } from "./content-source";

const MDX_EXTENSION_PATTERN = /\.mdx$/;

interface GitHubContentEntry {
  name: string;
  type: "file" | "dir";
  path: string;
}

interface GitHubFileResponse {
  content?: string;
}

const parseMdxSource = (slug: string, source: string): ParsedMdxDocument => {
  const { content, data } = matter(source);

  return {
    slug,
    content,
    data,
  };
};

const normalizeGitHubDirectoryEntries = (
  payload: GitHubContentEntry | GitHubContentEntry[]
): GitHubContentEntry[] => (Array.isArray(payload) ? payload : [payload]);

const fetchGitHubDirectory = async (
  directoryPath: string
): Promise<GitHubContentEntry[]> => {
  const { token, owner, repo, branch } = getGitHubConfig();
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/contents/${directoryPath}`
  );
  url.searchParams.set("ref", branch);

  const response = await fetch(url, {
    headers: githubHeaders(token),
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`GitHub list failed: ${response.status}`);
  }

  return normalizeGitHubDirectoryEntries(
    (await response.json()) as GitHubContentEntry | GitHubContentEntry[]
  );
};

export const githubContentSource: ContentSource = {
  listSlugs: async (collection: string, locale: string): Promise<string[]> => {
    const directoryPath = localeContentDirectory(collection, locale);
    const entries = await fetchGitHubDirectory(directoryPath);

    return entries
      .filter((entry) => entry.type === "file" && entry.name.endsWith(".mdx"))
      .map((entry) => entry.name.replace(MDX_EXTENSION_PATTERN, ""));
  },

  readDocument: async (
    collection: string,
    locale: string,
    slug: string
  ): Promise<ParsedMdxDocument | null> => {
    const { token, owner, repo, branch } = getGitHubConfig();
    const path = documentContentPath(collection, locale, slug);
    const url = new URL(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    );
    url.searchParams.set("ref", branch);

    const response = await fetch(url, {
      headers: githubHeaders(token),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub read failed: ${response.status}`);
    }

    const data = (await response.json()) as GitHubFileResponse;

    if (!data.content) {
      return null;
    }

    return parseMdxSource(slug, decodeGitHubBase64Content(data.content));
  },

  documentExists: async (
    collection: string,
    locale: string,
    slug: string
  ): Promise<boolean> => {
    const { token, owner, repo, branch } = getGitHubConfig();
    const path = documentContentPath(collection, locale, slug);
    const sha = await getGitHubFileSha(owner, repo, path, token, branch);
    return sha !== undefined;
  },
};

export const listGitHubLocales = async (
  collection: string
): Promise<string[]> => {
  const entries = await fetchGitHubDirectory(
    `packages/cms/content/${collection}`
  );

  return entries
    .filter((entry) => entry.type === "dir" && isValidLocale(entry.name))
    .map((entry) => entry.name);
};
