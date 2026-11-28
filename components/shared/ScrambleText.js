"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/*
 * ScrambleText: the text starts as random glyphs and resolves left to right into `children`.
 * It runs once after mount. The real text is rendered by React (server HTML is correct), and the
 * scramble only rewrites the text node's content during the tween, then restores it exactly.
 * Reduced motion: the text is shown as-is.
 */
export function ScrambleText({ children, duration = 1.1, className }) {
  const ref = useRef(null);
  const text = String(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const state = { p: 0 };
    const tween = gsap.to(state, {
      p: 1,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        const settled = Math.floor(state.p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " " || i < settled) out += ch;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
      },
      onComplete: () => {
        el.textContent = text;
      },
    });

    return () => {
      tween.kill();
      el.textContent = text;
    };
  }, [text, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
