import { e2eEmail } from "./credentials";
import {
  assertE2eSupabaseEnv,
  type E2eCheckProject,
  getE2eBlobEnvStatus,
  isE2eProjectReady,
  loadE2eEnv,
} from "./load-env";
import {
  canVerifyE2eSupabaseUser,
  verifyE2eSupabaseUser,
} from "./verify-e2e-supabase";

const requiresLiveE2eUser = (project: E2eCheckProject): boolean =>
  project === "authenticated" ||
  project === "orbit-case" ||
  project === "orbit-case-blob" ||
  project === "full";

const main = async (): Promise<void> => {
  loadE2eEnv();
  const { loaded, status } = assertE2eSupabaseEnv();
  const blobStatus = getE2eBlobEnvStatus();
  const checkProject = (process.env.E2E_CHECK_PROJECT ??
    "report") as E2eCheckProject;

  console.log("Playwright E2E env");
  console.log("");
  console.log("Loaded files (first wins per key):");
  for (const file of loaded) {
    console.log(`  - ${file}`);
  }
  if (loaded.length === 0) {
    console.log("  (none — check .env.config, .env.secret, .env.local)");
  }
  console.log("");
  console.log("Supabase keys present:");
  console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${status.url ? "yes" : "no"}`);
  console.log(
    `  anon/publishable key: ${status.anonOrPublishableKey ? "yes" : "no"}`
  );
  console.log(
    `  SUPABASE_SERVICE_ROLE_KEY: ${status.serviceRoleKey ? "yes" : "no"}`
  );
  console.log("");
  console.log("Readiness tiers:");
  console.log(
    `  auth-flows: ${isE2eProjectReady("auth-flows", status, blobStatus) ? "ready" : "missing URL + anon/publishable key"}`
  );
  console.log(
    `  authenticated / orbit-case: ${isE2eProjectReady("orbit-case", status, blobStatus) ? "ready" : "missing URL + anon/publishable + service role keys"}`
  );
  console.log(
    `  orbit-case-blob: ${isE2eProjectReady("orbit-case-blob", status, blobStatus) ? "ready" : "needs orbit-case tier + public and private blob keys"}`
  );
  console.log(
    `  email integration (admin generate_link): ${status.readyForIntegrationTests ? "ready" : "missing URL + service role key"}`
  );
  console.log("");
  console.log("Vercel Blob keys present:");
  console.log(
    `  XFORGE_PUB_BLOB_READ_WRITE_TOKEN: ${blobStatus.publicBlobToken ? "yes" : "no"}`
  );
  console.log(
    `  XFORGE_PUB_STORE_ID: ${blobStatus.publicStoreId ? "yes" : "no"}`
  );
  console.log(
    `  XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN: ${blobStatus.privateBlobToken ? "yes" : "no"}`
  );
  console.log(`  XFORGE_STORE_ID: ${blobStatus.privateStoreId ? "yes" : "no"}`);

  let liveUserReady = true;

  if (canVerifyE2eSupabaseUser()) {
    console.log("");
    console.log(`Live Supabase E2E user (${e2eEmail}):`);
    try {
      const { health, ready } = await verifyE2eSupabaseUser();
      console.log(`  exists: ${health.exists ? "yes" : "no"}`);
      console.log(`  email confirmed: ${health.emailConfirmed ? "yes" : "no"}`);
      console.log(
        `  organization membership: ${health.organizationId ? "yes" : "no"}`
      );
      console.log(
        `  activeOrganizationId metadata: ${health.activeOrganizationId ? "yes" : "no"}`
      );
      console.log(`  ready for authenticated E2E: ${ready ? "yes" : "no"}`);
      liveUserReady = ready;
    } catch (error) {
      liveUserReady = false;
      console.log(
        `  probe failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  if (!isE2eProjectReady(checkProject, status, blobStatus)) {
    console.log("");
    console.log(
      `E2E_CHECK_PROJECT=${checkProject} requirements not met. Set E2E_CHECK_PROJECT=report for tiered output only.`
    );
    process.exitCode = 1;
    return;
  }

  if (
    requiresLiveE2eUser(checkProject) &&
    canVerifyE2eSupabaseUser() &&
    !liveUserReady
  ) {
    console.log("");
    console.log(
      `E2E_CHECK_PROJECT=${checkProject} requires a provisioned E2E user. Run global setup via pnpm test:e2e:orbit-case or pnpm test:e2e (not PLAYWRIGHT_SKIP_GLOBAL_SETUP=1).`
    );
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
