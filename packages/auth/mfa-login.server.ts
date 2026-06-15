import "server-only";

import { buildMfaChallengeHref, getMfaAssuranceStatus } from "./mfa-login";
import { createClient } from "./server";

export const getServerMfaAssuranceStatus = async () => {
  const supabase = await createClient();
  return getMfaAssuranceStatus(supabase);
};

export const resolveServerMfaRedirect = async (
  intendedPath: string
): Promise<string | null> => {
  const status = await getServerMfaAssuranceStatus();

  if (!status.needsChallenge) {
    return null;
  }

  return buildMfaChallengeHref(intendedPath);
};
