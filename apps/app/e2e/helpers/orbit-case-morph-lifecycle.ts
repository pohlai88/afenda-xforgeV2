import { expect, type Page } from "@playwright/test";
import {
  createCaseForMorphPush,
  pushCaseToDestination,
  openMorphTargetAndVerifyOrigin,
  type MorphPushDestinationCase,
} from "./orbit-case-push";

export const BUDGET_MORPH_DESTINATION: MorphPushDestinationCase = {
  destinationLabel: "Budget Request",
  urlPattern: /\/orbit-case\/budget\/[^/]+$/,
};

export async function openBudgetMorphFromCasePush(
  page: Page,
  uniqueTitle: string,
  amount = "12500"
): Promise<void> {
  await createCaseForMorphPush(page, uniqueTitle);
  await pushCaseToDestination(page, BUDGET_MORPH_DESTINATION.destinationLabel, {
    Amount: amount,
  });
  await openMorphTargetAndVerifyOrigin(
    page,
    BUDGET_MORPH_DESTINATION,
    uniqueTitle
  );
}

export async function expectMorphStatusLabel(
  page: Page,
  statusLabel: string
): Promise<void> {
  const detailPanel = page.locator("section").filter({
    has: page.getByLabel("Status"),
  });

  await expect(detailPanel.getByText(statusLabel, { exact: true })).toBeVisible({
    timeout: 15_000,
  });
}

export async function transitionMorphRequestStatus(
  page: Page,
  statusLabel: string
): Promise<void> {
  await page.getByLabel("Status").click();
  await page.getByRole("option", { name: statusLabel }).click();
  await expectMorphStatusLabel(page, statusLabel);
}
