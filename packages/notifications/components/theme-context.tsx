"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type NotificationsTheme = "light" | "dark";

const NotificationsThemeContext = createContext<NotificationsTheme>("light");

export const useNotificationsTheme = () => useContext(NotificationsThemeContext);

interface NotificationsThemeProviderProperties {
  children: ReactNode;
  theme: NotificationsTheme;
}

export const NotificationsThemeProvider = ({
  children,
  theme,
}: NotificationsThemeProviderProperties) => (
  <NotificationsThemeContext.Provider value={theme}>
    {children}
  </NotificationsThemeContext.Provider>
);
