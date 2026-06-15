"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import Link from "next/link";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { authLinkClass } from "./auth-section";

export const AuthLegalLine = () => {
  const { termsUrl, privacyUrl } = useAuthUiConfig();

  if (!(termsUrl || privacyUrl)) {
    return null;
  }

  return (
    <p className={cn("text-center", recipe("captionText"))}>
      By continuing, you agree to our{" "}
      {termsUrl ? (
        <Link
          className={authLinkClass}
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
          className={authLinkClass}
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
