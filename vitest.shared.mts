import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

const ciReporters = process.env.CI
  ? (["default", "github-actions"] as const)
  : (["default"] as const);

const ciBail = process.env.CI ? 1 : 0;

/** Paths to repo-level test-support (single source for stubs and env bootstrap). */
export const testSupportPaths = {
  repoRoot,
  unitSetup: path.resolve(repoRoot, "test-support/setup-unit-env.ts"),
  integrationSetup: path.resolve(repoRoot, "test-support/setup-integration-env.ts"),
  serverOnlyStub: path.resolve(repoRoot, "test-support/server-only-stub.ts"),
} as const;

/**
 * Fast unit-test defaults — no DB, no dotenv, no cross-package integration.
 * Turbo `test` task runs these only; integration uses `sharedIntegrationTestOptions`.
 */
export const sharedUnitTestOptions = {
  include: ["test/**/*.test.{ts,tsx}"],
  exclude: [
    "test/integration/**",
    "test/**/*.integration.test.ts",
    "**/node_modules/**",
  ],
  environment: "node" as const,
  setupFiles: [testSupportPaths.unitSetup],
  watch: false,
  restoreMocks: true,
  clearMocks: true,
  mockReset: false,
  reporters: ciReporters,
  bail: ciBail,
  pool: "threads" as const,
  fileParallelism: true,
  isolate: true,
  passWithNoTests: true,
  testTimeout: 10_000,
  hookTimeout: 10_000,
};

/**
 * DB / network integration lane — serialized, isolated workers, longer timeouts.
 * Never mixed into unit runs; Turbo `test:integration` only (`dependsOn: []`).
 */
export const sharedIntegrationTestOptions = {
  include: [
    "test/integration/**/*.integration.test.ts",
    "test/**/*.integration.test.ts",
  ],
  exclude: ["**/node_modules/**"],
  environment: "node" as const,
  setupFiles: [testSupportPaths.integrationSetup],
  watch: false,
  restoreMocks: true,
  clearMocks: true,
  reporters: ciReporters,
  bail: ciBail,
  pool: "forks" as const,
  fileParallelism: false,
  maxWorkers: 1,
  isolate: true,
  testTimeout: 60_000,
  hookTimeout: 30_000,
};

/** Resolve alias map every package should use for server-only in unit tests. */
export const serverOnlyAlias = () => ({
  "server-only": testSupportPaths.serverOnlyStub,
});

/** SSR dependency pre-bundling for React packages — cuts transform latency. */
export const reactSsrDepsOptimizer = {
  deps: {
    optimizer: {
      ssr: {
        enabled: true,
      },
    },
  },
} as const;
