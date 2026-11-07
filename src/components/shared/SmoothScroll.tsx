"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setGlobalLenis } from "@/lib/scrollLock";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}
