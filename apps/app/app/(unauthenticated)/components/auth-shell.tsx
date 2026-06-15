import { cn, recipe } from "@repo/design-system/design-system";
import type { ReactNode } from "react";
import { AuthBrand, AuthTrustFooter } from "./auth-brand";

type AuthShellProps = {
  readonly children: ReactNode;
};

export const AuthShell = ({ children }: AuthShellProps) => (
  <div className={cn("flex w-full flex-col", recipe("sectionGap"))}>
    <AuthBrand />
    <div
      className={cn(
        "rounded-[10px] border border-border-default bg-surface-primary p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_rgb(0_0_0/0.04)]",
        recipe("sectionGap")
      )}
    >
      {children}
    </div>
    <AuthTrustFooter />
  </div>
);
