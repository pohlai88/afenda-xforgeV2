import type { Preview } from "@storybook/react";
import { themes } from "storybook/theming";

/** Shared preview parameters (Essentials + Chromatic). */
export const previewParameters: Preview["parameters"] = {
  actions: {
    argTypesRegex: "^on[A-Z].*",
  },
  a11y: {
    test: "error",
    config: {
      rules: [
        { id: "color-contrast", enabled: true },
        { id: "label", enabled: true },
        { id: "button-name", enabled: true },
      ],
    },
  },
  backgrounds: {
    default: "canvas",
    options: {
      canvas: { name: "Canvas", value: "hsl(var(--background))" },
      surface: { name: "Surface", value: "hsl(var(--card))" },
      raised: { name: "Raised", value: "hsl(var(--muted))" },
      ink: { name: "Ink", value: "hsl(var(--foreground))" },
    },
    grid: {
      cellSize: 8,
      cellAmount: 1,
      opacity: 0.04,
    },
  },
  controls: {
    sort: "requiredFirst",
    exclude: /^(className|ref|asChild)$/,
    matchers: {
      color: /(background|color|tone)$/i,
      date: /Date$/i,
    },
  },
  docs: {
    theme: themes.light,
    canvas: {
      sourceState: "shown",
    },
  },
  layout: "fullscreen",
  options: {
    storySort: {
      order: [
        "Introduction",
        "Afenda UI",
        "Blocks",
        "ui",
        "Tokens",
        "Primitive readiness",
        "*",
      ],
    },
  },
  viewport: {
    viewports: {
      mobile: {
        name: "Mobile",
        styles: { width: "375px", height: "667px" },
        type: "mobile",
      },
      tablet: {
        name: "Tablet",
        styles: { width: "768px", height: "1024px" },
        type: "tablet",
      },
      operator: {
        name: "Operator",
        styles: { width: "1280px", height: "800px" },
        type: "desktop",
      },
      desktop: {
        name: "Desktop",
        styles: { width: "1440px", height: "900px" },
        type: "desktop",
      },
      dense: {
        name: "Dense dashboard",
        styles: { width: "1536px", height: "864px" },
        type: "desktop",
      },
    },
  },
  chromatic: {
    modes: {
      light: {
        theme: "light",
        className: "light",
      },
      dark: {
        theme: "dark",
        className: "dark",
      },
    },
  },
};

export const previewInitialGlobals: Preview["initialGlobals"] = {
  backgrounds: { value: "canvas", grid: false },
  density: "comfortable",
  afendaLayout: "center",
  viewport: "desktop",
};

export const previewGlobalTypes: Preview["globalTypes"] = {
  density: {
    description: "Global density for story layouts",
    toolbar: {
      title: "Density",
      icon: "mirror",
      items: [
        { title: "Comfortable", value: "comfortable" },
        { title: "Compact", value: "compact" },
      ],
      dynamicTitle: true,
    },
  },
  afendaLayout: {
    description: "Shell padding and alignment for Afenda stories",
    toolbar: {
      title: "Layout",
      icon: "component",
      items: [
        { title: "Center", value: "center" },
        { title: "Padded", value: "padded" },
        { title: "Fullscreen", value: "fullscreen" },
        { title: "Surface", value: "surface" },
        { title: "Frame", value: "frame" },
      ],
      dynamicTitle: true,
    },
  },
};
