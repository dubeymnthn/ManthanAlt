import { THEME_MODE_KEY, parseThemeMode, type ThemeMode } from "@/lib/theme";

/**
 * Tiny external store for the visitor's theme mode ("auto" | "light" | "dark"),
 * persisted in localStorage[THEME_MODE_KEY] and synced across tabs via the storage
 * event. Built for useSyncExternalStore: the server snapshot is always "auto".
 * When storage is unavailable the mode lives in memory for the page's lifetime.
 */

const listeners = new Set<() => void>();
let memoryMode: ThemeMode = "auto";

function emit() {
  listeners.forEach((listener) => listener());
}

export function readThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  try {
    return parseThemeMode(window.localStorage.getItem(THEME_MODE_KEY));
  } catch {
    return memoryMode;
  }
}

export function writeThemeMode(mode: ThemeMode) {
  memoryMode = mode;
  try {
    window.localStorage.setItem(THEME_MODE_KEY, mode);
  } catch {
    // Storage blocked or full: keep the in-memory value.
  }
  emit();
}

export function subscribeThemeMode(listener: () => void) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    // key === null means another tab cleared storage entirely.
    if (event.key === THEME_MODE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getServerThemeMode(): ThemeMode {
  return "auto";
}
