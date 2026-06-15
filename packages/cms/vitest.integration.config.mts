import { defineConfig } from "vitest/config";
import {
  serverOnlyAlias,
  sharedIntegrationTestOptions,
  testSupportPaths,
} from "../../vitest.shared.mts";

const cmsIntegrationSetup = "test-support/setup-integration-env.ts";
const cmsGlobalSetup = "test-support/global-setup-integration.ts";

export default defineConfig({
  test: {
    ...sharedIntegrationTestOptions,
    globalSetup: [cmsGlobalSetup],
    setupFiles: [testSupportPaths.integrationSetup, cmsIntegrationSetup],
  },
  resolve: {
    alias: serverOnlyAlias(),
  },
});
