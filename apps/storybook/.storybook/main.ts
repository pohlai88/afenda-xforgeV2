import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const getAbsolutePath = (value: string) =>
  dirname(require.resolve(join(value, "package.json")));

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-links"),
    {
      name: getAbsolutePath("@storybook/addon-mcp"),
      options: {
        toolsets: {
          dev: true,
          docs: true,
          test: true,
        },
      },
    },
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-themes"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag",
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
  // Essentials (actions, backgrounds, controls, highlight, measure, outline,
  // viewport) ship in Storybook 10 core — all default to enabled. Disable per
  // feature here only when turning off a toolbar globally, e.g. backgrounds: false.
  features: {
    experimentalComponentsManifest: true,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
