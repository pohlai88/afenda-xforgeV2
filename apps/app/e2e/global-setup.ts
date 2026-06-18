import { e2eEmail, e2ePassword } from "./helpers/credentials";
import { loadE2eEnv, requireE2eGlobalSetupEnv } from "./helpers/load-env";
import { ensureE2eAuthUser, hasSupabaseAdminEnv } from "./helpers/supabase-admin";

const globalSetup = async (): Promise<void> => {
  loadE2eEnv();
  requireE2eGlobalSetupEnv();

  if (!hasSupabaseAdminEnv()) {
    throw new Error("E2E global setup requires Supabase admin credentials.");
  }

  await ensureE2eAuthUser({
    email: e2eEmail,
    password: e2ePassword,
    displayName: "E2E Playwright",
  });

  console.log("E2E auth user ready:", e2eEmail);
};

export default globalSetup;
