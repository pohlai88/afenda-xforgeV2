import path from "node:path";
import { defineConfig, defineProject } from "vitest/config";
import {
  serverOnlyAlias,
  sharedIntegrationTestOptions,
  sharedUnitTestOptions,
  testSupportPaths,
} from "../../vitest.shared.mts";

const webhooksIntegrationSetup = path.resolve(
  import.meta.dirname,
  "./test-support/setup-integration-env.ts"
);

const webhooksIntegrationFetchSetup = path.resolve(
  import.meta.dirname,
  "./test-support/setup-integration-fetch.ts"
);

const webhooksGlobalSetup = path.resolve(
  import.meta.dirname,
  "./test-support/global-setup-integration.ts"
);

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
          globalSetup: [webhooksGlobalSetup],
          restoreMocks: false,
          clearMocks: false,
          setupFiles: [
            testSupportPaths.integrationSetup,
            webhooksIntegrationSetup,
            webhooksIntegrationFetchSetup,
          ],
        },
        resolve: {
          alias: serverOnlyAlias(),
        },
      }),
    ],
  },
});
