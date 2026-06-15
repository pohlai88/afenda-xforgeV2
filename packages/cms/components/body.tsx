"use client";

import { getMDXComponent } from "mdx-bundler/client/react";
import { useMemo } from "react";

type BodyProperties = {
  code: string;
};

export const Body = ({ code }: BodyProperties) => {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Component />
    </div>
  );
};
