/** Unauthenticated auth pages — centered shell with theme toggle. */
import { ModeToggle } from "@repo/design-system";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthShell } from "./_components/auth-shell";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

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
