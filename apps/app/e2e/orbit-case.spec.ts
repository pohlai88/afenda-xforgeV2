import { expect, test } from "@playwright/test";

const e2eEmail =
  process.env.E2E_AUTH_EMAIL ??
  process.env.E2E_ORG_ADMIN_EMAIL ??
  "e2e-playwright@xforge.local";
const e2ePassword =
  process.env.E2E_AUTH_PASSWORD ??
  process.env.E2E_ORG_ADMIN_PASSWORD ??
  "123qweasdzxc!@#";

test.describe("Orbit Case lifecycle", () => {
  test("create, detail, comment, status change, archive", async ({ page }) => {
    const uniqueTitle = `E2E Orbit ${Date.now()}`;

    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(e2eEmail);
    await page.getByLabel("Password").fill(e2ePassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.goto("/orbit-case");
    await page.getByLabel("Orbit Case title").fill(uniqueTitle);
    await page.getByRole("button", { name: "Create case" }).click();

    await expect(page).toHaveURL(/\/orbit-case\/[^/]+$/);
    await expect(page.getByLabel("Case title")).toHaveValue(uniqueTitle);

    await page.getByLabel("Comment").fill("E2E comment");
    await page.getByRole("button", { name: "Post comment" }).click();
    await expect(page.getByText("E2E comment")).toBeVisible();

    await page.getByLabel("Status").click();
    await page.getByRole("option", { name: "Doing" }).click();

    await page.getByRole("button", { name: "Archive case" }).click();
    await expect(page).toHaveURL(/\/orbit-case$/);
  });
});
