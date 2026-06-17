import { expect, test } from "./helpers/fixtures";
import { createOrbitCaseOnDetailPage } from "./helpers/orbit-case";

test.describe("Orbit Case push @orbit-case", () => {
  test.setTimeout(90_000);

  test("pushes case to budget destination and opens target with origin", async ({
    page,
    uniqueTitle,
  }) => {
    await test.step("Create case", async () => {
      await createOrbitCaseOnDetailPage(page, uniqueTitle);
    });

    await test.step("Push to budget destination", async () => {
      await expect(page.getByRole("heading", { name: "Push to module" })).toBeVisible({
        timeout: 15_000,
      });
      await page.getByLabel("Destination").click();
      await page.getByRole("option", { name: "Budget Request" }).click();
      await page.getByRole("button", { name: "Push" }).click();
      await expect(page.getByRole("heading", { name: "Links" })).toBeVisible({
        timeout: 15_000,
      });
    });

    await test.step("Open budget target and verify origin", async () => {
      const budgetLink = page.getByRole("link", { name: "Budget Request" });
      await expect(budgetLink).toBeVisible();
      await budgetLink.click();
      await expect(page).toHaveURL(/\/orbit-case\/budget\/[^/]+$/, {
        timeout: 15_000,
      });
      await expect(page.getByText("From Orbit Case")).toBeVisible();
      await expect(page.getByRole("link", { name: uniqueTitle })).toBeVisible();
    });
  });
});
