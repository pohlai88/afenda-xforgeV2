import { Toaster } from "@repo/design-system/components/afenda-ui/sonner";
import { TooltipProvider } from "@repo/design-system/components/afenda-ui/tooltip";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Decorator, Preview } from "@storybook/react";

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

export const previewDecorators: Preview["decorators"] = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
  }),
  withAfendaShell,
];
