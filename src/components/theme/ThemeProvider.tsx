"use client";

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  AUTO_THEME_CHECK_INTERVAL_MS,
  THEME_ATTRIBUTE,
  THEME_BACKGROUND,
  THEME_STORAGE_KEY,
  getTimeBasedTheme,
  resolveThemeMode,
  useResolvedTheme,
  type ThemeMode,
  type ThemeName,
} from "@/lib/theme";
import { getServerThemeMode, readThemeMode, subscribeThemeMode, writeThemeMode } from "./theme-mode-store";
import { runThemeReveal } from "./view-transition";
import { useIsClient } from "./useIsClient";
import { ThemeModeContext, type SetThemeModeOptions, type ThemeModeState } from "./useThemeMode";

const THEMES: ThemeName[] = ["light", "dark"];

/**
 * Day/night theme root: next-themes applies <html data-theme>, ThemeModeProvider adds the
 * auto (local time) / pinned mode on top, and ThemeColorMeta keeps the browser UI color in sync.
 * The blocking script from getThemeInitScript() (rendered in <head>) prevents a flash on load.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // "light" on the server (contract default). On the client next-themes only falls back to
  // defaultTheme when localStorage is unavailable, so use the time-based theme there; this
  // keeps the storage-blocked case flash-free (the head script already applied that theme).
  const defaultTheme: ThemeName = typeof window === "undefined" ? "light" : getTimeBasedTheme();

  return (
    <NextThemesProvider
      attribute={THEME_ATTRIBUTE}
      themes={THEMES}
      defaultTheme={defaultTheme}
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      <ThemeModeProvider>
        <ThemeColorMeta />
        {children}
      </ThemeModeProvider>
    </NextThemesProvider>
  );
}

function ThemeModeProvider({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  const resolvedTheme = useResolvedTheme();
  const mode = useSyncExternalStore(subscribeThemeMode, readThemeMode, getServerThemeMode);

  // Latest values for timers, listeners and the reveal callback (no re-subscribing).
  const latest = useRef({ resolvedTheme, setTheme });
  useEffect(() => {
    latest.current = { resolvedTheme, setTheme };
  });

  // Auto mode: follow the local clock (every minute, and whenever the tab becomes visible
  // or focused again). The decision always reads the stored mode, so the hydration render
  // (where `mode` is still the server snapshot "auto") never overrides a pinned choice.
  // Pinned modes only re-assert their theme once and stop the clock.
  useEffect(() => {
    const sync = () => {
      const target = resolveThemeMode(readThemeMode());
      if (latest.current.resolvedTheme !== target) latest.current.setTheme(target);
    };

    sync();
    if (mode !== "auto") return;

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") sync();
    };
    const timer = window.setInterval(sync, AUTO_THEME_CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", sync);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", sync);
    };
  }, [mode]);

  const setMode = useCallback((nextMode: ThemeMode, options?: SetThemeModeOptions) => {
    const target = resolveThemeMode(nextMode);
    const apply = () => {
      writeThemeMode(nextMode);
      latest.current.setTheme(target);
    };

    if (options?.origin) runThemeReveal(target, apply, options.origin);
    else apply();
  }, []);

  const value = useMemo<ThemeModeState>(
    () => ({ mode, resolvedTheme, setMode }),
    [mode, resolvedTheme, setMode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

/** React 19 hoists this into <head>; light until hydrated so SSR and first render match. */
function ThemeColorMeta() {
  const isClient = useIsClient();
  const theme = useResolvedTheme();
  return <meta name="theme-color" content={THEME_BACKGROUND[isClient ? theme : "light"]} />;
}
