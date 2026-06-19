import { expect, type Page } from "@playwright/test";

export const createOrbitCaseOnDetailPage = async (
  page: Page,
  uniqueTitle: string
): Promise<void> => {
  await page.goto("/orbit-case");
  const titleInput = page.getByLabel("Orbit Case title");
  const createButton = page.getByRole("button", { name: "Create case" });

  await expect(titleInput).toBeVisible({ timeout: 30_000 });
  for (let attempt = 0; attempt < 60; attempt += 1) {
    await titleInput.fill("");
    await titleInput.fill(uniqueTitle);

    if (await createButton.isEnabled()) {
      break;
    }

    if (attempt === 59) {
      await expect(createButton).toBeEnabled();
    }

    await page.waitForTimeout(1000);
  }

  await createButton.click();
  await expect(page).toHaveURL(/\/orbit-case\/[^/]+$/, { timeout: 30_000 });
};
