"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

function TooltipProvider({
  delayDuration = 250,
  skipDelayDuration = 300,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipPortal({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Portal>) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  portalProps,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  portalProps?: React.ComponentProps<typeof TooltipPrimitive.Portal>
}) {
  return (
    <TooltipPortal {...portalProps}>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          recipe("captionText", "overlayMotion"),
          "z-[var(--xforge-z-tooltip)] w-fit max-w-64 origin-[var(--radix-tooltip-content-transform-origin)] rounded-[var(--xforge-radius-sm)] bg-surface-inverse px-2 py-1 text-balance text-text-inverse shadow-md",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="size-2.5 fill-surface-inverse" />
      </TooltipPrimitive.Content>
    </TooltipPortal>
  )
}

export { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger }
