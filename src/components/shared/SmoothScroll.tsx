"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { setGlobalLenis, getGlobalLenis, forceResetScrollLock } from "@/lib/scrollLock";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

  // Handle route changes: clean up scroll lock and handle scroll restoration
  useEffect(() => {
    forceResetScrollLock();

    // Check if there is a hash target on page load / route transition
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const timer = setTimeout(() => {
          const lenis = getGlobalLenis();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -80 });
          } else {
            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }, 180);
        return () => clearTimeout(timer);
      }
    } else {
      // If navigating to a fresh page without hash, reset scroll position
      const lenis = getGlobalLenis();
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname]);

  // Support browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const lenis = getGlobalLenis();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -80 });
          } else {
            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  return <>{children}</>;
}
