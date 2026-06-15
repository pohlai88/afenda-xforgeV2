import "server-only";

import { normalizeLocale } from "../locale";
import { keys } from "../keys";

export type GitHubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

export const collectionContentDirectory = (collection: string): string =>
  `packages/cms/content/${collection}`;

export const localeContentDirectory = (
  collection: string,
  locale: string
): string => `${collectionContentDirectory(collection)}/${normalizeLocale(locale)}`;

export const documentContentPath = (
  collection: string,
  locale: string,
  slug: string
): string => `${localeContentDirectory(collection, locale)}/${slug}.mdx`;

export const getGitHubConfig = (): GitHubConfig => {
  const env = keys();

  if (!(env.CMS_GITHUB_TOKEN && env.CMS_GITHUB_REPO)) {
    throw new Error(
      "CMS_GITHUB_TOKEN and CMS_GITHUB_REPO are required for GitHub content access"
    );
  }

  const [owner, repo] = env.CMS_GITHUB_REPO.split("/");

  if (!(owner && repo)) {
    throw new Error("CMS_GITHUB_REPO must be in owner/repo format");
  }

  return {
    token: env.CMS_GITHUB_TOKEN,
    owner,
    repo,
    branch: env.CMS_GITHUB_BRANCH,
  };
};

export const githubHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});
