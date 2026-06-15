import { ModeToggle } from "@repo/design-system/design-system";
import type { ReactNode } from "react";
import { AuthShell } from "../../(unauthenticated)/components/auth-shell";

type MfaChallengeShellProperties = {
  readonly children: ReactNode;
};

/** Minimal centered chrome for post-login MFA step-up (no app sidebar). */
export const MfaChallengeShell = ({ children }: MfaChallengeShellProperties) => (
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
