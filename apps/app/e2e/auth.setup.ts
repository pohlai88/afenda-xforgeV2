import fs from "node:fs";
import { test as setup } from "@playwright/test";
import { getE2eAuthStoragePath } from "./helpers/load-env";
import { signInWithPassword } from "./helpers/sign-in";

setup.setTimeout(180_000);

setup("authenticate e2e user", async ({ browser, page }) => {
  const authStoragePath = getE2eAuthStoragePath();

  if (fs.existsSync(authStoragePath)) {
    const context = await browser.newContext({ storageState: authStoragePath });
    const storedPage = await context.newPage();

    await storedPage.goto("/orbit-case", { waitUntil: "domcontentloaded" });
    const hasOrbitCaseSession = await storedPage
      .getByLabel("Orbit Case title")
      .isVisible({ timeout: 30_000 })
      .catch(() => false);

    if (hasOrbitCaseSession) {
      await context.storageState({ path: authStoragePath });
      await context.close();
      return;
    }

    await context.close();
  }

  await signInWithPassword(page);
  await page.context().storageState({ path: authStoragePath });
});
