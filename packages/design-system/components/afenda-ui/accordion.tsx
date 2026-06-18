"use client";

import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type * as React from "react";
import { recipe } from "./recipes";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      className={cn("w-full", recipe("bodyText"), className)}
      data-slot="accordion"
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "border-border-default border-b last:border-b-0",
        className
      )}
      data-slot="accordion-item"
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-[var(--xforge-radius-sm)] py-3 text-left text-text-primary outline-none hover:text-text-primary disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          recipe(
            "bodyMediumText",
            "colorTransition",
            "focusRingOnly",
            "motionReduce"
          ),
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        <span className={cn("min-w-0 flex-1", recipe("accordionTriggerLabel"))}>
          {children}
        </span>
        <ChevronDownIcon className={cn(recipe("accordionTriggerIcon"))} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-text-secondary data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        recipe("captionText", "motionReduce")
      )}
      data-slot="accordion-content"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
