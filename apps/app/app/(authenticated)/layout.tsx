import type { ReactNode } from "react";
import { Suspense } from "react";
import { AuthenticatedLayoutContent } from "./_components/authenticated-layout-content";
import { AuthenticatedLayoutFallback } from "./_components/authenticated-layout-fallback";

interface AppLayoutProperties {
  readonly children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProperties) => (
  <Suspense fallback={<AuthenticatedLayoutFallback />}>
    <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
  </Suspense>
);

export default AppLayout;
