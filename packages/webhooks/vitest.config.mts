import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "vitest/config";

loadEnv({ path: path.resolve(import.meta.dirname, "../../.env") });
loadEnv({
  path: path.resolve(import.meta.dirname, "../../.env.local"),
  override: true,
});
loadEnv({
  path: path.resolve(import.meta.dirname, "../database/.env"),
  override: true,
});

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    exclude: ["test/**/*.integration.test.ts", "**/node_modules/**"],
    alias: {
      "server-only": path.resolve(
        import.meta.dirname,
        "./test-support/server-only-stub.ts"
      ),
    },
  },
});
