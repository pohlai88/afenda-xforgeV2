#!/usr/bin/env node

import { assertE2eSupabaseEnv } from "./load-env.mjs";

const { loaded, status } = assertE2eSupabaseEnv();

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

if (!status.readyForIntegrationTests) {
  process.exitCode = 1;
}
