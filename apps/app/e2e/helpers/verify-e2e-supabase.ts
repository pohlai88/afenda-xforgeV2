import { e2eEmail } from "./credentials";
import {
  getE2eUserHealth,
  hasSupabaseAdminEnv,
  isE2eUserReadyForAuthenticatedTests,
} from "./supabase-admin";

export interface E2eSupabaseVerification {
  health: Awaited<ReturnType<typeof getE2eUserHealth>>;
  ready: boolean;
}

export const verifyE2eSupabaseUser = async (): Promise<E2eSupabaseVerification> => {
  const health = await getE2eUserHealth(e2eEmail);
  return {
    health,
    ready: isE2eUserReadyForAuthenticatedTests(health),
  };
};

export const canVerifyE2eSupabaseUser = (): boolean => hasSupabaseAdminEnv();
