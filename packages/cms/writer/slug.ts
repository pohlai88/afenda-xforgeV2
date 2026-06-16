import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();
const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugifyTitle = (title: string): string => {
  slugger.reset();
  const slug = slugger.slug(title.trim());

  return slug || "untitled";
};

export const isValidSlug = (slug: string): boolean =>
  VALID_SLUG_PATTERN.test(slug);
