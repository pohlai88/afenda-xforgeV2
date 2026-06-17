import { expect, type Page } from "@playwright/test";
import { test } from "./helpers/fixtures";
import { getE2eBlobEnvStatus } from "./helpers/load-env";
import { createOrbitCaseOnDetailPage } from "./helpers/orbit-case";

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

test.describe("Orbit Case blob uploads @orbit-case @blob", () => {
  test.setTimeout(60_000);

  test.beforeEach(() => {
    const blobEnv = getE2eBlobEnvStatus();
    if (!(blobEnv.readyForUploadTests || blobEnv.readyForPrivateBlob)) {
      // biome-ignore lint/suspicious/noSkippedTests: Blob e2e tests require optional external blob credentials.
      test.skip(
        true,
        "Blob env missing — run pnpm test:e2e:env with E2E_CHECK_PROJECT=orbit-case-blob"
      );
    }
  });

  test("uploads public attachment via client blob upload", async ({
    page,
    uniqueTitle,
  }) => {
    const blobEnv = getE2eBlobEnvStatus();
    if (!blobEnv.readyForUploadTests) {
      // biome-ignore lint/suspicious/noSkippedTests: Public blob upload requires optional external blob credentials.
      test.skip(
        true,
        "XFORGE_PUB_BLOB_READ_WRITE_TOKEN and XFORGE_PUB_STORE_ID required"
      );
    }

    const fileName = "e2e-orbit-public.txt";

    await createOrbitCaseOnDetailPage(page, uniqueTitle);
    await setAttachmentPrivacy(page, "public");
    await uploadTextAttachment(
      page,
      fileName,
      "orbit case public e2e attachment"
    );

    const attachmentLink = page.getByRole("link", { name: fileName });
    await expect(attachmentLink).toBeVisible({ timeout: 30_000 });
    await expect(attachmentLink).toHaveAttribute("target", "_blank");

    const href = await attachmentLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).not.toMatch(/\/api\/orbit-case\/attachments\//);
  });

  test("uploads private attachment via client blob upload", async ({
    page,
    uniqueTitle,
  }) => {
    const blobEnv = getE2eBlobEnvStatus();
    if (!blobEnv.readyForPrivateBlob) {
      // biome-ignore lint/suspicious/noSkippedTests: Private blob upload requires optional external blob credentials.
      test.skip(
        true,
        "XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN and XFORGE_STORE_ID required"
      );
    }

    const fileName = "e2e-orbit-private.txt";

    await createOrbitCaseOnDetailPage(page, uniqueTitle);
    await setAttachmentPrivacy(page, "private");
    await uploadTextAttachment(
      page,
      fileName,
      "orbit case private e2e attachment"
    );

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
