import { cn, recipe } from "@repo/design-system/design-system";
import type { ReactNode } from "react";
import { AuthBrand, AuthTrustFooter } from "./auth-brand";

type AuthShellProps = {
  readonly children: ReactNode;
};

/**
 * Centered-card auth chrome: brand → form card (360–400px via layout) → trust line.
 */
export const AuthShell = ({ children }: AuthShellProps) => (
  <div className={cn("flex w-full flex-col", recipe("sectionGap"))}>
    <AuthBrand />
    <section
      aria-label="Authentication"
      className={cn(
        "flex flex-col py-6 px-[var(--card-padding)]",
        recipe("sectionGap", "panelSurface")
      )}
    >
      {children}
    </section>
    <AuthTrustFooter />
  </div>
);
