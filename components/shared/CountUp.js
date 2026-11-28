"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const FORMAT = new Intl.NumberFormat("en-US");

/*
 * CountUp: tweens a number from its previous value to `value` once it scrolls into view.
 * Writes the text directly (no React state per frame), so it does not re-render while counting.
 * Reduced motion: shows the final value immediately.
 */
export function CountUp({ value, duration = 1.4, className, suffix = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = Number(value) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      el.textContent = FORMAT.format(target) + suffix;
      return;
    }

    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: target,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = FORMAT.format(Math.round(state.n)) + suffix;
      },
      scrollTrigger: undefined,
    });

    return () => tween.kill();
  }, [value, duration, suffix]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {FORMAT.format(Number(value) || 0) + suffix}
    </span>
  );
}
