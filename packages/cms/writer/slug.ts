import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();

export const slugifyTitle = (title: string): string => {
  slugger.reset();
  const slug = slugger.slug(title.trim());

  return slug || "untitled";
};

export const isValidSlug = (slug: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
