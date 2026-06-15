import type { ContentImage } from "../types";

export const defaultBlogImage = (): ContentImage => ({
  url: "/blog/placeholder.svg",
  width: 1200,
  height: 630,
  alt: null,
});
