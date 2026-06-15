import { readFileSync } from "node:fs";
import type { Plugin } from "vite";

const USE_CLIENT_PRESENT = /\buse client\b/;
const USE_CLIENT_DIRECTIVE = /^["']use client["'];?\s*/gm;
const ESBUILD_ALL_FILES_FILTER = /.*/;

const CLIENT_BOUNDARY_PATHS = [
  "node_modules",
  "/packages/design-system/",
  "\\packages\\design-system\\",
] as const;

interface EsbuildOnLoadArgs {
  readonly path: string;
}

type EsbuildLoader = "js" | "ts" | "tsx";

interface EsbuildOnLoadResult {
  readonly contents: string;
  readonly loader: EsbuildLoader;
}

function getEsbuildLoader(path: string): EsbuildLoader {
  if (path.endsWith(".tsx")) {
    return "tsx";
  }

  if (path.endsWith(".ts")) {
    return "ts";
  }

  return "js";
}

interface EsbuildPluginBuild {
  onLoad(
    options: { readonly filter: RegExp },
    callback: (args: EsbuildOnLoadArgs) => EsbuildOnLoadResult | null
  ): void;
}

export function shouldStripClientBoundaryPath(id: string) {
  return CLIENT_BOUNDARY_PATHS.some((pathSegment) => id.includes(pathSegment));
}

export function stripUseClientFromSource(code: string) {
  if (!USE_CLIENT_PRESENT.test(code)) {
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
    setup(build: EsbuildPluginBuild) {
      build.onLoad({ filter: ESBUILD_ALL_FILES_FILTER }, (args) => {
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
          loader: getEsbuildLoader(args.path),
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
