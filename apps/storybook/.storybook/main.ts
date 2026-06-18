import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

import { STORYBOOK_MCP_ENABLED } from "./constants.ts";
import { applyStorybookViteConfig } from "./vite.shared.ts";

const require = createRequire(import.meta.url);
const storybookConfigDir = dirname(fileURLToPath(import.meta.url));
const storybookAppDir = join(storybookConfigDir, "..");
const docgenTsconfigPath = join(storybookAppDir, "tsconfig.docgen.json");
const nodeModulesPattern = /node_modules/;

/** Resolve addon/framework package roots in the pnpm monorepo. */
const getAbsolutePath = (value: string) =>
  dirname(require.resolve(join(value, "package.json")));

const mcpAddon = {
  name: getAbsolutePath("@storybook/addon-mcp"),
  options: {
    toolsets: {
      dev: true,
      docs: true,
      test: true,
    },
  },
} as const;

const config: StorybookConfig = {
  stories: [
    "../stories/Introduction.mdx",
    {
      directory: "../stories/afenda-ui",
      files: "**/*.stories.@(js|jsx|mjs|ts|tsx)",
    },
    {
      directory: "../stories/blocks",
      files: "**/*.stories.@(js|jsx|mjs|ts|tsx)",
    },
    {
      directory: "../stories",
      files: "tokens.stories.tsx",
    },
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-links"),
    ...(STORYBOOK_MCP_ENABLED ? [mcpAddon] : []),
    getAbsolutePath("@storybook/addon-themes"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  staticDirs: ["../public"],
  core: {
    disableTelemetry: true,
  },
  tags: {
    deprecated: {
      defaultFilterSelection: "exclude",
    },
    experimental: {
      defaultFilterSelection: "exclude",
    },
    internal: {
      defaultFilterSelection: "exclude",
    },
    "visual-audit": {},
    interaction: {},
    snapshot: {},
    primitive: {},
    block: {},
    "afenda-ui": {},
  },
  features: {
    experimentalComponentsManifest: true,
  } as StorybookConfig["features"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      tsconfigPath: docgenTsconfigPath,
      include: ["**/*.{ts,tsx}", "../../packages/design-system/**/*.{ts,tsx}"],
      exclude: [".storybook/**"],
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !nodeModulesPattern.test(prop.parent.fileName) : true,
    },
  },
  viteFinal(config, { configType }) {
    return applyStorybookViteConfig(config, { configType });
  },
};

export default config;
