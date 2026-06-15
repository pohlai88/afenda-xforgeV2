import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.integration.test.ts"],
    setupFiles: ["test-support/setup-integration-env.ts"],
    alias: {
      "server-only": path.resolve(
        import.meta.dirname,
        "./test-support/server-only-stub.ts"
      ),
    },
  },
});
