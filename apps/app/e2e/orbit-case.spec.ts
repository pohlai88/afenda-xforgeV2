import { expect, test, type Page } from "@playwright/test";
import { getE2eBlobEnvStatus } from "./helpers/load-env.mjs";
import { signInWithPassword } from "./helpers/sign-in";

const createOrbitCaseOnDetailPage = async (
  page: Page,
  uniqueTitle: string
): Promise<void> => {
  await page.goto("/orbit-case");
  await page.getByLabel("Orbit Case title").fill(uniqueTitle);
  await expect(page.getByRole("button", { name: "Create case" })).toBeEnabled();
  await page.getByRole("button", { name: "Create case" }).click();
  await expect(page).toHaveURL(/\/orbit-case\/[^/]+$/, { timeout: 15_000 });
};

const setAttachmentPrivacy = async (
  page: Page,
  access: "public" | "private"
): Promise<void> => {
  await page.getByLabel("Default privacy for uploads").click();
  await page
    .getByRole("option", {
      name:
        access === "public"
          ? /Public link — anyone with the URL can open/
          : /Private — org members only/,
    })
    .click();
};

const uploadTextAttachment = async (
  page: Page,
  fileName: string,
  content: string
): Promise<void> => {
  await page.getByLabel("Upload attachment").setInputFiles({
    name: fileName,
    mimeType: "text/plain",
    buffer: Buffer.from(content),
  });
};

test.describe("Orbit Case lifecycle", () => {
  test.setTimeout(60_000);

  test("create, detail, comment, status change, archive", async ({ page }) => {
    const uniqueTitle = `E2E Orbit ${Date.now()}`;

    await signInWithPassword(page);
    await createOrbitCaseOnDetailPage(page, uniqueTitle);
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
    await createOrbitCaseOnDetailPage(page, uniqueTitle);

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

  test("uploads public attachment via client blob upload", async ({ page }) => {
    const blobEnv = getE2eBlobEnvStatus();
    if (!blobEnv.readyForUploadTests) {
      test.skip(
        true,
        "XFORGE_PUB_BLOB_READ_WRITE_TOKEN and XFORGE_PUB_STORE_ID required"
      );
    }

    const uniqueTitle = `E2E Public Attach ${Date.now()}`;
    const fileName = "e2e-orbit-public.txt";

    await signInWithPassword(page);
    await createOrbitCaseOnDetailPage(page, uniqueTitle);
    await setAttachmentPrivacy(page, "public");
    await uploadTextAttachment(page, fileName, "orbit case public e2e attachment");

    const attachmentLink = page.getByRole("link", { name: fileName });
    await expect(attachmentLink).toBeVisible({ timeout: 30_000 });
    await expect(attachmentLink).toHaveAttribute("target", "_blank");

    const href = await attachmentLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).not.toMatch(/\/api\/orbit-case\/attachments\//);
  });

  test("uploads private attachment via client blob upload", async ({ page }) => {
    const blobEnv = getE2eBlobEnvStatus();
    if (!blobEnv.readyForPrivateBlob) {
      test.skip(
        true,
        "XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN and XFORGE_STORE_ID required"
      );
    }

    const uniqueTitle = `E2E Private Attach ${Date.now()}`;
    const fileName = "e2e-orbit-private.txt";

    await signInWithPassword(page);
    await createOrbitCaseOnDetailPage(page, uniqueTitle);
    await setAttachmentPrivacy(page, "private");
    await uploadTextAttachment(page, fileName, "orbit case private e2e attachment");

    const attachmentLink = page.getByRole("link", { name: fileName });
    await expect(attachmentLink).toBeVisible({ timeout: 30_000 });
    await expect(attachmentLink).not.toHaveAttribute("target", "_blank");

    const href = await attachmentLink.getAttribute("href");
    expect(href).toMatch(/\/api\/orbit-case\/attachments\//);

    const attachmentArticle = page
      .getByRole("article")
      .filter({ has: page.getByRole("link", { name: fileName }) });

    await expect(
      attachmentArticle.getByText("Private", { exact: true })
    ).toBeVisible();
  });
});
