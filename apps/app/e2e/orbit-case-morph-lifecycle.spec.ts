import { expect } from "@playwright/test";
import { test } from "./helpers/fixtures";
import {
  expectMorphStatusLabel,
  openBudgetMorphFromCasePush,
  transitionMorphRequestStatus,
} from "./helpers/orbit-case-morph-lifecycle";

test.describe("Orbit Case morph lifecycle @orbit-case", () => {
  test.setTimeout(90_000);

  test("updates budget request status after push and persists on reload", async ({
    page,
    uniqueTitle,
  }) => {
    await test.step("Push case to budget request", async () => {
      await openBudgetMorphFromCasePush(page, uniqueTitle);
    });

    await test.step("Verify default submitted status", async () => {
      await expectMorphStatusLabel(page, "Submitted");
    });

    await test.step("Verify pilot amount field persisted", async () => {
      await expect(page.getByText("12500")).toBeVisible({ timeout: 15_000 });
    });

    await test.step("Transition to in review", async () => {
      await transitionMorphRequestStatus(page, "In review");
    });

    await test.step("Persist status after reload", async () => {
      await page.reload();
      await expectMorphStatusLabel(page, "In review");
    });
  });
});
