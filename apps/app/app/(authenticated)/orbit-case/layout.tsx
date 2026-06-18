import type { ReactNode } from "react";

/** Orbit Case segment — cached reads use `use cache` in `@/lib/orbit-case-cached-reads`. */
export default function OrbitCaseLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
