"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { ApolloDemoWidget } from "../game/ApolloDemoWidget";
import { Hero3DStage } from "./Hero3DStage";
import { Hero3DCard } from "./Hero3DCard";

gsap.registerPlugin(ScrollTrigger);

// Four steps really are a sequence, so they carry numbers.
const METHOD_STEPS = [
  {
    title: "Century anchor",
    desc: "Each century starts from a fixed anchor day. Learn four anchors and the 400-year cycle repeats.",
    formula: "1900s Wed · 2000s Tue",
    example: "1900s → Wednesday",
  },
  {
    title: "Year offset",
    desc: "Split the two-digit year into twelves and a remainder, add the parts, and reduce mod 7.",
    formula: "⌊y/12⌋ + (y % 12) + ⌊(y % 12)/4⌋",
    example: "1969 → Wed + 2 = Friday",
  },
  {
    title: "Month anchor",
    desc: "Certain dates in every month always fall on the year’s Doomsday. Use them as landmarks.",
    formula: "4/4 · 6/6 · 8/8 · 10/10 · 12/12",
    example: "July 11 (7/11) → Friday",
  },
  {
    title: "Modulo-7 shift",
    desc: "Count the days from the nearest anchor and reduce mod 7 to land on the weekday.",
    formula: "(target − anchor) mod 7",
    example: "July 20 (+9 days) → Sunday",
  },
];

const MODULES = [
  {
    title: "Lessons",
    desc: "Five short modules: century anchors, year offsets, month keys, and leap years.",
    href: "/learn",
    label: "Open the curriculum",
  },
  {
    title: "Practice",
    desc: "Relaxed study, a 10-date sprint, timed rounds, and strict accuracy runs.",
    href: "/practice",
    label: "Choose a mode",
  },
  {
    title: "Daily deck",
    desc: "The same ten dates for everyone each day. Build a streak by solving it.",
    href: "/daily",
    label: "Today’s deck",
  },
  {
    title: "Leaderboard",
    desc: "Earn XP for every date you solve. Results are stored on this device.",
    href: "/leaderboard",
    label: "View rankings",
  },
];

export function HomeClient() {
  const rootRef = useRef(null);
  const heroMouseRef = useRef({ x: 0, y: 0 });

  const handleHeroPointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    heroMouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  }, []);

  const handleHeroPointerLeave = useCallback(() => {
    heroMouseRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Reading progress along the top edge.
    // Every block below sits behind the reduced-motion query, so users who opt out get a static page.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-read-progress]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom bottom", scrub: 0.2 },
          }
        );

        // Split each hero line into characters so the headline rises letter by letter.
        // aria-label keeps the full phrase for screen readers; the letters are hidden from them.
        gsap.utils.toArray("[data-hero-line]", rootRef.current).forEach((line) => {
          // Strict Mode runs effects twice in development; split each line only once.
          if (line.dataset.split === "true") return;
          line.dataset.split = "true";

          const text = line.textContent;

          // Screen readers get the plain line; the split letters are hidden from them.
          const sr = document.createElement("span");
          sr.className = "sr-only";
          sr.textContent = text;

          const visual = document.createElement("span");
          visual.setAttribute("aria-hidden", "true");

          text.split(" ").forEach((word, wi, all) => {
            const wordEl = document.createElement("span");
            wordEl.className = "inline-block whitespace-nowrap";
            for (const ch of word) {
              const span = document.createElement("span");
              span.setAttribute("data-hero-char", "");
              span.className = "inline-block";
              span.textContent = ch;
              wordEl.appendChild(span);
            }
            visual.appendChild(wordEl);
            if (wi < all.length - 1) visual.appendChild(document.createTextNode(" "));
          });

          line.textContent = "";
          line.append(sr, visual);
        });

        // The one orchestrated moment: a single page-load sequence.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero-eyebrow]", { y: 12, opacity: 0, duration: 0.5 })
          .from("[data-hero-char]", { yPercent: 110, duration: 0.8, stagger: 0.022, ease: "power4.out" }, "-=0.25")
          .from("[data-hero-copy]", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")
          .from("[data-hero-demo]", { y: 24, opacity: 0, duration: 0.8 }, "-=0.45");
      }, rootRef);

      return () => ctx.revert();
    });

    // Desktop: the method section pins and the active step follows scroll.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const rows = gsap.utils.toArray("[data-method-row]");
        const examples = gsap.utils.toArray("[data-method-example]");

        gsap.set(rows, { opacity: 0.3 });
        gsap.set(rows[0], { opacity: 1 });
        gsap.set(examples, { opacity: 0, y: 8 });
        gsap.set(examples[0], { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-method-section]",
            start: "top top",
            end: "+=1200",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        tl.fromTo("[data-method-progress]", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: rows.length - 1 }, 0);

        for (let i = 1; i < rows.length; i++) {
          const at = i - 1;
          tl.to(rows[i - 1], { opacity: 0.3, duration: 0.45, ease: "power2.out" }, at)
            .to(rows[i], { opacity: 1, duration: 0.45, ease: "power2.out" }, at)
            .to(examples[i - 1], { opacity: 0, y: -8, duration: 0.3, ease: "power2.in" }, at)
            .to(examples[i], { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, at + 0.2);
        }
      }, rootRef);

      return () => ctx.revert();
    });

    // Mobile and tablet: the method steps arrive once, in order.
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-method-row]", {
          y: 16,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-method-list]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }, rootRef);

      return () => ctx.revert();
    });

    // Scroll-triggered reveal: each [data-reveal] block fades and rises once when it enters the viewport.
    // Motion only; content is fully visible with reduced motion or without JavaScript.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray("[data-reveal]", rootRef.current).forEach((el) => {
          gsap.from(el, {
            y: 28,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }, rootRef);

      return () => ctx.revert();
    });

    // Headings wipe in from the bottom edge as they enter, and reverse on the way back up.
    // Clip only (no transform), so it does not stack with the block reveals above.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray("h2", rootRef.current).forEach((h) => {
          gsap.fromTo(
            h,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% -12% 0%)",
              duration: 1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: h,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }, rootRef);

      return () => ctx.revert();
    });

    // Worked-example panel drifts against scroll, so the page feels layered rather than flat.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-method-panel]",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-method-section]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }, rootRef);

      return () => ctx.revert();
    });

    // Magnetic CTA: the element leans toward the pointer and springs back on leave. Fine pointers only.
    mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const cleanups = [];
      gsap.utils.toArray("[data-magnetic]", rootRef.current).forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });

        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.25);
          yTo((e.clientY - r.top - r.height / 2) * 0.25);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    });

    // Custom cursor: a ring that follows the pointer, grows over links and buttons. Fine pointers only.
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const cursor = rootRef.current?.querySelector("[data-cursor]");
      if (!cursor) return;
      cursor.style.display = "block";

      const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const onOver = (e) => {
        if (e.target.closest?.("a,button")) gsap.to(cursor, { scale: 2.4, duration: 0.3, ease: "power2.out" });
      };
      const onOut = (e) => {
        if (e.target.closest?.("a,button")) gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
      };

      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        cursor.style.display = "none";
      };
    });

    // Scroll-velocity ticker: the closing band's kinetic strip speeds up and skews with scroll speed.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const track = rootRef.current?.querySelector("[data-velocity-track]");
      if (!track) return;
      const ctx = gsap.context(() => {
        const loop = gsap.to(track, { xPercent: -50, duration: 24, repeat: -1, ease: "none" });
        const skew = gsap.quickTo(track, "skewX", { duration: 0.4, ease: "power3.out" });

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const v = self.getVelocity();
            skew(gsap.utils.clamp(-6, 6, v / 300));
            loop.timeScale(gsap.utils.clamp(1, 4, 1 + Math.abs(v) / 800) * (self.direction === -1 ? -1 : 1));
          },
        });
      }, rootRef);

      return () => ctx.revert();
    });

    // Scrubbed word reveal: each word of the method intro lights up as the reader scrolls through it.
    // Split once (guarded for Strict Mode), and only with motion allowed; otherwise the text is already visible.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const para = rootRef.current?.querySelector("[data-scrub-para]");
      const src = para?.querySelector("[data-scrub-text]");
      if (!para || !src) return;

      if (para.dataset.split !== "true") {
        para.dataset.split = "true";
        const words = src.textContent.split(" ");
        src.textContent = "";
        words.forEach((w, i) => {
          const s = document.createElement("span");
          s.setAttribute("data-scrub-word", "");
          s.className = "inline-block text-shade-40";
          s.textContent = w;
          src.appendChild(s);
          if (i < words.length - 1) src.appendChild(document.createTextNode(" "));
        });
      }

      const ctx = gsap.context(() => {
        const wordEls = gsap.utils.toArray("[data-scrub-word]", para);
        gsap.fromTo(
          wordEls,
          { color: "rgba(161,161,170,0.18)" },
          {
            color: "rgba(255,255,255,1)",
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: para,
              start: "top 85%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          }
        );
      }, rootRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen bg-black text-white">
      <div
        aria-hidden="true"
        data-cursor
        style={{ display: "none" }}
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-[14px] -mt-[14px] h-7 w-7 rounded-full border border-white/80 bg-white/10"
      />

      <div
        aria-hidden="true"
        data-read-progress
        className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-emerald-400"
      />

      {/* HERO: the interactive demo is the memorable element */}
      <section
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
        className="relative overflow-hidden border-b border-hairline-dark"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Hero3DStage mouseRef={heroMouseRef} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_25%_50%,rgba(0,0,0,0.88)_0%,transparent_75%)]"
        />
        <Container className="relative z-10 max-w-7xl py-20 md:py-28 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col items-start gap-7 lg:col-span-6">
              <p data-hero-eyebrow className="inline-flex w-fit self-start items-center rounded-sm border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.14em] leading-none text-shade-30">
                <span aria-hidden="true" className="mr-2.5 inline-block h-1.5 w-1.5 bg-white/70" />Conway’s Doomsday Rule
              </p>

              <h1 className="display-xl font-heading font-light leading-[1.02] text-balance text-white">
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block">
                    Know the day
                  </span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block">
                    without checking
                  </span>
                </span>
              </h1>

              <p data-hero-copy className="max-w-prose text-base leading-relaxed text-shade-30 sm:text-lg">
                Work out the weekday of any date in history in your head, in seconds, using John Conway’s anchor-day method.
              </p>

              <div data-hero-copy className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button asChild variant="primary" size="lg" className="px-8">
                  <Link href="/learn" data-magnetic>Start learning</Link>
                </Button>
                <Button asChild variant="outline-on-dark" size="lg" className="px-7">
                  <Link href="/practice">Practice arenas</Link>
                </Button>
              </div>
            </div>

            <div data-hero-demo className="w-full max-w-lg lg:col-span-6 lg:justify-self-end">
              <Hero3DCard>
                <ApolloDemoWidget />
              </Hero3DCard>
            </div>
          </div>
        </Container>
      </section>

      {/* METHOD: a true sequence, so the steps are numbered */}
      <section data-method-section className="border-b border-hairline-dark py-24 md:py-32">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div data-reveal className="flex flex-col gap-6 lg:col-span-5">
              <p className="inline-flex w-fit self-start items-center rounded-sm border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.14em] leading-none text-shade-30"><span aria-hidden="true" className="mr-2.5 inline-block h-1.5 w-1.5 bg-white/70" />The method</p>
              <h2 className="display-lg font-heading font-light leading-tight text-balance text-white">
                Four steps, one habit
              </h2>
              <p className="max-w-md text-base leading-relaxed text-shade-30" data-scrub-para>
                <span data-scrub-text>You do not need a good memory. Any date reduces to four small additions taken mod 7.</span>
              </p>

              <div className="hidden items-stretch gap-4 pt-4 lg:flex">
                <div className="relative w-px shrink-0 overflow-hidden bg-hairline-dark">
                  <div data-method-progress className="absolute inset-0 origin-top bg-emerald-400" />
                </div>
                <div data-method-panel className="flex min-h-16 flex-1 flex-col justify-center rounded-xl border border-hairline-dark bg-canvas-night-elevated px-5 py-3">
                  <span className="text-xs text-shade-40">Worked example · July 20, 1969</span>
                  <div className="relative mt-1 h-6">
                    {METHOD_STEPS.map((step) => (
                      <span
                        key={step.title}
                        data-method-example
                        className="absolute inset-0 flex items-center text-sm tabular-nums text-white"
                      >
                        {step.example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ol data-method-list className="divide-y divide-hairline-dark border-t border-hairline-dark lg:col-span-7">
              {METHOD_STEPS.map((step, i) => (
                <li
                  key={step.title}
                  data-method-row
                  className="flex flex-col gap-4 py-7 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex items-start gap-5">
                    <span className="pt-1 text-sm tabular-nums text-emerald-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-heading text-lg text-white">{step.title}</h3>
                      <p className="max-w-md text-sm leading-relaxed text-shade-30">{step.desc}</p>
                    </div>
                  </div>
                  <code className="shrink-0 self-start rounded-lg border border-hairline-dark bg-canvas-night-elevated px-3 py-1.5 text-xs tabular-nums text-shade-30">
                    {step.formula}
                  </code>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Scroll-velocity strip: moves with scroll speed; decorative, so hidden from assistive tech */}
      <div aria-hidden="true" className="overflow-hidden border-b border-hairline-dark py-5 select-none">
        <div data-velocity-track className="flex w-max items-center gap-10 whitespace-nowrap text-sm text-shade-40">
          {[0, 1].map((dup) =>
            ["Know the day", "Without checking", "Four steps, one habit", "Four places to practice"].map((label) => (
              <span key={`${dup}-${label}`} className="flex items-center gap-10">
                {label}
                <span className="h-1 w-1 rounded-full bg-white/40" />
              </span>
            ))
          )}
        </div>
      </div>

      {/* PLACES TO PRACTISE: a plain ruled list, no decorative cards */}
      <section className="border-b border-hairline-dark py-24 md:py-32">
        <Container className="max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div data-reveal className="space-y-4 lg:col-span-4">
              <p className="inline-flex w-fit self-start items-center rounded-sm border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.14em] leading-none text-shade-30"><span aria-hidden="true" className="mr-2.5 inline-block h-1.5 w-1.5 bg-white/70" />Train</p>
              <h2 className="display-lg font-heading font-light leading-tight text-balance text-white">
                Four places to practice
              </h2>
            </div>

            <ul data-reveal className="divide-y divide-hairline-dark border-y border-hairline-dark lg:col-span-8">
              {MODULES.map((m) => (
                <li key={m.title}>
                  <Link
                    href={m.href}
                    className="group grid grid-cols-1 gap-2 px-1 py-7 transition-colors duration-200 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                  >
                    <span className="font-heading text-xl text-white sm:col-span-4">{m.title}</span>
                    <span className="text-sm leading-relaxed text-shade-30 sm:col-span-5">{m.desc}</span>
                    <span className="flex items-center gap-2 text-sm text-shade-40 transition-colors duration-200 group-hover:text-white sm:col-span-3 sm:justify-end">
                      {m.label}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* CLOSING */}
      <section className="py-24 md:py-32">
        <Container className="max-w-7xl">
          <div data-reveal className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-4">
              <h2 className="display-lg font-heading font-light leading-tight text-balance text-white">
                Train your calendar brain
              </h2>
              <p className="text-base leading-relaxed text-shade-40">
                No account needed. Start with the first lesson, or go straight to a relaxed round.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="primary" size="lg" className="px-8">
                <Link href="/learn" data-magnetic>Start the first lesson</Link>
              </Button>
              <Button asChild variant="outline-on-dark" size="lg" className="px-7">
                <Link href="/practice/relaxed">Relaxed round</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
