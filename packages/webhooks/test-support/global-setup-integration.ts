import {
  hasIntegrationDatabase,
  loadIntegrationEnv,
} from "../../../test-support/load-integration-env.ts";

export default async function globalSetup(): Promise<void> {
  loadIntegrationEnv();

  if (!hasIntegrationDatabase()) {
    return;
  }

  const { ensureWebhookOutboxSchema } = await import(
    "./ensure-webhook-schema.ts"
  );
  await ensureWebhookOutboxSchema();
}
