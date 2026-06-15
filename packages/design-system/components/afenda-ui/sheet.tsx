"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"

import { cn } from "@repo/design-system/lib/utils"
import { recipe } from "./recipes"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "bg-overlay/65",
        recipe("modalBackdrop"),
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  portalProps,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  portalProps?: React.ComponentProps<typeof SheetPrimitive.Portal>
}) {
  const sideClasses = {
    right:
      "inset-y-0 right-0 h-full w-[calc(100%-1rem)] border-l rounded-l-[var(--modal-radius)] sm:max-w-lg data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    left:
      "inset-y-0 left-0 h-full w-[calc(100%-1rem)] border-r rounded-r-[var(--modal-radius)] sm:max-w-lg data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
    top:
      "inset-x-0 top-0 h-auto border-b rounded-b-[var(--modal-radius)] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    bottom:
      "inset-x-0 bottom-0 h-auto border-t rounded-t-[var(--modal-radius)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  } as const

  return (
    <SheetPortal {...portalProps}>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-[var(--xforge-z-modal)] grid max-h-[100dvh] overflow-hidden border-border-default bg-surface-overlay text-text-primary shadow-overlay outline-none data-[state=closed]:animate-out data-[state=open]:animate-in motion-reduce:animate-none",
          recipe("sectionGap", "modalPadding"),
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          data-slot="sheet-close"
          className={cn(
            recipe(
              "dismissButton",
              "colorTransition",
              "focusRingOnly",
              "motionReduce"
            ),
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4"
          )}
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(recipe("modalHeader"), className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto border-t border-border-default pt-4", recipe("modalFooter"), className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(recipe("titleText"), className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(recipe("captionText"), className)}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("min-h-0 overflow-y-auto", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
