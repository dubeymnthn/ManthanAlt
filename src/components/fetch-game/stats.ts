import { STATS_STORAGE_KEY } from "./constants";
import { EMPTY_STATS, type PlayStats } from "./types";

const toCount = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;

/** Lifetime court counters from localStorage (private mode / blocked storage fall back to zero). */
export function loadStats(): PlayStats {
  try {
    const raw = window.localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATS };
    const parsed = JSON.parse(raw) as Partial<Record<keyof PlayStats, unknown>>;
    return {
      fetches: toCount(parsed.fetches),
      catches: toCount(parsed.catches),
      bestStreak: toCount(parsed.bestStreak),
    };
  } catch {
    return { ...EMPTY_STATS };
  }
}

export function saveStats(stats: PlayStats) {
  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage unavailable (private mode, quota): counters simply stay session-only.
  }
}

/** "7" -> "007" for the mono counters. */
export function padCount(value: number) {
  return String(Math.min(value, 999)).padStart(3, "0");
}
