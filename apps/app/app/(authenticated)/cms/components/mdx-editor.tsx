"use client";

import { Skeleton } from "@repo/design-system/design-system";
import dynamic from "next/dynamic";

type MdxEditorProperties = {
  value: string;
  onChange: (value: string) => void;
};

export const MdxEditor = dynamic<MdxEditorProperties>(
  () => import("./mdx-editor-panel").then((module) => module.MdxEditorPanel),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[420px] w-full rounded-lg" />,
  }
);
