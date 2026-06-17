import { expect, test } from "@playwright/test";
import { signInWithPassword } from "./helpers/sign-in";

const ACCOUNT_ORGANIZATION_URL_PATTERN = /\/account\/organization$/;

test.describe("Auth E2E completion smoke @auth", () => {
  test("hides optional providers while remote settings keep them off", async ({
    page,
  }) => {
    await page.goto("/sign-in");

    await expect(
      page.getByRole("button", { name: "Continue as guest" })
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Continue with SSO" })
    ).toHaveCount(0);
    await expect(page.getByLabel("Phone number")).toHaveCount(0);
  });

  test("redirects /mfa-challenge when step-up is already satisfied", async ({
    page,
  }) => {
    await signInWithPassword(page);

    if (page.url().includes("/mfa-challenge")) {
      // biome-ignore lint/suspicious/noSkippedTests: MFA step-up requires manual OTP in this E2E account.
      test.skip(true, "E2E user requires MFA step-up - run OTP manually.");
    }

    await page.goto("/mfa-challenge?next=/account/organization");
    await expect(page).toHaveURL(ACCOUNT_ORGANIZATION_URL_PATTERN);
    await expect(
      page.getByRole("heading", { name: "Organization" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Toggle Sidebar" })
    ).toHaveCount(0);
  });

  test("loads organization and security account surfaces", async ({ page }) => {
    await signInWithPassword(page);

    if (page.url().includes("/mfa-challenge")) {
      // biome-ignore lint/suspicious/noSkippedTests: MFA step-up requires manual OTP in this E2E account.
      test.skip(true, "E2E user requires MFA step-up - run OTP manually.");
    }

    await page.goto("/account/organization");
    await expect(
      page.getByRole("heading", { name: "Organization" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create workspace" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Invite member" })
    ).toBeVisible();

    await page.goto("/account/security");
    await expect(
      page.getByRole("heading", { name: "Account security" })
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Email address" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Request email change" })
    ).toBeVisible();
  });
});
