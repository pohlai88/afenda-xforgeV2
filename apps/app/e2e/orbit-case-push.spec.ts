import { expect, test } from "@playwright/test";
import { signInWithPassword } from "./helpers/sign-in";

test.describe("Orbit Case push", () => {
  test.setTimeout(90_000);

  test("pushes case to budget destination and shows link", async ({ page }) => {
    const uniqueTitle = `E2E Push ${Date.now()}`;

    await signInWithPassword(page);

    await page.goto("/orbit-case");
    await page.getByLabel("Orbit Case title").fill(uniqueTitle);
    await page.getByRole("button", { name: "Create case" }).click();
    await expect(page).toHaveURL(/\/orbit-case\/[^/]+$/, { timeout: 15_000 });

    await expect(page.getByRole("heading", { name: "Push to module" })).toBeVisible({
      timeout: 15_000,
    });

    await page.getByLabel("Destination").click();
    await page.getByRole("option", { name: "Budget Request" }).click();
    await page.getByRole("button", { name: "Push" }).click();

    await expect(page.getByRole("heading", { name: "Links" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("budget-request")).toBeVisible();
  });
});
