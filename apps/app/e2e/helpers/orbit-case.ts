import { expect, type Page } from "@playwright/test";

export const createOrbitCaseOnDetailPage = async (
  page: Page,
  uniqueTitle: string
): Promise<void> => {
  await page.goto("/orbit-case");
  await page.getByLabel("Orbit Case title").fill(uniqueTitle);
  await expect(page.getByRole("button", { name: "Create case" })).toBeEnabled();
  await page.getByRole("button", { name: "Create case" }).click();
  await expect(page).toHaveURL(/\/orbit-case\/[^/]+$/, { timeout: 30_000 });
};
