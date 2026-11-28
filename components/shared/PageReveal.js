"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * PageReveal: the scroll reveal from the home page, applied to a page's content.
 * These pages render their content after a mount check, so the reveal waits for the blocks
 * to appear (MutationObserver), then animates the outermost blocks once each, in both scroll
 * directions. Motion is off for reduced-motion users; their content is visible as normal.
 * Blocks marked data-no-reveal are skipped.
 */

const BLOCK_SELECTOR = "section, header, article, table, ul, ol, [class*='rounded-2xl']";

function outermost(nodes) {
  return nodes.filter((el) => !nodes.some((other) => other !== el && other.contains(el)));
}

export function PageReveal({ children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    let ctx = null;
    let observer = null;
    let done = false;

    const setup = () => {
      if (done) return;
      const blocks = outermost(
        Array.from(root.querySelectorAll(BLOCK_SELECTOR)).filter((el) => !el.closest("[data-no-reveal]"))
      );
      if (blocks.length === 0) return;
      done = true;
      observer?.disconnect();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ctx = gsap.context(() => {
          blocks.forEach((el) => {
            gsap.from(el, {
              y: 28,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            });
          });
        }, root);
      });
    };

    setup();
    if (!done) {
      observer = new MutationObserver(setup);
      observer.observe(root, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      ctx?.revert();
      mm.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
