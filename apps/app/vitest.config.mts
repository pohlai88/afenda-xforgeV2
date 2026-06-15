import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineProject } from "vitest/config";
import {
  reactSsrDepsOptimizer,
  serverOnlyAlias,
  sharedUnitTestOptions,
} from "../../vitest.shared.mts";

export default defineProject({
  plugins: [react()],
  test: {
    ...sharedUnitTestOptions,
    name: "app",
    environment: "happy-dom",
    ...reactSsrDepsOptimizer,
  },
  resolve: {
    alias: {
      ...serverOnlyAlias(),
      "@": path.resolve(import.meta.dirname, "./"),
      "@repo": path.resolve(import.meta.dirname, "../../packages"),
    },
  },
});
