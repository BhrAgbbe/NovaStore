"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { THEME_COOKIE, type Mode } from "@/utils/theme";

interface ThemeContextValue {
  readonly mode: Mode;
  readonly toggle: () => void;
}
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  initialMode,
  children,
}: {
  readonly initialMode: Mode;
  readonly children: ReactNode;
}) {
  const [mode, setMode] = useState(initialMode);

  function toggle() {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.dataset.theme = next;
    document.cookie = THEME_COOKIE + "=" + next + "; Path=/; Max-Age=31536000; SameSite=Lax";
  }

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeProvider is missing");
  return context;
}
