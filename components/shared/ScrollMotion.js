"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * ScrollMotion: scoped, reduced-motion-aware scroll choreography for server-rendered pages.
 * Everything is created inside useGSAP with a scope, so unmounting reverts all tweens and triggers.
 * Only transform and opacity are animated.
 *
 * Hooks inside `children`:
 *   [data-reveal-section]  section whose [data-reveal] children fade and rise once on enter
 *   [data-card-batch]      cards revealed in batches via ScrollTrigger.batch
 *   [data-calc-section]    section whose [data-calc-step] items highlight in order, scrubbed to scroll
 *
 * progress: renders a fixed hairline scrubbed across the whole page.
 */
export function ScrollMotion({ children, className, progress = false }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (progress) {
          gsap.fromTo(
            root.querySelector("[data-read-progress]"),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.2 },
            }
          );
        }

        root.querySelectorAll("[data-reveal-section]").forEach((section) => {
          const items = section.querySelectorAll("[data-reveal]");
          if (!items.length) return;

          gsap.from(items, {
            y: 28,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "transform",
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          });
        });

        const cards = gsap.utils.toArray("[data-card-batch]", root);
        if (cards.length) {
          gsap.set(cards, { y: 40, autoAlpha: 0, scale: 0.98 });
          ScrollTrigger.batch(cards, {
            start: "top 88%",
            once: true,
            batchMax: 4,
            onEnter: (batch) =>
              gsap.to(batch, {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.12,
                overwrite: true,
                clearProps: "transform",
              }),
          });
        }

        const calcSection = root.querySelector("[data-calc-section]");
        const steps = calcSection ? gsap.utils.toArray("[data-calc-step]", calcSection) : [];
        if (calcSection && steps.length > 1) {
          // Step 1 starts active; the highlight then walks one step per segment of scroll.
          gsap.set(steps, { opacity: 0.3, x: 0 });
          gsap.set(steps[0], { opacity: 1, x: 6 });

          const walk = gsap.timeline({
            scrollTrigger: {
              trigger: calcSection,
              start: "top 75%",
              // Tied to the section's own height, so every step gets scroll room on any screen size.
              end: () => `+=${Math.max(300, calcSection.offsetHeight)}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          steps.slice(1).forEach((step, i) => {
            walk
              .to(steps[i], { opacity: 0.3, x: 0, duration: 0.4, ease: "power2.out" }, i)
              .to(step, { opacity: 1, x: 6, duration: 0.4, ease: "power2.out" }, i);
          });
        }
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      {progress && (
        <div
          aria-hidden="true"
          data-read-progress
          className="fixed top-0 left-0 right-0 h-[2px] bg-emerald-400 origin-left scale-x-0 z-[60] pointer-events-none"
        />
      )}
      <div className={className}>{children}</div>
    </div>
  );
}
