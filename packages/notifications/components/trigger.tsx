"use client";

import { inboxDarkTheme } from "@novu/js/themes";
import { Inbox } from "@novu/react";
import { keys } from "../keys";
import { useNotificationsTheme } from "./theme-context";

export const NotificationsTrigger = () => {
  const theme = useNotificationsTheme();

  if (!keys().NEXT_PUBLIC_NOVU_APP_ID) {
    return null;
  }

  return (
    <Inbox
      appearance={
        theme === "dark" ? { baseTheme: inboxDarkTheme } : undefined
      }
    />
  );
};
