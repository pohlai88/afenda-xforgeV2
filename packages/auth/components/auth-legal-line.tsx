"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import Link from "next/link";
import { useAuthUiConfig } from "../context/auth-ui-config";

export const AuthLegalLine = () => {
  const { termsUrl, privacyUrl } = useAuthUiConfig();

  if (!termsUrl && !privacyUrl) {
    return null;
  }

  return (
    <p className={cn("text-center", recipe("captionText"))}>
      By continuing, you agree to our{" "}
      {termsUrl ? (
        <Link
          className="underline underline-offset-4"
          href={termsUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Terms
        </Link>
      ) : (
        "Terms"
      )}
      {termsUrl && privacyUrl ? " and " : null}
      {privacyUrl ? (
        <Link
          className="underline underline-offset-4"
          href={privacyUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Privacy Policy
        </Link>
      ) : null}
      .
    </p>
  );
};
