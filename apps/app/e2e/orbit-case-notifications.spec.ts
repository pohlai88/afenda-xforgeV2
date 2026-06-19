import { test } from "./helpers/fixtures";
import { createOrbitCaseOnDetailPage } from "./helpers/orbit-case";
import { expect } from "@playwright/test";

test.describe("Orbit Case notifications @orbit-case", () => {
  test.setTimeout(90_000);

  test("opens notifications panel from topbar bell", async ({ page }) => {
    await createOrbitCaseOnDetailPage(page, `Notify ${Date.now()}`);

    await page.getByRole("button", { name: "Notifications" }).click();
    await expect(
      page.getByRole("dialog", { name: "Notifications" })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("No notifications yet.")).toBeVisible();
  });
});
