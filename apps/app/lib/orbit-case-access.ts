import { keys as orbitCaseKeys } from "@repo/orbit-case/keys";
import { orbitCaseEnabled } from "@repo/feature-flags";

/**
 * Resolves whether Orbit Case routes and nav are visible.
 * `ORBIT_CASE_ENABLED` env overrides PostHog when set explicitly.
 */
export const resolveOrbitCaseEnabled = async (): Promise<boolean> => {
  const envOverride = orbitCaseKeys().ORBIT_CASE_ENABLED;

  if (envOverride === "false") {
    return false;
  }

  if (envOverride === "true") {
    return true;
  }

  return orbitCaseEnabled();
};
