/** @type {import('@storybook/test-runner').StorybookTestRunnerConfig} */
import { getJestConfig } from "@storybook/test-runner";

const baseConfig = getJestConfig();

/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  ...baseConfig,
  testTimeout: 60_000,
  maxWorkers: process.env.CI ? 2 : 1,
};
