import { expect } from "@playwright/test";
import { test } from "./helpers/fixtures";
import { createOrbitCaseOnDetailPage } from "./helpers/orbit-case";
import {
  getOrbitNotificationReadAt,
  seedOrbitNotificationForE2eUser,
} from "./helpers/orbit-notifications";

test.describe("Orbit Case notifications @orbit-case", () => {
  test.setTimeout(90_000);

  test("renders a persisted notification and opens its deep link", async ({
    page,
  }) => {
    const caseTitle = `Notify ${Date.now()}`;
    const notificationTitle = `Unread notification ${Date.now()}`;
    const notificationBody = "Seeded browser feed notification";

    await createOrbitCaseOnDetailPage(page, caseTitle);
    const casePath = new URL(page.url()).pathname;
    const notification = await seedOrbitNotificationForE2eUser({
      body: notificationBody,
      href: casePath,
      title: notificationTitle,
    });

    await page.goto("/orbit-case");

    await page.getByLabel("Notifications", { exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "Notifications" })
    ).toBeVisible({ timeout: 15_000 });

    const notificationArticle = page
      .getByRole("article")
      .filter({ hasText: notificationTitle });
    await expect(notificationArticle).toBeVisible({ timeout: 15_000 });
    await expect(notificationArticle.getByText(notificationBody)).toBeVisible();
    await expect(notificationArticle.getByText("New")).toBeVisible();

    await notificationArticle.getByRole("link", { name: "Open" }).click();
    await expect(page).toHaveURL(new RegExp(`${casePath}$`), {
      timeout: 15_000,
    });
    await expect
      .poll(async () => getOrbitNotificationReadAt(notification.id), {
        message: "notification is marked read after opening its deep link",
        timeout: 15_000,
      })
      .not.toBeNull();
  });
});
