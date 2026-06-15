import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

export const hasIntegrationDatabase = (): boolean =>
  Boolean(process.env.DATABASE_URL ?? process.env.DIRECT_URL);

/** Load repo + database env for integration tests (safe to call from globalSetup and setupFiles). */
export const loadIntegrationEnv = (): void => {
  process.env.NODE_ENV = "test";
  process.env.SKIP_ENV_VALIDATION = "true";

  const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
  );

  config({ path: path.resolve(repoRoot, ".env") });
  config({ path: path.resolve(repoRoot, ".env.local"), override: true });
  config({
    path: path.resolve(repoRoot, "packages/database/.env"),
    override: true,
  });
};

export const teardownIntegrationPool = async (): Promise<void> => {
  type GlobalPool = typeof globalThis & {
    pool?: { end: () => Promise<void> };
  };

  const globalWithPool = globalThis as GlobalPool;

  if (globalWithPool.pool) {
    await globalWithPool.pool.end();
    globalWithPool.pool = undefined;
  }
};
