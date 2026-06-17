import { defineConfig, defineProject } from "vitest/config";
import { sharedUnitTestOptions } from "../../vitest.shared.mts";

export default defineConfig({
  test: {
    projects: [
      defineProject({
        test: {
          ...sharedUnitTestOptions,
          name: "unit",
          include: ["test/**/*.test.ts"],
        },
      }),
    ],
  },
});
