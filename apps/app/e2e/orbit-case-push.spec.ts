import { expect } from "@playwright/test";
import { test } from "./helpers/fixtures";
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
      await expect(
        page.getByRole("heading", { name: "Push to module" })
      ).toBeVisible({
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

  test("pushes case to meeting destination and opens target with origin", async ({
    page,
    uniqueTitle,
  }) => {
    await test.step("Create case", async () => {
      await createOrbitCaseOnDetailPage(page, uniqueTitle);
    });

    await test.step("Push to meeting destination", async () => {
      await expect(
        page.getByRole("heading", { name: "Push to module" })
      ).toBeVisible({
        timeout: 15_000,
      });
      await page.getByLabel("Destination").click();
      await page.getByRole("option", { name: "Meeting Request" }).click();
      await page.getByRole("button", { name: "Push" }).click();
      await expect(page.getByRole("heading", { name: "Links" })).toBeVisible({
        timeout: 15_000,
      });
    });

    await test.step("Open meeting target and verify origin", async () => {
      const meetingLink = page.getByRole("link", { name: "Meeting Request" });
      await expect(meetingLink).toBeVisible();
      await meetingLink.click();
      await expect(page).toHaveURL(/\/orbit-case\/meeting\/[^/]+$/, {
        timeout: 15_000,
      });
      await expect(page.getByText("From Orbit Case")).toBeVisible();
      await expect(page.getByRole("link", { name: uniqueTitle })).toBeVisible();
    });
  });

  test("pushes case to approval destination and opens target with origin", async ({
    page,
    uniqueTitle,
  }) => {
    await test.step("Create case", async () => {
      await createOrbitCaseOnDetailPage(page, uniqueTitle);
    });

    await test.step("Push to approval destination", async () => {
      await expect(
        page.getByRole("heading", { name: "Push to module" })
      ).toBeVisible({
        timeout: 15_000,
      });
      await page.getByLabel("Destination").click();
      await page.getByRole("option", { name: "Approval Request" }).click();
      await page.getByRole("button", { name: "Push" }).click();
      await expect(page.getByRole("heading", { name: "Links" })).toBeVisible({
        timeout: 15_000,
      });
    });

    await test.step("Open approval target and verify origin", async () => {
      const approvalLink = page.getByRole("link", { name: "Approval Request" });
      await expect(approvalLink).toBeVisible();
      await approvalLink.click();
      await expect(page).toHaveURL(/\/orbit-case\/approval\/[^/]+$/, {
        timeout: 15_000,
      });
      await expect(page.getByText("From Orbit Case")).toBeVisible();
      await expect(page.getByRole("link", { name: uniqueTitle })).toBeVisible();
    });
  });
});
