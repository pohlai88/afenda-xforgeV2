import { expect, type Page, test } from "@playwright/test";
import { e2eEmail } from "./helpers/credentials";
import { getPlaywrightBaseUrl } from "./helpers/load-env";
import {
  buildConfirmUrl,
  createE2eEmail,
  createE2ePassword,
  createUnconfirmedUser,
  deleteUserByEmail,
  generateAuthLink,
  hasSupabaseAdminEnv,
  isEmailConfirmed,
} from "./helpers/supabase-admin";

const baseURL = getPlaywrightBaseUrl();

const ACCOUNT_EXISTS_COPY_PATTERN = /If an account exists for that address/i;
const APP_ROOT_URL_PATTERN = /\/($|\?)/;
const CHECK_EMAIL_SIGN_IN_COPY_PATTERN = /Check your email for a sign-in link/i;
const EMAIL_NOT_CONFIRMED_COPY_PATTERN = /email not confirmed/i;
const PASSWORD_REQUIREMENT_COPY_PATTERN = /At least \d+ characters/i;
const SIGN_IN_PATH_PATTERN = /\/sign-in/;
const SIGN_UP_SUCCESS_URL_PATTERN = /\/sign-up-success$/;
const SIGN_UP_URL_PATTERN = /\/sign-up$/;
const UPDATE_PASSWORD_URL_PATTERN = /\/update-password$/;
const VERIFICATION_LINK_COPY_PATTERN =
  /verification link to confirm your email/i;

const fillSignUpPassword = async (page: Page, value: string) => {
  await page.locator("#sign-up-password").fill(value);
};

test.describe("Email authentication UI @auth", () => {
  test("sign-up shows email confirmation copy and password requirements", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    await expect(page.getByText(VERIFICATION_LINK_COPY_PATTERN)).toBeVisible();
    await expect(page.getByLabel("Password requirements")).toBeVisible();
    await expect(
      page.getByText(PASSWORD_REQUIREMENT_COPY_PATTERN)
    ).toBeVisible();
  });

  test("validates password policy before calling Supabase", async ({
    page,
  }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Policy Test");
    await page.getByLabel("Email").fill("policy-test@xforge.local");
    await fillSignUpPassword(page, "short");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.locator("#sign-up-error")).toContainText(
      PASSWORD_REQUIREMENT_COPY_PATTERN
    );
    await expect(page).toHaveURL(SIGN_UP_URL_PATTERN);
  });

  test("sign-in exposes magic link mode for email auth", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: "Use email link instead" }).click();

    await expect(
      page.getByRole("button", { name: "Send sign-in link" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Use password instead" })
    ).toBeVisible();
  });

  test("magic link request shows check-your-email confirmation", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: "Use email link instead" }).click();
    await page.getByLabel("Email").fill(e2eEmail);
    await page.getByRole("button", { name: "Send sign-in link" }).click();

    await expect(
      page.getByText(CHECK_EMAIL_SIGN_IN_COPY_PATTERN)
    ).toBeVisible();
  });

  test("forgot-password success state renders", async ({ page }) => {
    const email = createE2eEmail("forgot-ui");

    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Send reset link" }).click();

    await expect(page.getByRole("status")).toContainText("Check your email");
  });

  test("sign-up-success exposes resend confirmation", async ({ page }) => {
    await page.goto("/sign-up-success");

    await expect(
      page.getByRole("heading", { name: "Check your email" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Resend confirmation email" })
    ).toBeVisible();
  });
});

test.describe("Email authentication (Supabase integration) @auth", () => {
  // biome-ignore lint/suspicious/noSkippedTests: Supabase admin credentials are optional for local E2E runs.
  test.skip(
    !hasSupabaseAdminEnv(),
    "Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local / .env.secret (run pnpm test:e2e:env)"
  );

  test.describe.configure({ mode: "serial" });

  test("sign-up completes UI flow and reaches check-your-email page", async ({
    page,
  }) => {
    const email = createE2eEmail("e2e-signup-ui");
    const password = createE2ePassword();

    try {
      await page.goto("/sign-up");
      await page.getByLabel("Name").fill("Signup UI E2E");
      await page.getByLabel("Email").fill(email);
      await fillSignUpPassword(page, password);
      await page.getByRole("button", { name: "Create account" }).click();

      await expect(page).toHaveURL(SIGN_UP_SUCCESS_URL_PATTERN);
      await expect(
        page.getByRole("heading", { name: "Check your email" })
      ).toBeVisible();
      await expect(page.getByLabel("Email")).toHaveValue(email);
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test("blocks password sign-in until email is confirmed", async ({ page }) => {
    const email = createE2eEmail("e2e-unconfirmed");
    const password = createE2ePassword();

    try {
      await createUnconfirmedUser(email, password);

      await page.goto("/sign-in");
      await page.getByLabel("Email").fill(email);
      await page.locator("#sign-in-password").fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(
        page.getByText(EMAIL_NOT_CONFIRMED_COPY_PATTERN)
      ).toBeVisible();
      await expect(page).toHaveURL(SIGN_IN_PATH_PATTERN);
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test("confirms signup via auth link and establishes a session", async ({
    page,
  }) => {
    const email = createE2eEmail("e2e-confirm");
    const password = createE2ePassword();

    try {
      await createUnconfirmedUser(email, password);
      const link = await generateAuthLink("signup", email, { password });
      const confirmUrl = buildConfirmUrl(baseURL, link, "/");

      await page.goto(confirmUrl, { waitUntil: "networkidle" });

      await expect
        .poll(async () => isEmailConfirmed(email), { timeout: 15_000 })
        .toBe(true);

      await page.goto("/sign-in");
      await page.getByLabel("Email").fill(email);
      await page.locator("#sign-in-password").fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page).toHaveURL(APP_ROOT_URL_PATTERN, { timeout: 30_000 });
    } finally {
      await deleteUserByEmail(email);
    }
  });

  test("magic link sign-in completes through auth confirm route", async ({
    page,
  }) => {
    const link = await generateAuthLink("magiclink", e2eEmail);
    const confirmUrl = buildConfirmUrl(baseURL, link, "/");

    await page.goto(confirmUrl, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(APP_ROOT_URL_PATTERN, { timeout: 20_000 });
  });

  test("recovery link opens update-password after confirmation", async ({
    page,
  }) => {
    const link = await generateAuthLink("recovery", e2eEmail, {
      redirectTo: `${baseURL}/auth/confirm?next=${encodeURIComponent("/update-password")}`,
    });
    const confirmUrl = buildConfirmUrl(baseURL, link, "/update-password");

    await page.goto(confirmUrl);

    await expect(page).toHaveURL(UPDATE_PASSWORD_URL_PATTERN);
    await expect(
      page.getByRole("heading", { name: "Update password" })
    ).toBeVisible();
  });

  test("resend confirmation succeeds for an unconfirmed signup", async ({
    page,
  }) => {
    const email = createE2eEmail("e2e-resend");
    const password = createE2ePassword();

    try {
      await createUnconfirmedUser(email, password);

      await page.goto("/sign-up-success");
      await page.getByLabel("Email").fill(email);
      await page
        .getByRole("button", { name: "Resend confirmation email" })
        .click();

      await expect(page.getByText("Email sent")).toBeVisible();
      await expect(page.getByText(ACCOUNT_EXISTS_COPY_PATTERN)).toBeVisible();
    } finally {
      await deleteUserByEmail(email);
    }
  });
});
