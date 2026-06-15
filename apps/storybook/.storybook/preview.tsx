import { Toaster } from "@repo/design-system/components/afenda-ui/sonner";
import { TooltipProvider } from "@repo/design-system/components/afenda-ui/tooltip";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react";

import "@repo/design-system/styles/globals.css";

type AfendaStoryLayout =
  | "center"
  | "padded"
  | "fullscreen"
  | "surface"
  | "frame";

const AFENDA_STORY_LAYOUTS = new Set<AfendaStoryLayout>([
  "center",
  "padded",
  "fullscreen",
  "surface",
  "frame",
]);

function getAfendaStoryLayout(value: unknown): AfendaStoryLayout {
  return typeof value === "string" &&
    AFENDA_STORY_LAYOUTS.has(value as AfendaStoryLayout)
    ? (value as AfendaStoryLayout)
    : "center";
}

function getAfendaStoryLayoutClass(
  layout: AfendaStoryLayout,
  viewMode: string | undefined
) {
  const minHeight = viewMode === "docs" ? "min-h-0" : "min-h-screen";

  switch (layout) {
    case "fullscreen":
      return `${minHeight} w-full`;
    case "padded":
      return `${minHeight} w-full p-8`;
    case "surface":
      return `${minHeight} w-full bg-surface p-8`;
    case "frame":
      return `${minHeight} w-full bg-background p-8`;
    case "center":
    default:
      return `flex ${minHeight} items-center justify-center p-8`;
  }
}

const withAfendaShell: Decorator = (Story, context) => {
  const density =
    typeof context.globals.density === "string"
      ? context.globals.density
      : "comfortable";
  const layoutFromGlobals =
    typeof context.globals.afendaLayout === "string"
      ? context.globals.afendaLayout
      : undefined;
  const layout = getAfendaStoryLayout(
    layoutFromGlobals ?? context.parameters.afendaLayout
  );

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div
          className="bg-background text-text-primary"
          data-afenda-story-layout={layout}
          data-density={density}
        >
          <div className={getAfendaStoryLayoutClass(layout, context.viewMode)}>
            <Story />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
};

const preview: Preview = {
  tags: ["autodocs"],
  // Keep global loaders empty. Use args for normal story data and
  // .storybook/loaders.ts only for deterministic story-level async fixtures.
  initialGlobals: {
    backgrounds: { value: "canvas", grid: false },
    density: "comfortable",
    afendaLayout: "center",
    viewport: "desktop",
  },
  parameters: {
    actions: {
      // Prefer explicit args: { onClick: fn() } in play-function stories.
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
      canvas: {
        sourceState: "shown",
      },
    },
    layout: "fullscreen",
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
  },
  globalTypes: {
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
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    withAfendaShell,
  ],
};

export default preview;
