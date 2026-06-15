"use client";

import { NovuProvider } from "@novu/react";
import type { ReactNode } from "react";
import { keys } from "../keys";
import { NotificationsThemeProvider } from "./theme-context";

const novuAppId = keys().NEXT_PUBLIC_NOVU_APP_ID;

interface NotificationsProviderProps {
  children: ReactNode;
  theme: "light" | "dark";
  userId: string;
}

export const NotificationsProvider = ({
  children,
  theme,
  userId,
}: NotificationsProviderProps) => {
  if (!novuAppId) {
    return children;
  }

  return (
    <NovuProvider applicationIdentifier={novuAppId} subscriberId={userId}>
      <NotificationsThemeProvider theme={theme}>
        {children}
      </NotificationsThemeProvider>
    </NovuProvider>
  );
};
