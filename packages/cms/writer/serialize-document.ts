import matter from "gray-matter";

export const serializeDocument = (
  frontmatter: Record<string, unknown>,
  body: string
): string => matter.stringify(body.trimEnd(), frontmatter);
