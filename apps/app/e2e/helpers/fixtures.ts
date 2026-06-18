import { test as base } from "@playwright/test";

export const test = base.extend<{ uniqueTitle: string }>({
  uniqueTitle: async (
    // biome-ignore lint/correctness/noEmptyPattern: Playwright fixture callbacks require object destructuring.
    {},
    use
  ) => {
    await use(`E2E ${Date.now()}`);
  },
});
