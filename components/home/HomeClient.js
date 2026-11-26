"use client";

import React, { useEffect, useRef } from "react";
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

const METHODOLOGY_STEPS = [
  {
    num: "01",
    title: "Century anchors",
    desc: "Memorize four repeating anchor days that cycle every 400 years.",
    formula: "1900s Wed · 2000s Tue",
    example: "1900s → Wednesday",
  },
  {
    num: "02",
    title: "Year offset drift",
    desc: "Divide the two-digit year by 12 to find how many weekdays it shifts.",
    formula: "⌊y/12⌋ + (y%12) + ⌊(y%12)/4⌋",
    example: "1969 → Wed + 2 = Friday",
  },
  {
    num: "03",
    title: "Month anchor keys",
    desc: "Lock onto symmetric calendar dates that always land on the year's Doomsday.",
    formula: "4/4 · 6/6 · 8/8 · 10/10 · 12/12",
    example: "July 11 (7/11) → Friday",
  },
  {
    num: "04",
    title: "Modulo-7 shift",
    desc: "Count the offset from the nearest month anchor modulo 7 to land on the weekday.",
    formula: "(target − anchor) mod 7",
    example: "July 20 (+2) → Sunday",
  },
];

const TICKER_ITEMS = [
  "4/4",
  "6/6",
  "8/8",
  "10/10",
  "12/12",
  "7/11",
  "9/5",
  "MOD 7",
  "1900s WED",
  "2000s TUE",
];

const SAMPLE_DECK = [
  { date: "1776-07-04", display: "July 4, 1776", label: "US Declaration", day: "Thu" },
  { date: "1918-11-11", display: "Nov 11, 1918", label: "WW1 Armistice", day: "Mon" },
  { date: "2100-01-01", display: "Jan 1, 2100", label: "Century Shift", day: "Fri" },
];

const VELOCITY_METRICS = [
  { label: "XP level", value: "Level 1", sub: "Novice apprentice" },
  { label: "Active streak", value: "0 days", sub: "Daily habit" },
  { label: "Accuracy goal", value: "95%+", sub: "Target threshold" },
  { label: "Speed sprint", value: "< 2.0 s", sub: "Reflex benchmark" },
];

const MODULES = [
  {
    num: "01",
    tag: "Curriculum",
    title: "Interactive lessons",
    desc: "Five structured modules covering century anchors, year drift, month keys, and leap-year rules.",
    href: "/learn",
    cta: "Open curriculum",
  },
  {
    num: "02",
    tag: "Drills",
    title: "Practice arenas",
    desc: "Relaxed study, 10-question sprints, 30/60/120 s countdowns, and strict accuracy runs.",
    href: "/practice",
    cta: "Enter arenas",
  },
  {
    num: "03",
    tag: "Seeded",
    title: "Daily challenge",
    desc: "Calculate a deterministic 10-date historical deck every 24 hours and build your streak.",
    href: "/daily",
    cta: "Start today's deck",
  },
  {
    num: "04",
    tag: "Benchmarks",
    title: "Offline leaderboard",
    desc: "Earn XP for every date solved and benchmark your solve latency against reference trainees.",
    href: "/leaderboard",
    cta: "View rankings",
  },
];

export function HomeClient() {
  const rootRef = useRef(null);
  const heroMouseRef = useRef({ x: 0, y: 0 });

  const handleHeroPointerMove = React.useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    heroMouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  }, []);

  const handleHeroPointerLeave = React.useCallback(() => {
    heroMouseRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Shared motion choreography for all viewports when reduced-motion is off
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // 0. Top Scroll Progress Hairline
        gsap.fromTo(
          "[data-scroll-progress]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.1,
            },
          }
        );

        // 1. Hero Entrance Choreography (masked headline lines + 3D card)
        const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
        heroTl
          .from("[data-hero-eyebrow]", { y: 12, opacity: 0, duration: 0.5 })
          .from("[data-hero-line]", { yPercent: 110, duration: 0.9, stagger: 0.1 }, "-=0.3")
          .from(
            "[data-hero-fade]",
            { y: 16, opacity: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" },
            "-=0.45"
          )
          .from(
            "[data-hero-card]",
            { y: 28, scale: 0.96, opacity: 0, duration: 0.85, ease: "power3.out" },
            "-=0.65"
          );

        // Hero Scroll-Out Curtain (recedes as next section glides up)
        gsap.to("[data-hero-stage]", {
          scale: 1.1,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero-section]",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to("[data-hero-content]", {
          y: -56,
          scale: 0.97,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero-section]",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // 2. Kinetic Velocity-Reactive Formula Ticker
        const tickerTrack = rootRef.current?.querySelector("[data-ticker-track]");
        if (tickerTrack) {
          const tickerTween = gsap.to(tickerTrack, {
            xPercent: -50,
            repeat: -1,
            duration: 28,
            ease: "none",
          });

          const skewSetter = gsap.quickTo(tickerTrack, "skewX", {
            duration: 0.35,
            ease: "power3.out",
          });

          ScrollTrigger.create({
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              const vel = self.getVelocity();
              const clampedSkew = gsap.utils.clamp(-8, 8, vel / 280);
              const speedBoost = gsap.utils.clamp(1, 3.2, 1 + Math.abs(vel) / 900);
              skewSetter(clampedSkew);
              gsap.to(tickerTween, {
                timeScale: self.direction === -1 ? -speedBoost : speedBoost,
                duration: 0.25,
                overwrite: true,
              });
            },
          });
        }

        // 3. Training Suite — Clip-Path Curtain & Metric Stagger
        gsap.from("[data-suite-header]", {
          y: 24,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-suite-section]",
            start: "top 80%",
            once: true,
          },
        });

        gsap.from("[data-suite-card]", {
          clipPath: "inset(12% 0% 0% 0%)",
          y: 36,
          opacity: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-suite-grid]",
            start: "top 82%",
            once: true,
          },
        });

        gsap.from("[data-deck-row]", {
          y: 14,
          opacity: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-suite-grid]",
            start: "top 72%",
            once: true,
          },
        });

        gsap.from("[data-metric-cell]", {
          y: 14,
          opacity: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-suite-grid]",
            start: "top 72%",
            once: true,
          },
        });

        // 4. Modules — Mobile Reveal (Desktop uses pinned horizontal track below)
        gsap.from("[data-modules-border]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: "[data-modules-section]",
            start: "top 85%",
            once: true,
          },
        });

        // 5. Closing Band — Masked Headline Rise
        gsap.from("[data-cta-line]", {
          yPercent: 110,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-cta-section]",
            start: "top 84%",
            once: true,
          },
        });

        gsap.from("[data-cta-fade]", {
          y: 16,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-cta-section]",
            start: "top 82%",
            once: true,
          },
        });
      }, rootRef);

      return () => ctx.revert();
    });

    // Desktop-only Pinned Scrubbed Method Stage (Lando-style scroll storytelling)
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const rows = gsap.utils.toArray("[data-method-row]");
        const examples = gsap.utils.toArray("[data-method-example]");

        // Initialize: step 01 active, 02-04 dimmed
        gsap.set(rows, { opacity: 0.28, x: 0 });
        gsap.set(rows[0], { opacity: 1, x: 8 });
        gsap.set(examples, { opacity: 0, y: 8 });
        gsap.set(examples[0], { opacity: 1, y: 0 });

        const methodTl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-method-section]",
            start: "top top",
            end: "+=1350",
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
          },
        });

        // Scrub vertical progress bar along the left rail
        methodTl.fromTo(
          "[data-method-progress]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", duration: 3 },
          0
        );

        // Step transitions across 3 equal scroll segments (0->1, 1->2, 2->3)
        for (let i = 1; i < rows.length; i++) {
          const at = i - 1;
          methodTl
            .to(rows[i - 1], { opacity: 0.28, x: 0, duration: 0.45, ease: "power2.out" }, at)
            .to(rows[i], { opacity: 1, x: 8, duration: 0.45, ease: "power2.out" }, at)
            .to(examples[i - 1], { opacity: 0, y: -8, duration: 0.3, ease: "power2.in" }, at)
            .to(examples[i], { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, at + 0.2);
        }

        // Lando-style Pinned Horizontal Scroll Track for 03 / Modules
        const track = rootRef.current?.querySelector("[data-modules-track]");
        const trackWrap = rootRef.current?.querySelector("[data-modules-section]");
        if (track && trackWrap) {
          const getDistance = () => Math.max(0, track.scrollWidth - trackWrap.clientWidth + 96);

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: trackWrap,
              start: "top top",
              end: () => `+=${Math.max(900, getDistance() * 1.1)}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          gsap.fromTo(
            "[data-modules-progress]",
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: trackWrap,
                start: "top top",
                end: () => `+=${Math.max(900, getDistance() * 1.1)}`,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }, rootRef);

      return () => ctx.revert();
    });

    // Mobile-only Method row reveal (no pinning on small screens)
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-method-row]", {
          y: 22,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-method-list]",
            start: "top 82%",
            once: true,
          },
        });
      }, rootRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-black text-white min-h-screen relative">
      {/* Top Scroll Progress Hairline */}
      <div
        aria-hidden="true"
        data-scroll-progress
        className="fixed top-0 left-0 right-0 h-[2px] bg-emerald-400 origin-left z-[60] pointer-events-none scale-x-0"
      />

      {/* 1. HERO — Full-Viewport Nocturnal Perpetual-Calendar Split */}
      <section
        data-hero-section
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
        className="relative min-h-[calc(100vh-56px)] flex items-center py-16 md:py-24 border-b border-white/[0.08] overflow-hidden"
      >
        <div data-hero-stage className="absolute inset-0 pointer-events-none">
          <Hero3DStage mouseRef={heroMouseRef} />
        </div>

        {/* Readability Radial Vignette on Left Text Column */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_25%_50%,rgba(0,0,0,0.88)_0%,transparent_75%)] pointer-events-none"
        />

        <Container className="relative z-10 max-w-7xl">
          <div data-hero-content className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left gap-6">
              <span data-hero-eyebrow className="text-xs font-mono text-shade-40">
                Conway&apos;s Doomsday Rule
              </span>

              <h1 className="display-xl lg:display-xxl text-white tracking-tight leading-[1.02] select-none font-heading font-normal">
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block">
                    Know the day
                  </span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block text-emerald-400">
                    Without checking
                  </span>
                </span>
              </h1>

              <p data-hero-fade className="text-base sm:text-lg text-shade-40 max-w-xl leading-relaxed">
                Calculate the weekday for any date in history mentally in seconds using John Conway&apos;s anchor-day algorithm.
              </p>

              <div data-hero-fade className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
                <Button asChild variant="primary" size="lg" className="w-full sm:w-auto px-8">
                  <Link href="/learn" className="flex items-center justify-center gap-2">
                    Start learning <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                </Button>
                <Button asChild variant="outline-on-dark" size="lg" className="w-full sm:w-auto px-7 border-white/15 hover:border-white/30">
                  <Link href="/practice" className="flex items-center justify-center gap-2">
                    Practice arenas
                  </Link>
                </Button>
              </div>
            </div>

            <div data-hero-card className="lg:col-span-6 xl:col-span-5 w-full flex justify-center lg:justify-end">
              <Hero3DCard>
                <ApolloDemoWidget />
              </Hero3DCard>
            </div>
          </div>
        </Container>
      </section>

      {/* KINETIC VELOCITY-REACTIVE ANCHOR TICKER */}
      <div
        aria-hidden="true"
        className="border-b border-white/[0.08] bg-[#050505] py-3.5 overflow-hidden select-none"
      >
        <div data-ticker-track className="flex items-center whitespace-nowrap w-max will-change-transform">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-8 pr-8">
              {TICKER_ITEMS.map((item, idx) => (
                <span key={`${dup}-${idx}`} className="flex items-center gap-8">
                  <span className="font-mono text-xs tracking-wider text-shade-40 tabular-nums">
                    {item}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-emerald-400/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 2. METHODOLOGY — Pinned Scroll-Scrubbed Storytelling Stage */}
      <section data-method-section className="py-20 md:py-28 border-b border-white/[0.08] bg-black">
        <Container className="max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-shade-40">
                  01 / Method
                </span>
                <h2 className="display-lg text-white font-heading font-normal tracking-tight">
                  Four steps, one mental habit
                </h2>
                <p className="text-shade-40 text-base leading-relaxed max-w-md">
                  You do not need a photographic memory. Conway&apos;s algorithm reduces any date to four small additions modulo 7.
                </p>
              </div>

              {/* Live Scrubbed Example Readout (Desktop) */}
              <div className="hidden lg:flex items-stretch gap-4 pt-4">
                <div className="w-[2px] bg-white/[0.08] rounded-full relative overflow-hidden shrink-0">
                  <div
                    data-method-progress
                    className="absolute inset-0 bg-emerald-400 origin-top"
                  />
                </div>
                <div className="relative flex-1 min-h-[64px] rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-4 py-3 flex flex-col justify-center">
                  <span className="text-[11px] font-mono text-shade-50">
                    Worked example · July 20, 1969
                  </span>
                  <div className="relative h-6 mt-1">
                    {METHODOLOGY_STEPS.map((step) => (
                      <span
                        key={step.num}
                        data-method-example
                        className="absolute inset-0 font-mono text-sm text-emerald-400 tabular-nums flex items-center"
                      >
                        {step.example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div data-method-list className="lg:col-span-7 border-t border-white/[0.08] divide-y divide-white/[0.08]">
              {METHODOLOGY_STEPS.map((step) => (
                <div
                  key={step.num}
                  data-method-row
                  className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 will-change-transform"
                >
                  <div className="flex items-start gap-5">
                    <span className="font-mono text-xs text-emerald-400 tabular-nums pt-1 shrink-0">
                      {step.num}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-heading text-lg font-medium text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-shade-40 leading-relaxed max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <code className="self-start sm:self-center shrink-0 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#0a0a0a] text-xs font-mono text-shade-30 tabular-nums">
                    {step.formula}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 3. TRAINING SUITE — Asymmetric 7/5 Perpetual Deck & Velocity */}
      <section data-suite-section className="py-20 md:py-28 border-b border-white/[0.08] bg-[#050505]">
        <Container className="max-w-7xl">
          <div className="flex flex-col gap-12">
            <div data-suite-header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono text-shade-40">
                  02 / Training suite
                </span>
                <h2 className="display-lg text-white font-heading font-normal tracking-tight">
                  Daily deck &amp; velocity
                </h2>
              </div>
              <p className="text-shade-40 text-sm md:text-base max-w-md">
                A deterministic 10-date challenge every 24 hours, paired with local latency and accuracy tracking.
              </p>
            </div>

            <div data-suite-grid className="grid lg:grid-cols-12 gap-6 items-stretch">
              {/* Left 7 Cols: Seeded Daily Deck */}
              <div
                data-suite-card
                className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-6 md:p-8 flex flex-col justify-between gap-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-heading text-xl font-medium text-white">
                      Daily challenge
                    </h3>
                    <p className="text-xs text-shade-40 font-mono tabular-nums">
                      10 seeded dates · +150 XP bonus
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">
                    Deterministic
                  </span>
                </div>

                <div className="border-y border-white/[0.08] divide-y divide-white/[0.08]">
                  {SAMPLE_DECK.map((item) => (
                    <div
                      key={item.date}
                      data-deck-row
                      className="py-3.5 grid grid-cols-12 items-center gap-2 text-sm"
                    >
                      <span className="col-span-4 font-mono text-xs text-shade-40 tabular-nums">
                        {item.date}
                      </span>
                      <span className="col-span-4 font-medium text-white">
                        {item.display}
                      </span>
                      <span className="col-span-3 text-xs text-shade-40 truncate">
                        {item.label}
                      </span>
                      <span className="col-span-1 text-right font-mono text-xs text-emerald-400">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-shade-50">
                    Resets at 00:00 UTC
                  </span>
                  <Button asChild variant="primary" size="md">
                    <Link href="/daily" className="flex items-center gap-2">
                      Start today&apos;s challenge <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right 5 Cols: Cognitive Velocity */}
              <div
                data-suite-card
                className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-6 md:p-8 flex flex-col justify-between gap-6"
              >
                <div className="space-y-1">
                  <h3 className="font-heading text-xl font-medium text-white">
                    Cognitive velocity
                  </h3>
                  <p className="text-xs text-shade-40">
                    Latency curves, solve streaks, and accuracy benchmarks
                  </p>
                </div>

                <div className="grid grid-cols-2 border border-white/[0.08] rounded-xl overflow-hidden bg-black/40">
                  {VELOCITY_METRICS.map((m, idx) => (
                    <div
                      key={m.label}
                      data-metric-cell
                      className={`p-4 flex flex-col gap-1 border-white/[0.08] ${
                        idx % 2 === 0 ? "border-r" : ""
                      } ${idx < 2 ? "border-b" : ""}`}
                    >
                      <span className="text-xs text-shade-40">{m.label}</span>
                      <span className="font-heading text-xl font-medium text-white tabular-nums">
                        {m.value}
                      </span>
                      <span className="text-[11px] font-mono text-shade-50">
                        {m.sub}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-shade-40 pt-1">
                  <span>Saved locally in browser</span>
                  <Link
                    href="/profile"
                    className="text-white hover:text-emerald-400 transition-colors font-medium flex items-center gap-1"
                  >
                    Open profile <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. INTERACTIVE MODULES — Lando-Style Pinned Horizontal Track (Desktop) */}
      <section data-modules-section className="py-20 md:py-28 border-b border-white/[0.08] overflow-hidden bg-black">
        <Container className="max-w-7xl">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono text-shade-40">
                  03 / Modules
                </span>
                <h2 className="display-lg text-white font-heading font-normal tracking-tight">
                  Four ways to train
                </h2>
              </div>

              <div className="hidden lg:flex items-center gap-4 w-56">
                <span className="text-[11px] font-mono text-shade-50 shrink-0">
                  Scroll
                </span>
                <div className="h-[2px] flex-1 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    data-modules-progress
                    className="h-full bg-emerald-400 origin-left scale-x-0"
                  />
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              data-modules-border
              className="h-[1px] bg-white/[0.08] w-full"
            />

            <div
              data-modules-track
              className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-nowrap gap-6 will-change-transform"
            >
              {MODULES.map((mod) => (
                <Link
                  key={mod.num}
                  href={mod.href}
                  data-module-col
                  className="group lg:w-[440px] lg:shrink-0 rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-8 flex flex-col justify-between gap-12 hover:border-white/25 transition-colors"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-emerald-400 tabular-nums">
                        {mod.num}
                      </span>
                      <span className="font-mono text-[11px] text-shade-50">
                        {mod.tag}
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl font-normal text-white">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-shade-40 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                    {mod.cta} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. CLOSING BAND — Editorial Split CTA */}
      <section data-cta-section className="py-20 md:py-28">
        <Container className="max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span data-cta-fade className="text-xs font-mono text-shade-40 block">
                No account required
              </span>
              <h2 className="display-lg text-white font-heading font-normal tracking-tight overflow-hidden pb-1">
                <span data-cta-line className="block">
                  Train your calendar brain
                </span>
              </h2>
              <p data-cta-fade className="text-shade-40 text-base leading-relaxed">
                Start with the first century-anchor lesson or jump straight into a relaxed practice sandbox.
              </p>
            </div>

            <div data-cta-fade className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Button asChild variant="primary" size="lg" className="w-full sm:w-auto px-8">
                <Link href="/learn" className="flex items-center justify-center gap-2">
                  Start first lesson <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </Button>
              <Button asChild variant="outline-on-dark" size="lg" className="w-full sm:w-auto px-7 border-white/15 hover:border-white/30">
                <Link href="/practice/relaxed">
                  Relaxed sandbox
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
