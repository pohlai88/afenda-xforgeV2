import { expect } from "@playwright/test";
import { test } from "./helpers/fixtures";
import { createOrbitCaseOnDetailPage } from "./helpers/orbit-case";

test.describe("Orbit Case lifecycle @orbit-case", () => {
  test.setTimeout(60_000);

  test("create, detail, comment, status change, archive", async ({
    page,
    uniqueTitle,
  }) => {
    await createOrbitCaseOnDetailPage(page, uniqueTitle);
    await expect(page.getByLabel("Case title", { exact: true })).toHaveValue(
      uniqueTitle
    );

    await page.getByLabel("Comment").fill("E2E comment");
    await page.getByRole("button", { name: "Post comment" }).click();
    await expect(page.getByText("E2E comment")).toBeVisible();

    await page.locator("#case-status").click();
    await page.getByRole("option", { name: "Doing" }).click();
    await expect(
      page.getByRole("button", { name: "Archive case" })
    ).toBeEnabled({
      timeout: 15_000,
    });
    await page.getByRole("button", { name: "Archive case" }).click();
    await expect(page).toHaveURL(/\/orbit-case$/, { timeout: 15_000 });
  });

  test("due date appears on calendar and timeline tabs", async ({
    page,
    uniqueTitle,
  }) => {
    await createOrbitCaseOnDetailPage(page, uniqueTitle);

    await page.locator("#case-due-date").click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /today/i })
      .click();
    await expect(page.locator("#case-due-date")).not.toHaveText(
      "Set due date",
      {
        timeout: 15_000,
      }
    );

    await page.goto("/orbit-case");
    await page.getByRole("tab", { name: "Calendar" }).click();
    await page.getByRole("button", { name: /today/i }).first().click();
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 15_000 });

    await page.getByRole("tab", { name: "Timeline" }).click();
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 15_000 });
  });
});
