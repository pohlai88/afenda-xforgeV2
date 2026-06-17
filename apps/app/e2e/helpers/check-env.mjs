#!/usr/bin/env node

import { assertE2eSupabaseEnv, getE2eBlobEnvStatus, loadE2eEnv } from "./load-env.mjs";

loadE2eEnv();
const { loaded, status } = assertE2eSupabaseEnv();
const blobStatus = getE2eBlobEnvStatus();
const checkProject = process.env.E2E_CHECK_PROJECT ?? "report";

const tiers = {
  authFlows: status.readyForBrowserAuthTests,
  authenticated: status.readyForBrowserAuthTests,
  emailIntegration: status.readyForIntegrationTests,
  publicBlob: blobStatus.readyForUploadTests,
  privateBlob: blobStatus.readyForPrivateBlob,
};

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
  `  auth-flows (sign-in UI): ${tiers.authFlows ? "ready" : "missing URL + anon/publishable key"}`
);
console.log(
  `  authenticated (storageState + orbit-case): ${tiers.authenticated ? "ready" : "missing URL + anon/publishable key"}`
);
console.log(
  `  email integration (admin generate_link): ${tiers.emailIntegration ? "ready" : "missing URL + service role key"}`
);
console.log(
  `  orbit-case public blob upload: ${tiers.publicBlob ? "ready" : "will SKIP in spec"}`
);
console.log(
  `  orbit-case private blob upload: ${tiers.privateBlob ? "ready" : "will SKIP in spec"}`
);
console.log("");
console.log("Vercel Blob keys present:");
console.log(
  `  XFORGE_PUB_BLOB_READ_WRITE_TOKEN: ${blobStatus.publicBlobToken ? "yes" : "no"}`
);
console.log(`  XFORGE_PUB_STORE_ID: ${blobStatus.publicStoreId ? "yes" : "no"}`);
console.log(
  `  XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN: ${blobStatus.privateBlobToken ? "yes" : "no"}`
);
console.log(`  XFORGE_STORE_ID: ${blobStatus.privateStoreId ? "yes" : "no"}`);

const projectReady = {
  report: true,
  "auth-flows": tiers.authFlows,
  authenticated: tiers.authenticated,
  full:
    tiers.authFlows &&
    tiers.emailIntegration &&
    tiers.publicBlob &&
    tiers.privateBlob,
};

const ready = projectReady[checkProject] ?? true;

if (!ready) {
  console.log("");
  console.log(
    `E2E_CHECK_PROJECT=${checkProject} requirements not met. Set E2E_CHECK_PROJECT=report for tiered output only.`
  );
  process.exitCode = 1;
}
