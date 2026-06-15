"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@repo/design-system/components/ui/skeleton";

type MdxEditorProperties = {
  value: string;
  onChange: (value: string) => void;
};

export const MdxEditor = dynamic<MdxEditorProperties>(
  () =>
    import("./mdx-editor-panel").then((module) => module.MdxEditorPanel),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[420px] w-full rounded-lg" />,
  }
);
