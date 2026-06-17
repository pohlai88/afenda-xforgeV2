import path from "node:path";
import { test as setup } from "@playwright/test";
import { signInWithPassword } from "./helpers/sign-in";

const e2eAuthStoragePath = path.join(
  process.cwd(),
  "output/playwright/.auth/e2e-user.json"
);

setup("authenticate e2e user", async ({ page }) => {
  await signInWithPassword(page);
  await page.context().storageState({ path: e2eAuthStoragePath });
});
