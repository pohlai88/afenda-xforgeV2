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
    name: "design-system",
    /** Large shared module graph — one worker, faster than per-file isolate. */
    isolate: false,
    ...reactSsrDepsOptimizer,
  },
  resolve: {
    alias: {
      ...serverOnlyAlias(),
      "@repo": path.resolve(import.meta.dirname, "../"),
    },
  },
});
