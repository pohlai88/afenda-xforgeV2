import {
  hasIntegrationDatabase,
  loadIntegrationEnv,
} from "../../../test-support/load-integration-env.ts";

export default async function globalSetup(): Promise<void> {
  loadIntegrationEnv();

  if (!hasIntegrationDatabase()) {
    return;
  }

  const { ensureCmsMirrorSchema } = await import("../sync/ensure-schema.ts");
  await ensureCmsMirrorSchema();
}
