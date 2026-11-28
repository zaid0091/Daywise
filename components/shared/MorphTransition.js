"use client";

// Morphing SVG transition, inspired by Codrops "MorphingPageTransition"
// (https://github.com/codrops/MorphingPageTransition): an SVG path morphs while the page moves up.
// Implementation written for this project. Three wave layers, plus a destination label that
// fades in over the wave while the new route loads.

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

const W = 1440;
const H = 800;
const LEAD = "#A7F3D0";
const FRONT = "#34D399";
const BACK = "#059669";

const LABELS = {
  "/learn": "Learn",
  "/practice": "Practice",
  "/daily": "Daily deck",
  "/leaderboard": "Leaderboard",
  "/profile": "Profile",
  "/settings": "Settings",
  "/about": "About the method",
};

function labelFor(path) {
  if (LABELS[path]) return LABELS[path];
  const seg = path.split("/").filter(Boolean)[0];
  return seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : "Daywise";
}

// Top edge is a two-bulge wave. `wave` sets how far each bulge travels; 0 is flat.
function shape(top, bottom, wave) {
  const mid = W / 2;
  return [
    `M0 ${top}`,
    `C ${W * 0.25} ${top - wave}, ${W * 0.25} ${top + wave}, ${mid} ${top}`,
    `C ${W * 0.75} ${top - wave}, ${W * 0.75} ${top + wave}, ${W} ${top}`,
    `L ${W} ${bottom} L 0 ${bottom} Z`,
  ].join(" ");
}

const resting = () => ({ top: H, bottom: H, wave: 0 });

export function MorphTransition() {
  const leadRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const labelRef = useRef(null);
  const lead = useRef(resting());
  const front = useRef(resting());
  const back = useRef(resting());
  const pendingRef = useRef(null);
  const timeoutRef = useRef(null);
  const tlRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const draw = () => {
    const set = (el, s) => el?.setAttribute("d", shape(s.top, s.bottom, s.wave));
    set(leadRef.current, lead.current);
    set(frontRef.current, front.current);
    set(backRef.current, back.current);
  };

  const reset = () => {
    Object.assign(lead.current, resting());
    Object.assign(front.current, resting());
    Object.assign(back.current, resting());
    if (labelRef.current) {
      gsap.set(labelRef.current, { opacity: 0, y: 12 });
    }
    draw();
  };

  useEffect(() => {
    draw();
  }, []);

  // Intercept plain left-clicks to other pages on this site.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (reduce.matches || pendingRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const target = url.pathname + url.search + url.hash;
      pendingRef.current = target;

      tlRef.current?.kill();
      reset();

      if (labelRef.current) labelRef.current.textContent = labelFor(url.pathname);

      const tl = gsap.timeline({ onUpdate: draw, onComplete: () => router.push(target) });
      tl.to(lead.current, { top: 0, wave: 140, duration: 0.9, ease: "expo.inOut" }, 0)
        .to(front.current, { top: 0, wave: 120, duration: 1, ease: "expo.inOut" }, 0.08)
        .to(back.current, { top: 0, wave: 90, duration: 1.05, ease: "expo.inOut" }, 0.16)
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.5)
        .to([lead.current, front.current, back.current], { wave: 0, duration: 0.4, ease: "sine.out" }, ">-0.1");
      tlRef.current = tl;

      // Safety net: if the route never changes, clear the bands so the page stays usable.
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (pendingRef.current) {
          pendingRef.current = null;
          tlRef.current?.kill();
          reset();
        }
      }, 5000);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // New route rendered: the label fades out first, then the bands carry the page up and off the top.
  useEffect(() => {
    if (!pendingRef.current) return;
    pendingRef.current = null;
    clearTimeout(timeoutRef.current);

    tlRef.current?.kill();
    for (const s of [lead.current, front.current, back.current]) {
      Object.assign(s, { top: 0, bottom: H, wave: 0 });
    }
    draw();

    const tl = gsap.timeline({ onUpdate: draw, onComplete: reset });
    tl.to(labelRef.current, { opacity: 0, y: -12, duration: 0.35, ease: "power2.in" }, 0)
      .to([lead.current, front.current, back.current], { wave: 130, duration: 0.3, ease: "sine.in" }, 0)
      .to(lead.current, { top: -H, bottom: -H, wave: 0, duration: 1.05, ease: "expo.inOut" }, 0.2)
      .to(front.current, { top: -H, bottom: -H, wave: 0, duration: 1.1, ease: "expo.inOut" }, 0.3)
      .to(back.current, { top: -H, bottom: -H, wave: 0, duration: 1.15, ease: "expo.inOut" }, 0.4);
    tlRef.current = tl;

    return () => tl.kill();
  }, [pathname]);

  return (
    <>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
      >
        <path ref={backRef} fill={BACK} />
        <path ref={frontRef} fill={FRONT} />
        <path ref={leadRef} fill={LEAD} />
      </svg>
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[91] flex items-center justify-center font-heading text-4xl font-light tracking-tight text-black md:text-6xl"
        style={{ opacity: 0 }}
      />
    </>
  );
}
