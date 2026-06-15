import GithubSlugger from "github-slugger";

export const slugifyHeading = (slugger: GithubSlugger, title: string): string =>
  slugger.slug(title);

export const createHeadingSlugger = (): GithubSlugger => new GithubSlugger();
