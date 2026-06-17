import { expect, test } from "@playwright/test";
import { getE2eBlobEnvStatus } from "./helpers/load-env.mjs";
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

  test("due date appears on calendar and timeline tabs", async ({ page }) => {
    const uniqueTitle = `E2E Due ${Date.now()}`;
    const today = new Date();
    const dayLabel = String(today.getDate());

    await signInWithPassword(page);

    await page.goto("/orbit-case");
    await page.getByLabel("Orbit Case title").fill(uniqueTitle);
    await page.getByRole("button", { name: "Create case" }).click();
    await expect(page).toHaveURL(/\/orbit-case\/[^/]+$/, { timeout: 15_000 });

    await page.getByRole("button", { name: "Set due date" }).click();
    await page
      .getByRole("gridcell", { name: dayLabel, exact: true })
      .first()
      .click();
    await expect(page.getByRole("button", { name: "Set due date" })).toHaveCount(
      0,
      { timeout: 15_000 }
    );

    await page.goto("/orbit-case");
    await page.getByRole("tab", { name: "Calendar" }).click();
    await page
      .getByRole("gridcell", { name: dayLabel, exact: true })
      .first()
      .click();
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 15_000 });

    await page.getByRole("tab", { name: "Timeline" }).click();
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 15_000 });
  });

  test("uploads attachment when blob storage is configured", async ({ page }) => {
    const blobEnv = getE2eBlobEnvStatus();
    if (!blobEnv.readyForUploadTests) {
      test.skip(
        true,
        "XFORGE_PUB_BLOB_READ_WRITE_TOKEN and XFORGE_PUB_STORE_ID required for upload E2E"
      );
    }

    const uniqueTitle = `E2E Attach ${Date.now()}`;
    const fileName = "e2e-orbit-notes.txt";

    await signInWithPassword(page);

    await page.goto("/orbit-case");
    await page.getByLabel("Orbit Case title").fill(uniqueTitle);
    await page.getByRole("button", { name: "Create case" }).click();
    await expect(page).toHaveURL(/\/orbit-case\/[^/]+$/, { timeout: 15_000 });

    await page.getByLabel("Upload attachment").setInputFiles({
      name: fileName,
      mimeType: "text/plain",
      buffer: Buffer.from("orbit case e2e attachment"),
    });

    await expect(page.getByRole("link", { name: fileName })).toBeVisible({
      timeout: 20_000,
    });
  });
});
