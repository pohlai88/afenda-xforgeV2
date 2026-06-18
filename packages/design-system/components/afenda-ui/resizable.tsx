"use client";

import { cn } from "../../lib/utils";
import { GripVerticalIcon } from "lucide-react";
import type * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { recipe } from "./recipes";

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <Group
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        recipe("motionReduce"),
        className
      )}
      data-slot="resizable-panel-group"
      {...props}
    />
  );
}

function ResizablePanel({
  className,
  ...props
}: React.ComponentProps<typeof Panel>) {
  return (
    <Panel
      className={cn("min-h-0 min-w-0", className)}
      data-slot="resizable-panel"
      {...props}
    />
  );
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
}) {
  return (
    <Separator
      className={cn(
        "group/resizable-handle relative flex w-2 items-center justify-center outline-none",
        "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border-subtle",
        "hover:before:bg-border-hover data-[resize-handle-active=true]:before:bg-border-active",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2",
        "data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full",
        "data-[panel-group-direction=vertical]:before:inset-x-0 data-[panel-group-direction=vertical]:before:inset-y-auto data-[panel-group-direction=vertical]:before:top-1/2 data-[panel-group-direction=vertical]:before:h-px data-[panel-group-direction=vertical]:before:w-full data-[panel-group-direction=vertical]:before:translate-x-0 data-[panel-group-direction=vertical]:before:-translate-y-1/2",
        "data-[panel-group-direction=vertical]:after:inset-x-0 data-[panel-group-direction=vertical]:after:inset-y-auto data-[panel-group-direction=vertical]:after:top-1/2 data-[panel-group-direction=vertical]:after:h-4 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2",
        "[&[data-panel-group-direction=vertical]>div]:rotate-90",
        recipe("focusRingOnly", "colorTransition", "motionReduce"),
        className
      )}
      data-slot="resizable-handle"
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex h-6 w-3.5 items-center justify-center rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface-raised text-text-tertiary opacity-70 shadow-xs",
            "group-hover/resizable-handle:opacity-100 group-focus-visible/resizable-handle:opacity-100 group-data-[resize-handle-active=true]/resizable-handle:opacity-100",
            recipe("colorTransition", "motionReduce")
          )}
        >
          <GripVerticalIcon className={cn(recipe("resizableHandleIcon"))} />
        </div>
      )}
    </Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
