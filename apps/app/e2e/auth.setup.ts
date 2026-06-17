import { test as setup } from "@playwright/test";
import { getE2eAuthStoragePath } from "./helpers/load-env";
import { signInWithPassword } from "./helpers/sign-in";

setup("authenticate e2e user", async ({ page }) => {
  await signInWithPassword(page);
  await page.context().storageState({ path: getE2eAuthStoragePath() });
});
