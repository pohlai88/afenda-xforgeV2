import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { resolveOrbitCaseEnabled } from "@/lib/orbit-case-access";

/** Orbit Case segment — cached reads use `use cache` in `@/lib/orbit-case-cached-reads`. */
export default async function OrbitCaseLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (!(await resolveOrbitCaseEnabled())) {
    redirect("/dashboard");
  }

  return children;
}
