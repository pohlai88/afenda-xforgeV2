import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

interface DocsLayoutProperties {
  children: ReactNode;
}

const DocsRootLayout = ({ children }: DocsLayoutProperties) => (
  <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
    {children}
  </DocsLayout>
);

export default DocsRootLayout;
