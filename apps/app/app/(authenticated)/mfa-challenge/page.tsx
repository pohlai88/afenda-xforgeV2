import { MfaLoginChallenge } from "@repo/auth/components/mfa-login-challenge";
import { resolveSafeRedirect } from "@repo/auth/confirm-link";
import { resolveServerMfaRedirect } from "@repo/auth/mfa-login.server";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const title = "Verify your identity";
const description =
  "Complete multi-factor authentication to access your workspace.";

export const metadata: Metadata = createMetadata({ title, description });

type MfaChallengePageProperties = {
  readonly searchParams: Promise<{
    next?: string | string[];
  }>;
};

const MfaChallengePage = async ({ searchParams }: MfaChallengePageProperties) => {
  const { next } = await searchParams;
  const nextParam = Array.isArray(next) ? next[0] : next;
  const nextHref = resolveSafeRedirect(nextParam ?? null);
  const mfaRedirect = await resolveServerMfaRedirect(nextHref);

  if (!mfaRedirect) {
    redirect(nextHref);
  }

  return <MfaLoginChallenge nextHref={nextHref} />;
};

export default MfaChallengePage;
