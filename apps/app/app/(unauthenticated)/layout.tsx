import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import type { ReactNode } from "react";
import { AuthShell } from "./components/auth-shell";

interface AuthLayoutProps {
  readonly children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="relative flex min-h-dvh flex-col bg-surface-canvas text-text-primary">
    <div className="absolute top-4 right-4 z-10">
      <ModeToggle />
    </div>
    <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[400px]">
        <AuthShell>{children}</AuthShell>
      </div>
    </main>
  </div>
);

export default AuthLayout;
