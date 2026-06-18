import type { ThemeProviderProps } from "next-themes";
import { createElement } from "react";
import { Toaster } from "../components/afenda-ui/sonner";
import { TooltipProvider } from "../components/afenda-ui/tooltip";
import { ThemeProvider } from "./theme";

export const DesignSystemProvider = ({
  children,
  ...properties
}: ThemeProviderProps) =>
  createElement(
    ThemeProvider,
    properties,
    createElement(TooltipProvider, null, children),
    createElement(Toaster)
  );
