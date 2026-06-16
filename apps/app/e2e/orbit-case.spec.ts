import { expect, test } from "@playwright/test";
import { signInWithPassword } from "./helpers/sign-in";

test.describe("Orbit Case lifecycle", () => {
  test.setTimeout(60_000);

  test("create, detail, comment, status change, archive", async ({ page }) => {
    const uniqueTitle = `E2E Orbit ${Date.now()}`;

    await signInWithPassword(page);

    await page.goto("/orbit-case");
    await page.getByLabel("Orbit Case title").fill(uniqueTitle);
    await expect(page.getByRole("button", { name: "Create case" })).toBeEnabled();
    await page.getByRole("button", { name: "Create case" }).click();
    await expect(page).toHaveURL(/\/orbit-case\/[^/]+$/, { timeout: 15_000 });
    await expect(page.getByLabel("Case title")).toHaveValue(uniqueTitle);

    await page.getByLabel("Comment").fill("E2E comment");
    await page.getByRole("button", { name: "Post comment" }).click();
    await expect(page.getByText("E2E comment")).toBeVisible();

    await page.getByLabel("Status").click();
    await page.getByRole("option", { name: "Doing" }).click();
    await expect(page.getByRole("button", { name: "Archive case" })).toBeEnabled({
      timeout: 15_000,
    });
    await page.getByRole("button", { name: "Archive case" }).click();
    await expect(page).toHaveURL(/\/orbit-case$/);
  });
});
