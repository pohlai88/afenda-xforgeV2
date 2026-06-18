"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "../../lib/utils";
import { recipe } from "./recipes";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className={cn(recipe("toasterRoot"))}
      closeButton
      data-slot="toaster"
      icons={{
        success: <CircleCheckIcon className={cn(recipe("toastSuccessIcon"))} />,
        info: <InfoIcon className={cn(recipe("toastInfoIcon"))} />,
        warning: (
          <TriangleAlertIcon className={cn(recipe("toastWarningIcon"))} />
        ),
        error: <OctagonXIcon className={cn(recipe("toastCriticalIcon"))} />,
        loading: (
          <Loader2Icon className={cn(recipe("toastLoadingIcon"))} />
        ),
      }}
      position="top-right"
      richColors={false}
      style={
        {
          "--normal-bg": "var(--surface-overlay)",
          "--normal-text": "var(--text-primary)",
          "--normal-border": "var(--border-default)",
          "--border-radius": "var(--card-radius)",
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast:
            "group toast border border-border-default bg-surface-overlay text-text-primary shadow-overlay",
          title: recipe("bodyMediumText"),
          description: recipe("captionText"),
          actionButton: `rounded-[var(--button-radius)] bg-brand-primary px-2.5 py-1 text-text-inverse ${recipe("captionText")}`,
          cancelButton: `rounded-[var(--button-radius)] border border-border-default bg-surface px-2.5 py-1 ${recipe("captionText")}`,
          closeButton:
            "border-border-default bg-surface text-text-secondary hover:text-text-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
