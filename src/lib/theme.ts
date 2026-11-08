import { useTheme } from "next-themes";

/**
 * Shared day/night theme contract.
 *
 * - The applied theme lives on <html data-theme="light|dark"> (next-themes, attribute="data-theme").
 * - THEME_STORAGE_KEY holds the applied theme (managed by next-themes).
 * - THEME_MODE_KEY holds the visitor's choice: "auto" (follow local time) | "light" | "dark".
 *   Missing/invalid => "auto".
 *
 * Styling consumers should use the CSS custom properties from globals.scss. Canvas / WebGL
 * consumers that cannot read CSS variables can use THEME_PALETTE with useResolvedTheme().
 */

export type ThemeName = "light" | "dark";
export type ThemeMode = "auto" | ThemeName;

export const THEME_STORAGE_KEY = "theme";
export const THEME_MODE_KEY = "theme-mode";

/** The <html> attribute that carries the applied theme. */
export const THEME_ATTRIBUTE = "data-theme";

/** Local-time window for the automatic theme: day = [06:00, 19:00). */
export const DAY_START_HOUR = 6;
export const NIGHT_START_HOUR = 19;

/** How often the automatic mode re-checks the local time while the page is open. */
export const AUTO_THEME_CHECK_INTERVAL_MS = 60_000;

export function getTimeBasedTheme(date: Date = new Date()): ThemeName {
  const hour = date.getHours();
  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? "light" : "dark";
}

export function isThemeName(value: unknown): value is ThemeName {
  return value === "light" || value === "dark";
}

/** Normalises a stored mode value: anything that is not a pinned theme means "auto". */
export function parseThemeMode(value: unknown): ThemeMode {
  return isThemeName(value) ? value : "auto";
}

/** The theme a mode resolves to at the given moment. */
export function resolveThemeMode(mode: ThemeMode, date: Date = new Date()): ThemeName {
  return mode === "auto" ? getTimeBasedTheme(date) : mode;
}

/**
 * Next step of the manual toggle cycle:
 *   Auto -> opposite of what is shown (always a visible change)
 *        -> same theme as auto, pinned
 *        -> Auto
 */
export function getNextThemeMode(
  mode: ThemeMode,
  resolved: ThemeName,
  timeBased: ThemeName = getTimeBasedTheme()
): ThemeMode {
  if (mode === "auto") return resolved === "dark" ? "light" : "dark";
  return mode === timeBased ? "auto" : timeBased;
}

/** Background color per theme; mirrored in <meta name="theme-color">. */
export const THEME_BACKGROUND: Record<ThemeName, string> = {
  light: "#F7F8F3",
  dark: "#0F1512",
};

export interface ThemePalette {
  background: string;
  surface: string;
  surfaceMuted: string;
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  /** Readable accent for text, strokes and active states (--accent-muted). */
  accentStrong: string;
  border: string;
  darkSection: string;
}

/**
 * Hex mirror of the core CSS tokens for consumers that cannot use var(--...)
 * (WebGL materials, 2D canvas). Keep in sync with globals.scss.
 */
export const THEME_PALETTE: Record<ThemeName, ThemePalette> = {
  light: {
    background: THEME_BACKGROUND.light,
    surface: "#FFFFFF",
    surfaceMuted: "#EEF2E9",
    primary: "#1D2921",
    secondary: "#647267",
    tertiary: "#8A968C",
    accent: "#B7DB72",
    accentStrong: "#72953F",
    border: "#DDE4D9",
    darkSection: "#233229",
  },
  dark: {
    background: THEME_BACKGROUND.dark,
    surface: "#151D18",
    surfaceMuted: "#1B2520",
    primary: "#E7ECE4",
    secondary: "#A3B0A6",
    tertiary: "#86948B",
    accent: "#B7DB72",
    accentStrong: "#C5E38A",
    border: "#2A362E",
    darkSection: "#233229",
  },
};

/** The theme currently applied to <html> (falls back to "light" on the server). */
export function getDocumentTheme(): ThemeName {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === "dark" ? "dark" : "light";
}

/**
 * Blocking <head> script that runs before first paint (and before next-themes' own script):
 * in auto mode it writes the time-based theme to THEME_STORAGE_KEY so next-themes reads the
 * same value, then applies data-theme + color-scheme. Storage failures fall back to the
 * time-based theme so the attribute is always set.
 */
export function getThemeInitScript(): string {
  const modeKey = JSON.stringify(THEME_MODE_KEY);
  const themeKey = JSON.stringify(THEME_STORAGE_KEY);
  const attribute = JSON.stringify(THEME_ATTRIBUTE);
  return (
    "(function(){var d=document.documentElement,t;" +
    `function a(){var h=new Date().getHours();return h>=${DAY_START_HOUR}&&h<${NIGHT_START_HOUR}?"light":"dark"}` +
    "try{" +
    `var m=localStorage.getItem(${modeKey});` +
    `if(m==="light"||m==="dark"){t=m}else{t=a()}` +
    `localStorage.setItem(${themeKey},t)` +
    "}catch(e){t=t||a()}" +
    `d.setAttribute(${attribute},t);d.style.colorScheme=t` +
    "})();"
  );
}

/**
 * The currently applied theme. Falls back to the pre-hydration data-theme attribute
 * when next-themes has not resolved yet. Use it in client-only components or after
 * mount; on the server it always reports "light".
 */
export function useResolvedTheme(): ThemeName {
  const { resolvedTheme } = useTheme();
  if (resolvedTheme === "dark" || resolvedTheme === "light") return resolvedTheme;
  return getDocumentTheme();
}
