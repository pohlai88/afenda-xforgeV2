import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, UserConfig } from "vite";

import { stripUseClientDirective, stripUseClientEsbuildPlugin } from "./vite-plugins/strip-use-client.ts";

const storybookDir = dirname(fileURLToPath(import.meta.url));
const storybookAppDir = join(storybookDir, "..");
const monorepoRoot = join(storybookAppDir, "../..");
const packagesDir = join(monorepoRoot, "packages");

const workspacePackages = [
  "auth",
  "database",
  "design-system",
  "internationalization",
] as const;

export const repoPackageAliases = Object.fromEntries(
  workspacePackages.map((name) => [`@repo/${name}`, join(packagesDir, name)])
);

interface ApplyStorybookViteOptions {
  configType?: "DEVELOPMENT" | "PRODUCTION";
}

const productionChunkRules: readonly {
  readonly chunkName: string;
  readonly matches: readonly string[];
}[] = [
  {
    chunkName: "vendor-react-dom",
    matches: ["node_modules/react-dom"],
  },
  {
    chunkName: "vendor-react",
    matches: ["node_modules/react/", "node_modules/react\\"],
  },
  {
    chunkName: "vendor-icons",
    matches: ["node_modules/lucide-react"],
  },
  {
    chunkName: "vendor-charts",
    matches: ["node_modules/recharts", "node_modules/d3-"],
  },
  {
    chunkName: "vendor-dates",
    matches: ["node_modules/react-day-picker", "node_modules/date-fns"],
  },
  {
    chunkName: "vendor-radix",
    matches: ["node_modules/@radix-ui"],
  },
  {
    chunkName: "vendor-axe",
    matches: ["node_modules/axe-core", "node_modules/axe-playwright"],
  },
  {
    chunkName: "vendor-mdx",
    matches: ["node_modules/@mdx-js", "node_modules/micromark"],
  },
  {
    chunkName: "vendor-highlight",
    matches: ["node_modules/highlight.js", "node_modules/refractor"],
  },
  {
    chunkName: "vendor-storybook-blocks",
    matches: [
      "node_modules/@storybook/blocks",
      "node_modules/@storybook/csf-plugin",
    ],
  },
  {
    chunkName: "vendor-storybook-docs",
    matches: ["node_modules/@storybook/addon-docs"],
  },
  {
    chunkName: "vendor-storybook",
    matches: ["node_modules/@storybook/"],
  },
];

function getProductionChunkName(id: string) {
  return productionChunkRules.find((rule) =>
    rule.matches.some((match) => id.includes(match))
  )?.chunkName;
}

/** Shared Vite overrides for Storybook dev + static build. */
export async function applyStorybookViteConfig(
  config: UserConfig,
  { configType }: ApplyStorybookViteOptions = {}
): Promise<UserConfig> {
  const { mergeConfig } = await import("vite");
  const tsconfigPaths = (await import("vite-tsconfig-paths")).default;

  return mergeConfig(config, {
    plugins: [
      stripUseClientDirective(),
      tsconfigPaths({
        projects: [join(storybookAppDir, "tsconfig.json")],
      }),
    ] satisfies Plugin[],
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        ...repoPackageAliases,
        "server-only": join(storybookAppDir, "vite-shims/server-only.ts"),
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "lucide-react"],
      esbuildOptions: {
        plugins: [stripUseClientEsbuildPlugin()],
      },
    },
    server: {
      fs: {
        allow: [monorepoRoot],
      },
      watch: {
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.turbo/**",
          "**/storybook-static/**",
          "**/.storybook/a11y-reports/**",
        ],
      },
    },
    ...(configType === "PRODUCTION"
      ? {
          build: {
            sourcemap: false,
            chunkSizeWarningLimit: 920,
            rollupOptions: {
              output: {
                manualChunks: getProductionChunkName,
              },
            },
          },
        }
      : {}),
  });
}
