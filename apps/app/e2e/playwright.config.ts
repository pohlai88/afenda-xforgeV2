import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import {
  appDir,
  getE2eAuthStoragePath,
  getE2eBlobWebServerEnv,
  getPlaywrightBaseUrl,
  loadE2eEnv,
} from "./helpers/load-env";

const e2eDir = path.dirname(fileURLToPath(import.meta.url));

loadE2eEnv();

const baseURL = getPlaywrightBaseUrl();
const authStorageState = getE2eAuthStoragePath();
const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: e2eDir,
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: isCi ? 1 : "50%",
  globalSetup: process.env.PLAYWRIGHT_SKIP_GLOBAL_SETUP
    ? undefined
    : path.join(e2eDir, "global-setup.ts"),
  reporter: [
    ["list"],
    [
      "html",
      {
        open: "never",
        outputFolder: path.join(appDir, "output/playwright/report"),
      },
    ],
  ],
  outputDir: path.join(appDir, "output/playwright/test-results"),
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
      testMatch: ["orbit-case.spec.ts", "orbit-case-push.spec.ts"],
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
        command: "pnpm dev",
        cwd: appDir,
        url: baseURL,
        reuseExistingServer: !process.env.PLAYWRIGHT_FORCE_FRESH_SERVER,
        timeout: 120_000,
        env: getE2eBlobWebServerEnv(),
      },
});
