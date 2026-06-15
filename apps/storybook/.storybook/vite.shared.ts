import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, UserConfig } from "vite";

import {
  stripUseClientDirective,
  stripUseClientEsbuildPlugin,
} from "./vite-plugins/strip-use-client.ts";

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

const designSystemDir = join(packagesDir, "design-system");

/** Map package.json export subpaths before the coarse @repo/design-system alias. */
function readDesignSystemExportAliases(): Array<{
  find: RegExp | string;
  replacement: string;
}> {
  const pkg = JSON.parse(
    readFileSync(join(designSystemDir, "package.json"), "utf8")
  ) as { exports?: Record<string, string> };
  const aliases: Array<{ find: RegExp | string; replacement: string }> = [];
  const exportEntries = Object.entries(pkg.exports ?? {});

  for (const [exportKey, target] of exportEntries) {
    if (!(exportKey.startsWith("./") && exportKey.includes("*"))) {
      continue;
    }

    const prefix = exportKey.slice(2).replace("*", "");
    const targetPrefix = target.replace("*", "");
    aliases.push({
      find: new RegExp(
        `^@repo/design-system/${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(.+)$`
      ),
      replacement: `${join(designSystemDir, targetPrefix).replace(/\\/g, "/")}$1`,
    });
  }

  for (const [exportKey, target] of exportEntries) {
    if (!exportKey.startsWith("./") || exportKey.includes("*")) {
      continue;
    }

    aliases.push({
      find: `@repo/design-system/${exportKey.slice(2)}`,
      replacement: join(designSystemDir, target),
    });
  }

  aliases.push(
    {
      find: "@repo/design-system/tokens/token-usage.policy",
      replacement: join(designSystemDir, "tokens/token-usage.policy.ts"),
    },
    {
      find: "@repo/design-system/tokens/tokens.json",
      replacement: join(designSystemDir, "tokens/tokens.json"),
    },
    {
      find: "@repo/design-system/providers/theme",
      replacement: join(designSystemDir, "providers/theme.tsx"),
    }
  );

  return aliases;
}

const designSystemExportAliases = readDesignSystemExportAliases();

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
      alias: [
        ...designSystemExportAliases,
        ...Object.entries(repoPackageAliases).map(([find, replacement]) => ({
          find,
          replacement,
        })),
        {
          find: "server-only",
          replacement: join(storybookAppDir, "vite-shims/server-only.ts"),
        },
      ],
    },
    esbuild: {
      jsx: "automatic",
      jsxDev: configType !== "PRODUCTION",
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "lucide-react",
        "@storybook/react-dom-shim",
        "@storybook/addon-docs",
        "@storybook/blocks",
      ],
      esbuildOptions: {
        jsx: "automatic",
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
