import "server-only";

import { createHash } from "node:crypto";
import { bundleMDX } from "mdx-bundler";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import type { ContentBody, TocItem } from "../types";
import { createHeadingSlugger, slugifyHeading } from "./heading-slug";

const WORDS_PER_MINUTE = 200;

export const extractToc = (source: string): TocItem[] => {
  const slugger = createHeadingSlugger();
  const items: TocItem[] = [];

  for (const line of source.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+?)\s*$/);

    if (!match) {
      continue;
    }

    const level = match[1].length === 2 ? 2 : 3;
    const title = match[2].trim();

    items.push({
      id: slugifyHeading(slugger, title),
      title,
      level,
    });
  }

  return items;
};

export const estimateReadingTime = (plainText: string): number =>
  Math.max(
    1,
    Math.ceil(
      plainText.trim().split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE
    )
  );

export const compileMdx = async (source: string): Promise<ContentBody> => {
  const toc = extractToc(source);
  const plainText = source
    .replace(/^---[\s\S]*?---\n?/, "")
    .replace(/[#>*`[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const { code } = await bundleMDX({
    source,
    mdxOptions(options) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: "vesper",
          },
        ],
      ];

      return options;
    },
  });

  return {
    code,
    plainText,
    readingTime: estimateReadingTime(plainText),
    toc,
  };
};

const compileCache = new Map<string, ContentBody>();

const hashSource = (source: string): string =>
  createHash("sha256").update(source).digest("hex");

export const compileMdxCached = async (
  source: string
): Promise<ContentBody> => {
  const cacheKey = hashSource(source);
  const cached = compileCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const compiled = await compileMdx(source);
  compileCache.set(cacheKey, compiled);

  return compiled;
};

export const clearCompileCache = (): void => {
  compileCache.clear();
};
