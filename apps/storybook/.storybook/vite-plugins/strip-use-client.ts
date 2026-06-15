import { readFileSync } from "node:fs";
import type { Plugin } from "vite";

const USE_CLIENT_DIRECTIVE = /^["']use client["'];?\s*/gm;

const CLIENT_BOUNDARY_PATHS = [
  "node_modules",
  "/packages/design-system/",
  "\\packages\\design-system\\",
] as const;

export function shouldStripClientBoundaryPath(id: string) {
  return CLIENT_BOUNDARY_PATHS.some((pathSegment) => id.includes(pathSegment));
}

export function stripUseClientFromSource(code: string) {
  if (!/\buse client\b/.test(code)) {
    return null;
  }

  USE_CLIENT_DIRECTIVE.lastIndex = 0;
  const stripped = code.replace(USE_CLIENT_DIRECTIVE, "");

  return stripped === code ? null : stripped;
}

/** Esbuild plugin for Vite dependency pre-bundling (bypasses transform hooks). */
export function stripUseClientEsbuildPlugin() {
  return {
    name: "afenda-storybook:strip-use-client-esbuild",
    setup(build: { onLoad: Function }) {
      build.onLoad({ filter: /.*/ }, (args: { path: string }) => {
        if (!shouldStripClientBoundaryPath(args.path)) {
          return null;
        }

        const contents = readFileSync(args.path, "utf8");
        const stripped = stripUseClientFromSource(contents);

        if (!stripped) {
          return null;
        }

        return {
          contents: stripped,
          loader: "js" as const,
        };
      });
    },
  };
}

/** Strip Next.js client boundaries from dependencies — Storybook runs in the browser. */
export function stripUseClientDirective(): Plugin {
  return {
    name: "afenda-storybook:strip-use-client",
    enforce: "pre",
    transform(code, id) {
      if (!shouldStripClientBoundaryPath(id)) {
        return null;
      }

      const stripped = stripUseClientFromSource(code);

      if (!stripped) {
        return null;
      }

      return {
        code: stripped,
        map: null,
      };
    },
  };
}
