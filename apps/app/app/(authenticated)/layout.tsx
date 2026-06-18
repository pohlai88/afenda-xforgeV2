import type { ReactNode } from "react";
import { Suspense } from "react";
import { AuthenticatedLayoutContent } from "./_components/authenticated-layout-content";
import { AuthenticatedLayoutFallback } from "./_components/authenticated-layout-fallback";
import { AuthenticatedShell } from "./_components/authenticated-shell";

interface AppLayoutProperties {
  readonly children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProperties) => (
  <Suspense fallback={<AuthenticatedLayoutFallback />}>
    <AuthenticatedLayoutContent>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </AuthenticatedLayoutContent>
  </Suspense>
);

export default AppLayout;
