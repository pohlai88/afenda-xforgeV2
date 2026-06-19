import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import {
  appDir,
  e2eOutputDir,
  getE2eAuthStoragePath,
  getE2eWebServerEnv,
  getPlaywrightBaseUrl,
  loadE2eEnv,
} from "./helpers/load-env";

const e2eDir = path.dirname(fileURLToPath(import.meta.url));

loadE2eEnv();

const baseURL = getPlaywrightBaseUrl();
const webServerReadyUrl = new URL("/icon.png", baseURL).toString();
const authStorageState = getE2eAuthStoragePath();
const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: e2eDir,
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  timeout: 90_000,
  workers: 1,
  globalSetup: process.env.PLAYWRIGHT_SKIP_GLOBAL_SETUP
    ? undefined
    : path.join(e2eDir, "global-setup.ts"),
  reporter: [
    ["list"],
    [
      "html",
      {
        open: "never",
        outputFolder: path.join(e2eOutputDir, "report"),
      },
    ],
  ],
  outputDir: path.join(e2eOutputDir, "test-results"),
  use: {
    baseURL,
    trace: isCi ? "on-first-retry" : "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    {
      name: "setup",
      testMatch: "auth.setup.ts",
    },
    {
      name: "auth-flows",
      testMatch: [
        "auth.spec.ts",
        "auth-completion.spec.ts",
        "email-auth.spec.ts",
      ],
      fullyParallel: false,
    },
    {
      name: "authenticated",
      testMatch: [
        "orbit-case.spec.ts",
        "orbit-case-push.spec.ts",
        "orbit-case-morph-lifecycle.spec.ts",
        "orbit-case-notifications.spec.ts",
      ],
      dependencies: ["setup"],
      fullyParallel: true,
      use: {
        ...devices["Desktop Chrome"],
        storageState: authStorageState,
      },
    },
    {
      name: "authenticated-blob",
      testMatch: ["orbit-case-blob.spec.ts"],
      dependencies: ["setup"],
      fullyParallel: true,
      use: {
        ...devices["Desktop Chrome"],
        storageState: authStorageState,
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: "pnpm exec next dev --webpack -p 3000",
        cwd: appDir,
        url: webServerReadyUrl,
        reuseExistingServer: !process.env.PLAYWRIGHT_FORCE_FRESH_SERVER,
        timeout: 180_000,
        env: getE2eWebServerEnv(),
      },
});
