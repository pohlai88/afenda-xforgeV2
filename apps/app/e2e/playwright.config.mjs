import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appDir, loadE2eEnv } from "./helpers/load-env.mjs";

const e2eDir = path.dirname(fileURLToPath(import.meta.url));

loadE2eEnv();

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: e2eDir,
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: path.join(appDir, "output/playwright/report") }],
  ],
  outputDir: path.join(appDir, "output/playwright/test-results"),
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: "pnpm dev",
        cwd: appDir,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
