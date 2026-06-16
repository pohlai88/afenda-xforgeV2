import { expect, test } from "@playwright/test";

const e2eEmail =
  process.env.E2E_AUTH_EMAIL ??
  process.env.E2E_ORG_ADMIN_EMAIL ??
  "e2e-playwright@xforge.local";
const e2ePassword =
  process.env.E2E_AUTH_PASSWORD ??
  process.env.E2E_ORG_ADMIN_PASSWORD ??
  "123qweasdzxc!@#";

const ACCOUNT_ORGANIZATION_URL_PATTERN = /\/account\/organization$/;
const SIGN_IN_URL_PATTERN = /\/sign-in$/;

const signIn = async (page: import("@playwright/test").Page) => {
  await page.goto("/sign-in");

  const passwordField = page.locator("#sign-in-password");

  try {
    await passwordField.waitFor({ state: "visible", timeout: 3000 });
  } catch {
    await page.getByRole("button", { name: "Use password instead" }).click();
    await passwordField.waitFor({ state: "visible" });
  }

  await page.getByLabel("Email").fill(e2eEmail);
  await passwordField.fill(e2ePassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).not.toHaveURL(SIGN_IN_URL_PATTERN, { timeout: 15_000 });
};

test.describe("Auth E2E completion smoke", () => {
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
    await signIn(page);

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
    await signIn(page);

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
