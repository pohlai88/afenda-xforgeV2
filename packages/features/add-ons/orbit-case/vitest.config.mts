import { defineConfig, defineProject } from "vitest/config";
import {
  serverOnlyAlias,
  sharedIntegrationTestOptions,
  sharedUnitTestOptions,
  testSupportPaths,
} from "../../../../vitest.shared.mts";

export default defineConfig({
  test: {
    projects: [
      defineProject({
        test: {
          ...sharedUnitTestOptions,
          name: "unit",
          include: ["test/**/*.test.ts"],
          exclude: ["test/integration/**", "**/node_modules/**"],
        },
        resolve: {
          alias: serverOnlyAlias(),
        },
      }),
      defineProject({
        test: {
          ...sharedIntegrationTestOptions,
          name: "integration",
          include: ["test/integration/**/*.integration.test.ts"],
          setupFiles: [testSupportPaths.integrationSetup],
        },
        resolve: {
          alias: serverOnlyAlias(),
        },
      }),
    ],
  },
});
