import { test as base } from "@playwright/test";

export const test = base.extend<{ uniqueTitle: string }>({
  uniqueTitle: async (_fixtures, use) => {
    await use(`E2E ${Date.now()}`);
  },
});
