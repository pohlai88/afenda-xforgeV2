"use client";

import { AfendaAppShell } from "@repo/design-system";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

interface AuthenticatedShellProperties {
  readonly children: ReactNode;
}

export function AuthenticatedShell({ children }: AuthenticatedShellProperties) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (pathname.startsWith("/mfa-challenge")) {
    return <>{children}</>;
  }

  if (!isMounted) {
    return <div className="min-h-svh bg-background" />;
  }

  return <AfendaAppShell>{children}</AfendaAppShell>;
}
