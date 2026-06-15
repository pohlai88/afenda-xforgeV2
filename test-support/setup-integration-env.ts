import {
  loadIntegrationEnv,
  teardownIntegrationPool,
} from "./load-integration-env.ts";

loadIntegrationEnv();
await teardownIntegrationPool();
