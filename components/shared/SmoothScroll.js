"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      // Ultra-low lerp (0.05) for maximum fluid glide and silky momentum decay
      lerp: 0.05,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8, // High-precision damping for scroll wheel notches
      touchMultiplier: 1.5, // Natural, organic trackpad response
      syncTouch: true,      // Synchronize touch devices and trackpads with Lenis physics
      syncTouchLerp: 0.08,  // Snappy responsive tracking on touch devices
      infinite: false,
    });

    lenisRef.current = lenis;

    // requestAnimationFrame scroll loop
    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Ensure scroll is reset to the top immediately upon page transitions
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
