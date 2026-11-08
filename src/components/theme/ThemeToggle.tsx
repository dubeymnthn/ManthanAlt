"use client";

import { useState, type MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { getNextThemeMode, getTimeBasedTheme, type ThemeMode, type ThemeName } from "@/lib/theme";
import { soundManager } from "@/lib/sound";
import { useIsClient } from "./useIsClient";
import { useThemeMode } from "./useThemeMode";
import styles from "./ThemeToggle.module.scss";

const THEME_LABEL: Record<ThemeName, string> = { light: "Day", dark: "Night" };

function describeMode(mode: ThemeMode, resolved: ThemeName): string {
  return mode === "auto" ? `Auto (${THEME_LABEL[resolved]})` : THEME_LABEL[mode];
}

function describeAction(next: ThemeMode): string {
  return next === "auto" ? "Auto (follows local time)" : THEME_LABEL[next];
}

/**
 * Navbar day/night switch. Click cycle: Auto -> opposite of what is shown -> same as auto
 * (pinned) -> Auto, so the first click from Auto always changes the theme. The switch plays
 * a circular reveal from the button (instant under reduced motion / without View Transitions).
 */
export function ThemeToggle() {
  const isClient = useIsClient();
  const { mode, resolvedTheme, setMode } = useThemeMode();
  const [announcement, setAnnouncement] = useState("");

  // The theme is only known on the client: keep the navbar layout stable until then.
  if (!isClient) {
    return <span className={`${styles.toggle} ${styles.placeholder}`} aria-hidden="true" />;
  }

  const timeTheme = getTimeBasedTheme();
  const nextMode = getNextThemeMode(mode, resolvedTheme, timeTheme);
  const nextTheme: ThemeName = nextMode === "auto" ? timeTheme : nextMode;
  const label = `Theme: ${describeMode(mode, resolvedTheme)}. Switch to ${describeAction(nextMode)}`;
  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    soundManager.playClick();
    const rect = event.currentTarget.getBoundingClientRect();
    setMode(nextMode, {
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    });
    setAnnouncement(`Theme set to ${describeMode(nextMode, nextTheme)}`);
  };

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        onClick={handleClick}
        aria-label={label}
        title={label}
        data-theme-mode={mode}
      >
        <span key={resolvedTheme} className={styles.icon} aria-hidden="true">
          <Icon size={15} />
        </span>
        {mode === "auto" && (
          <span className={styles.autoBadge} aria-hidden="true">
            A
          </span>
        )}
      </button>
      <span className={styles.srOnly} role="status" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
