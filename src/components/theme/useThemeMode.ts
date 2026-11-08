"use client";

import { createContext, useContext } from "react";
import { useResolvedTheme, type ThemeMode, type ThemeName } from "@/lib/theme";
import type { RevealOrigin } from "./view-transition";

export interface SetThemeModeOptions {
  /** Viewport point the circular reveal grows from. Omit for an instant switch. */
  origin?: RevealOrigin;
}

export interface ThemeModeState {
  /** The visitor's choice: "auto" follows local time, "light"/"dark" are pinned. */
  mode: ThemeMode;
  /** The theme currently applied to <html data-theme>. */
  resolvedTheme: ThemeName;
  /** Persists the mode and applies the theme it resolves to. */
  setMode: (mode: ThemeMode, options?: SetThemeModeOptions) => void;
}

export const ThemeModeContext = createContext<ThemeModeState | null>(null);

const noop = () => {};

/**
 * Theme mode + resolved theme + setter. Must be used under <ThemeProvider>;
 * outside it the hook degrades to a read-only "auto" state.
 */
export function useThemeMode(): ThemeModeState {
  const context = useContext(ThemeModeContext);
  const resolvedTheme = useResolvedTheme();
  return context ?? { mode: "auto", resolvedTheme, setMode: noop };
}
