import { flushSync } from "react-dom";
import { THEME_ATTRIBUTE, type ThemeName } from "@/lib/theme";

export interface RevealOrigin {
  x: number;
  y: number;
}

/** Set on <html> while the reveal runs; globals.scss freezes CSS transitions under it. */
const SWITCHING_ATTRIBUTE = "data-theme-switching";
const REVEAL_DURATION_MS = 560;
const REVEAL_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function canAnimateReveal(): boolean {
  if (typeof document === "undefined" || typeof document.startViewTransition !== "function") {
    return false;
  }
  if (document.visibilityState !== "visible") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Switches the theme with a circular clip-path reveal that grows from `origin` to the
 * farthest viewport corner (View Transitions API). Falls back to an instant switch when
 * the API is missing, the tab is hidden or the visitor prefers reduced motion.
 *
 * `apply` must perform the React state updates (mode + next-themes setTheme); it runs
 * inside flushSync so the new snapshot is captured with the new theme.
 */
export function runThemeReveal(target: ThemeName, apply: () => void, origin: RevealOrigin) {
  if (!canAnimateReveal()) {
    apply();
    return;
  }

  const root = document.documentElement;
  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const commit = () => {
    flushSync(apply);
    // next-themes applies the attribute from an effect; set it here as well so the
    // captured "new" state is guaranteed to be the target theme.
    root.setAttribute(THEME_ATTRIBUTE, target);
    root.style.colorScheme = target;
  };

  root.setAttribute(SWITCHING_ATTRIBUTE, "");
  const cleanup = () => root.removeAttribute(SWITCHING_ATTRIBUTE);

  let transition: ViewTransition;
  try {
    transition = document.startViewTransition(commit);
  } catch {
    cleanup();
    apply();
    return;
  }

  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
        },
        {
          duration: REVEAL_DURATION_MS,
          easing: REVEAL_EASING,
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {
      // Transition skipped (e.g. superseded by a newer one): the update still ran.
    });

  transition.finished.then(cleanup, cleanup);
}
