#!/usr/bin/env node

import { assertE2eSupabaseEnv, getE2eBlobEnvStatus, loadE2eEnv } from "./load-env.mjs";

loadE2eEnv();
const { loaded, status } = assertE2eSupabaseEnv();
const blobStatus = getE2eBlobEnvStatus();

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
console.log(
  status.readyForIntegrationTests
    ? "Integration tests (admin generate_link): will run"
    : "Integration tests: will SKIP — need URL + service role key"
);
console.log(
  status.readyForBrowserAuthTests
    ? "Browser auth tests (sign-in UI): will run"
    : "Browser auth tests: need URL + anon/publishable key"
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
console.log(
  blobStatus.readyForUploadTests
    ? "Orbit Case upload E2E: will run"
    : "Orbit Case upload E2E: will SKIP — need token + public store id (pnpm env:sync)"
);
console.log(
  blobStatus.readyForPrivateBlob
    ? "Private blob probes: ready (pnpm blob:probe:private)"
    : "Private blob probes: need token + XFORGE_STORE_ID"
);

if (!status.readyForIntegrationTests) {
  process.exitCode = 1;
}
