import type { Preview } from "@storybook/react";

import "@repo/design-system/styles/globals.css";

import { previewDecorators } from "./preview.decorators";
import {
  previewGlobalTypes,
  previewInitialGlobals,
  previewParameters,
} from "./preview.parameters";

const preview: Preview = {
  tags: ["autodocs"],
  initialGlobals: previewInitialGlobals,
  parameters: previewParameters,
  globalTypes: previewGlobalTypes,
  decorators: previewDecorators,
};

export default preview;
