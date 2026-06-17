#!/usr/bin/env node

import { assertE2eSupabaseEnv, getE2eBlobEnvStatus, loadE2eEnv } from "./load-env.mjs";

loadE2eEnv();
const { loaded, status } = assertE2eSupabaseEnv();
const blobStatus = getE2eBlobEnvStatus();
const checkProject = process.env.E2E_CHECK_PROJECT ?? "report";

const browserAuthReady = status.readyForBrowserAuthTests;

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
  `  auth-flows / authenticated: ${browserAuthReady ? "ready" : "missing URL + anon/publishable key"}`
);
console.log(
  `  email integration (admin generate_link): ${status.readyForIntegrationTests ? "ready" : "missing URL + service role key"}`
);
console.log(
  `  orbit-case public blob upload: ${blobStatus.readyForUploadTests ? "ready" : "will SKIP in spec"}`
);
console.log(
  `  orbit-case private blob upload: ${blobStatus.readyForPrivateBlob ? "ready" : "will SKIP in spec"}`
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
  "auth-flows": browserAuthReady,
  authenticated: browserAuthReady,
  full:
    browserAuthReady &&
    status.readyForIntegrationTests &&
    blobStatus.readyForUploadTests &&
    blobStatus.readyForPrivateBlob,
};

const ready = projectReady[checkProject] ?? true;

if (!ready) {
  console.log("");
  console.log(
    `E2E_CHECK_PROJECT=${checkProject} requirements not met. Set E2E_CHECK_PROJECT=report for tiered output only.`
  );
  process.exitCode = 1;
}
