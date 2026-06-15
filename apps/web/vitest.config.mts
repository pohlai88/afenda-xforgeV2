import path from "node:path";
import { defineProject } from "vitest/config";
import {
  serverOnlyAlias,
  sharedUnitTestOptions,
} from "../../vitest.shared.mts";

export default defineProject({
  test: {
    ...sharedUnitTestOptions,
    name: "web",
  },
  resolve: {
    alias: {
      ...serverOnlyAlias(),
      "@": path.resolve(import.meta.dirname, "./"),
      "@repo": path.resolve(import.meta.dirname, "../../packages"),
    },
  },
});
