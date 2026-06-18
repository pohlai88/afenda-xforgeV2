import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Page from "../app/(unauthenticated)/sign-in/[[...sign-in]]/page";

const forbiddenReactWarnings = ["async Client Component", "act scope"] as const;
const consoleErrors: string[] = [];

vi.mock("../app/(unauthenticated)/_components/auth-forms", () => ({
  SignInForm: ({ initialError }: { readonly initialError?: string | null }) => (
    <form aria-label="Sign in form">
      {initialError ? <p role="alert">{initialError}</p> : null}
    </form>
  ),
}));

describe("Sign In Page", () => {
  beforeEach(() => {
    consoleErrors.length = 0;
    vi.spyOn(console, "error").mockImplementation((...args) => {
      consoleErrors.push(args.map(String).join(" "));
    });
  });

  afterEach(() => {
    const forbiddenErrors = consoleErrors.filter((message) =>
      forbiddenReactWarnings.some((warning) => message.includes(warning))
    );

    vi.restoreAllMocks();
    expect(forbiddenErrors).toEqual([]);
  });

  test("renders the page shell", async () => {
    render(await Page({ searchParams: Promise.resolve({}) }));

    expect(
      await screen.findByRole("heading", { name: "Welcome back" })
    ).toBeTruthy();
    expect(
      screen.getByText("Sign in to your governed workspace.")
    ).toBeTruthy();
    expect(screen.getByRole("form", { name: "Sign in form" })).toBeDefined();
  });

  test("passes sanitized query errors to the sign-in form", async () => {
    render(
      await Page({
        searchParams: Promise.resolve({
          error: encodeURIComponent("Email not confirmed"),
        }),
      })
    );

    expect((await screen.findByRole("alert")).textContent).toBe(
      "Confirm your email before signing in. Check your inbox or request a new link from sign-up."
    );
  });
});
