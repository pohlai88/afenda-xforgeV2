import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import {
  getGitHubConfig,
  githubHeaders,
  settingsContentPath,
} from "./github/config";
import {
  decodeGitHubBase64Content,
  getGitHubFileSha,
} from "./github/file-metadata";
import { settingsFilePath } from "./loader/paths";
import { getReadMode } from "./loader/read-mode";
import { getWriteMode } from "./writer/write-mode";

interface GitHubFileResponse {
  content?: string;
}

const readSettingsFromGitHub = async (): Promise<string> => {
  const { token, owner, repo, branch } = getGitHubConfig();
  const path = settingsContentPath();
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  );
  url.searchParams.set("ref", branch);

  const response = await fetch(url, {
    headers: githubHeaders(token),
  });

  if (response.status === 404) {
    throw new Error("settings.json not found in GitHub content repository");
  }

  if (!response.ok) {
    throw new Error(`GitHub settings read failed: ${response.status}`);
  }

  const data = (await response.json()) as GitHubFileResponse;

  if (!data.content) {
    throw new Error("GitHub settings file has no content");
  }

  return decodeGitHubBase64Content(data.content);
};

const writeSettingsToGitHub = async (
  content: string,
  message: string
): Promise<{ path: string }> => {
  const { token, owner, repo, branch } = getGitHubConfig();
  const path = settingsContentPath();
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
    throw new Error(
      `GitHub settings write failed: ${response.status} ${errorBody}`
    );
  }

  return { path };
};

const writeSettingsLocally = async (
  content: string
): Promise<{ path: string }> => {
  const filePath = settingsFilePath();
  await writeFile(filePath, content, "utf8");
  return { path: filePath };
};

export const readSettingsRaw = (): Promise<string> => {
  if (getReadMode() === "github") {
    return readSettingsFromGitHub();
  }

  return readFile(settingsFilePath(), "utf8");
};

export const writeSettingsRaw = (
  content: string,
  message = "chore(cms): update site settings"
): Promise<{ path: string }> => {
  if (getWriteMode() === "github") {
    return writeSettingsToGitHub(content, message);
  }

  return writeSettingsLocally(content);
};
