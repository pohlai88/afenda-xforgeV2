"use client";

import { Skeleton } from "@repo/design-system";
import dynamic from "next/dynamic";

interface MdxEditorProperties {
  onChange: (value: string) => void;
  value: string;
}

export const MdxEditor = dynamic<MdxEditorProperties>(
  () => import("./mdx-editor-panel").then((module) => module.MdxEditorPanel),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[420px] w-full rounded-lg" />,
  }
);
