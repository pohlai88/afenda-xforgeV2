"use client";

import { cn } from "@repo/design-system/lib/utils";
import type { CSSProperties } from "react";
import { CONTENT_LAYOUT_RESIZE_HANDLE_SIZE } from "./content-layout-constants";
import { contentLayoutResizeHandleClass } from "./content-layout-recipes";
import type {
  ContentLayoutResizeIntent,
  ContentLayoutResizeStartHandler,
} from "./content-layout-types";

interface ContentLayoutResizeHandlesProps {
  readonly onResizeStart: ContentLayoutResizeStartHandler;
}

const CONTENT_LAYOUT_RESIZE_HANDLES: readonly {
  readonly className: string;
  readonly intent: ContentLayoutResizeIntent;
  readonly label: string;
  readonly slot: string;
  readonly style: CSSProperties;
}[] = [
  {
    intent: "resize-top",
    label: "Resize content layout from top edge",
    className: "inset-x-8 top-0 cursor-ns-resize",
    slot: "content-layout-resize-top",
    style: { height: CONTENT_LAYOUT_RESIZE_HANDLE_SIZE },
  },
  {
    intent: "resize-right",
    label: "Resize content layout from right edge",
    className: "inset-y-8 right-0 cursor-ew-resize",
    slot: "content-layout-resize-right",
    style: { width: CONTENT_LAYOUT_RESIZE_HANDLE_SIZE },
  },
  {
    intent: "resize-bottom",
    label: "Resize content layout from bottom edge",
    className: "inset-x-8 bottom-0 cursor-ns-resize",
    slot: "content-layout-resize-bottom",
    style: { height: CONTENT_LAYOUT_RESIZE_HANDLE_SIZE },
  },
  {
    intent: "resize-left",
    label: "Resize content layout from left edge",
    className: "inset-y-8 left-0 cursor-ew-resize",
    slot: "content-layout-resize-left",
    style: { width: CONTENT_LAYOUT_RESIZE_HANDLE_SIZE },
  },
];

export function ContentLayoutResizeHandles({
  onResizeStart,
}: ContentLayoutResizeHandlesProps) {
  return (
    <>
      {CONTENT_LAYOUT_RESIZE_HANDLES.map((handle) => (
        <button
          aria-label={handle.label}
          className={cn(contentLayoutResizeHandleClass, handle.className)}
          data-slot={handle.slot}
          key={handle.intent}
          onPointerDown={(event) => onResizeStart(event, handle.intent)}
          style={handle.style}
          type="button"
        />
      ))}
    </>
  );
}
