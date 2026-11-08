/**
 * Robust scroll-lock utility that coordinates with Lenis and browser window scrolling.
 * Preserves exact scroll position, prevents touch bleed on mobile, and pauses smooth-scroll engines.
 */

export interface LenisInstance {
  start: () => void;
  stop: () => void;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      force?: boolean;
      duration?: number;
      easing?: (t: number) => number;
    }
  ) => void;
  resize?: () => void;
  isStopped?: boolean;
}

declare global {
  interface Window {
    __lenis?: LenisInstance | null;
  }
}

let lockCount = 0;
let savedScrollY = 0;

export function getLenis(): LenisInstance | null {
  if (typeof window !== "undefined" && window.__lenis) {
    return window.__lenis;
  }
  return null;
}

export const getGlobalLenis = getLenis;

export function setGlobalLenis(instance: LenisInstance | null) {
  if (typeof window !== "undefined") {
    window.__lenis = instance;
  }
}

export function lockScroll() {
  if (typeof window === "undefined") return;

  if (lockCount === 0) {
    // 1. Capture current exact scroll offset
    savedScrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    // 2. Pause Lenis smooth-scroll engine
    const lenis = getLenis();
    if (lenis && typeof lenis.stop === "function") {
      try {
        lenis.stop();
      } catch (err) {
        console.warn("Could not pause Lenis:", err);
      }
    }

    // 3. Prevent scrollbar jump by calculating scrollbar width
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // 4. Lock both html and body at fixed offset
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  lockCount++;
}

export function unlockScroll() {
  if (typeof window === "undefined") return;

  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    const targetY = savedScrollY;

    // 1. Reset inline styles
    document.documentElement.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.overflow = "";
    document.body.style.overscrollBehavior = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.paddingRight = "";

    // 2. Restore exact window scroll position immediately
    window.scrollTo({ top: targetY, left: 0, behavior: "instant" });

    // 3. Resume Lenis smooth scroll and synchronize position with force: true
    const lenis = getLenis();
    if (lenis) {
      try {
        if (typeof lenis.scrollTo === "function") {
          lenis.scrollTo(targetY, { immediate: true, force: true });
        }
        if (typeof lenis.resize === "function") {
          lenis.resize();
        }
        if (typeof lenis.start === "function") {
          lenis.start();
        }
      } catch (err) {
        console.warn("Could not resume Lenis:", err);
      }
    }
  }
}

/**
 * Force cleanup of any lingering scroll locks upon route transitions
 */
export function forceResetScrollLock() {
  if (typeof window === "undefined") return;
  lockCount = 0;
  document.documentElement.style.overflow = "";
  document.documentElement.style.overscrollBehavior = "";
  document.body.style.overflow = "";
  document.body.style.overscrollBehavior = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.paddingRight = "";

  const lenis = getLenis();
  if (lenis && typeof lenis.start === "function") {
    try {
      lenis.start();
      lenis.resize?.();
    } catch {}
  }
}
