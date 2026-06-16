"use client";

import { Button, cn, recipe } from "@repo/design-system/design-system";
import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";

interface AuthErrorProperties {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly unstable_retry?: () => void;
}

const AuthError = ({ error, reset, unstable_retry }: AuthErrorProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className={cn("flex flex-col", recipe("sectionGap"))}>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-semibold text-lg text-text-primary tracking-tight">
          Something went wrong
        </h2>
        <p className={recipe("captionText")}>
          We could not load this sign-in screen. Try again or return to sign in.
        </p>
      </div>
      <Button className="w-full" onClick={() => retry()} type="button">
        Try again
      </Button>
    </div>
  );
};

export default AuthError;
