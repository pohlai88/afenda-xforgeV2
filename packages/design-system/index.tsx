import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "./components/afenda-ui/sonner";
import { TooltipProvider } from "./components/afenda-ui/tooltip";
import { ThemeProvider } from "./providers/theme";

/** Root provider — includes afenda-ui `Toaster` (sonner) for toast.promise/toast.* in blocks. */
export const DesignSystemProvider = ({
  children,
  ...properties
}: ThemeProviderProps) => (
  <ThemeProvider {...properties}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
