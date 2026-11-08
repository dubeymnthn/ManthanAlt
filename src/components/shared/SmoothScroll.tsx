"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { setGlobalLenis, getGlobalLenis, forceResetScrollLock } from "@/lib/scrollLock";

const HASH_SCROLL_OFFSET = -80;

/**
 * Last scroll offset per URL (pathname + search). Next.js leaves back/forward scroll restoration to
 * the browser, which restores before the previous page has re-rendered (and clamps to the old page's
 * height), so restoration is handled here with `history.scrollRestoration = "manual"`.
 */
const scrollMemory = new Map<string, number>();

function getUrlKey() {
  return window.location.pathname + window.location.search;
}

function getHashTarget(): HTMLElement | null {
  const hash = window.location.hash;
  return hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
}

/** Instant jump that also cancels any smooth scroll still running from the previous page. */
function jumpTo(top: number) {
  const lenis = getGlobalLenis();
  if (lenis) {
    lenis.stop();
    lenis.start();
    lenis.resize?.();
    lenis.scrollTo(top, { immediate: true, force: true });
  } else {
    window.scrollTo({ top, left: 0, behavior: "instant" });
  }
}

function scrollToElement(target: HTMLElement) {
  const lenis = getGlobalLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: HASH_SCROLL_OFFSET });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + HASH_SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  /** URL key of the page currently on screen. */
  const routeKeyRef = useRef<string | null>(null);
  /** URL key a back/forward navigation is heading to (set by popstate). */
  const popTargetRef = useRef<string | null>(null);

  useEffect(() => {
    // Respect user preferences for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Do not instantiate heavy smooth scroll on mobile touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    setGlobalLenis(lenis);

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      setGlobalLenis(null);
      lenis.destroy();
    };
  }, []);

  // Route changes: release lingering scroll locks, then land on the remembered offset (back/forward),
  // the hash target (legacy "/#work" deep links on the homepage) or the top of the new page.
  useEffect(() => {
    forceResetScrollLock();

    const key = getUrlKey();
    const isHistoryTraversal = popTargetRef.current === key;
    popTargetRef.current = null;
    routeKeyRef.current = key;

    const savedTop = isHistoryTraversal ? scrollMemory.get(key) : undefined;
    if (savedTop !== undefined) {
      jumpTo(savedTop);
      // Layout that settles a frame later can leave the first jump short; retry once.
      const frame = requestAnimationFrame(() => {
        if (Math.abs(window.scrollY - savedTop) > 2) jumpTo(savedTop);
      });
      return () => cancelAnimationFrame(frame);
    }

    const hashTarget = getHashTarget();
    if (hashTarget) {
      const timer = setTimeout(() => scrollToElement(hashTarget), 180);
      return () => clearTimeout(timer);
    }

    jumpTo(0);
  }, [pathname]);

  // Back/forward bookkeeping and in-page hash links
  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const handleScroll = () => {
      const key = routeKeyRef.current;
      // Ignore scrolls while a modal pins the body, or once the URL already belongs to the next page.
      if (!key || key !== getUrlKey() || document.body.style.position === "fixed") return;
      scrollMemory.set(key, window.scrollY);
    };

    const handlePopState = () => {
      popTargetRef.current = getUrlKey();
    };

    const handleHashChange = () => {
      const hashTarget = getHashTarget();
      if (hashTarget) scrollToElement(hashTarget);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return <>{children}</>;
}
