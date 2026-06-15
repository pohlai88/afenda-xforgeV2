import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "./components/afenda-ui/sonner";
import { TooltipProvider } from "./components/afenda-ui/tooltip";
import { ThemeProvider } from "./providers/theme";

export const DesignSystemProvider = ({
  children,
  ...properties
}: ThemeProviderProps) => (
  <ThemeProvider {...properties}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
