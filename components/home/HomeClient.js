"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Target,
  Calendar,
  Trophy,
  Flame,
  Timer,
  CheckCircle,
  Award,
  Sparkles,
  Gauge,
  Activity,
  Zap,
} from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { SectionBadge } from "../ui/SectionBadge";
import { ApolloDemoWidget } from "../game/ApolloDemoWidget";
import { Hero3DStage } from "./Hero3DStage";
import { Hero3DCard } from "./Hero3DCard";

export function HomeClient() {
  const [mounted, setMounted] = React.useState(false);
  const heroMouseRef = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  const isReducedMotion = useReducedMotion();
  const shouldReduceMotion = mounted ? isReducedMotion : false;

  const transition = { type: "spring", stiffness: 100, damping: 20 };
  const heroInitial = shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 };
  const heroEntrance = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const sectionInitial = shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 };
  const sectionReveal = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* 1. HERO — Nocturnal Perpetual-Calendar Split */}
      <section
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
        className="relative py-20 md:py-28 lg:py-32 border-b border-hairline-dark overflow-hidden"
      >
        {/* Quiet 3D Mod-7 Orbital Stage */}
        <Hero3DStage mouseRef={heroMouseRef} />

        {/* Readability Radial Vignette on Left Text Column */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_25%_50%,rgba(0,0,0,0.85)_0%,transparent_75%)] pointer-events-none"
        />

        <Container className="relative z-10 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column — Headline & Two Actions */}
            <motion.div
              initial={heroInitial}
              animate={heroEntrance}
              transition={{ ...transition, delay: 0.08 }}
              className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left gap-6"
            >
              <span className="text-xs font-mono text-shade-40">
                Conway&apos;s Doomsday Rule
              </span>

              <h1 className="display-xl lg:display-xxl text-white tracking-tight leading-[1.02] select-none font-heading font-normal">
                Know the day
                <br />
                <span className="text-emerald-400">
                  Without checking
                </span>
              </h1>

              <p className="text-base sm:text-lg text-shade-40 max-w-xl leading-relaxed">
                Calculate the weekday for any date in history mentally in seconds using John Conway&apos;s anchor-day algorithm.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
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
            </motion.div>

            {/* Right Column — 3D Perspective Interactive Simulator Card */}
            <motion.div
              initial={heroInitial}
              animate={heroEntrance}
              transition={{ ...transition, delay: 0.25 }}
              className="lg:col-span-6 xl:col-span-5 w-full flex justify-center lg:justify-end"
            >
              <Hero3DCard>
                <ApolloDemoWidget />
              </Hero3DCard>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 2. METHODOLOGY — 4 Structured Steps */}
      <motion.section
        initial={sectionInitial}
        whileInView={sectionReveal}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ ...transition, delay: 0.2 }}
        className="py-20 md:py-28 border-b border-hairline-dark relative"
      >
        <Container>
          <div className="flex flex-col gap-14 md:gap-16">
            <div className="flex flex-col items-center text-center gap-4">
              <SectionBadge variant="cyan">
                Methodology
              </SectionBadge>
              <h2 className="display-xl text-white font-light font-heading">How it works</h2>
              <p className="text-shade-40 text-base md:text-lg leading-relaxed max-w-2xl">
                Mastering date calculations doesn&apos;t require a photographic memory. Daywise breaks down John Conway&apos;s algorithm into four intuitive stages.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {[
                {
                  num: "01",
                  title: "Century Anchors",
                  desc: "Memorize 4 anchor days (e.g. 1900s = Wednesday, 2000s = Tuesday). These repeat every 400 years.",
                  accent: "from-emerald-500/20 to-transparent",
                },
                {
                  num: "02",
                  title: "Year Offset Drift",
                  desc: "Apply the 12-divisor rule to calculate how many days a specific year steps forward from its century.",
                  accent: "from-teal-500/20 to-transparent",
                },
                {
                  num: "03",
                  title: "Month Anchor Keys",
                  desc: "Connect memorable calendar milestones (4/4, 6/6, 8/8, 10/10, 12/12, 7/11, 9/5) to find month anchors.",
                  accent: "from-indigo-500/20 to-transparent",
                },
                {
                  num: "04",
                  title: "Instant Shift Solve",
                  desc: "Offset the target date from its closest anchor modulo 7 to determine the exact weekday in seconds.",
                  accent: "from-amber-500/20 to-transparent",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-start p-7 rounded-2xl border border-hairline-dark bg-canvas-night-elevated text-left transition-all duration-200 hover:border-white/20 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${step.accent} blur-xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`} />
                  <span className="font-mono text-3xl font-bold text-white/20 block mb-4">
                    {step.num}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-shade-40 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </motion.section>

      {/* 3. PRODUCT PREVIEW — Daily Challenge & Analytics Dashboard */}
      <motion.section
        initial={sectionInitial}
        whileInView={sectionReveal}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ ...transition, delay: 0.2 }}
        className="py-20 md:py-28 border-b border-hairline-dark bg-canvas-night-elevated/40"
      >
        <Container>
          <div className="flex flex-col gap-14 md:gap-16">
            <div className="flex flex-col items-center text-center gap-4">
              <SectionBadge variant="indigo">
                Training Suite
              </SectionBadge>
              <h2 className="display-xl text-white font-light font-heading">A Mental Gym</h2>
              <p className="text-shade-40 text-base md:text-lg max-w-2xl">
                Daily seeded challenges, speed drills, accuracy runs, and offline latency benchmarks.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
              {/* Daily Challenge Card */}
              <Card className="relative overflow-hidden border-hairline-dark bg-canvas-night-elevated">
                <div className="absolute top-5 right-5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[10px] font-bold text-white font-mono uppercase tracking-wider">
                  Seeded Daily
                </div>
                <CardHeader className="p-7 md:p-8">
                  <div className="p-3 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white font-heading">Daily Challenge</CardTitle>
                  <CardDescription className="text-sm text-shade-40">
                    10 seeded dates &bull; Global calendar seed &bull; +150 XP bonus
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-7 md:p-8 pt-0 space-y-5">
                  <p className="text-sm text-shade-40 leading-relaxed">
                    Every 24 hours, calculate a fixed sequence of historical dates. Build your daily streak and benchmark your speed against the seed.
                  </p>

                  <div className="border border-hairline-dark rounded-xl p-4 bg-black/60 space-y-2.5">
                    <div className="flex justify-between text-xs text-shade-40 border-b border-hairline-dark/60 pb-2">
                      <span className="font-mono uppercase tracking-wider text-[10px]">Sample Deck</span>
                      <span className="text-emerald-300 font-mono text-[10px]">Deterministic</span>
                    </div>
                    {[
                      { date: "July 4, 1776", label: "US Declaration" },
                      { date: "November 11, 1918", label: "WW1 Armistice" },
                      { date: "January 1, 2100", label: "Century Transition" },
                    ].map((d) => (
                      <div key={d.date} className="flex justify-between items-center text-sm font-semibold text-white">
                        <span>{d.date}</span>
                        <span className="text-shade-40 font-normal text-xs">{d.label}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild variant="primary" className="w-full">
                    <Link href="/daily" className="flex items-center justify-center gap-2">
                      Start Today&apos;s Challenge <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Progress Analytics Card */}
              <Card className="relative overflow-hidden border-hairline-dark bg-canvas-night-elevated">
                <div className="absolute top-5 right-5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[10px] font-bold text-white font-mono uppercase tracking-wider">
                  Live Analytics
                </div>
                <CardHeader className="p-7 md:p-8">
                  <div className="p-3 w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
                    <Gauge className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white font-heading">Cognitive Velocity</CardTitle>
                  <CardDescription className="text-sm text-shade-40">
                    Track latency curves, solve streaks, and accuracy benchmarks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-7 md:p-8 pt-0 space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "XP Level", value: "Level 1", sub: "Novice Apprentice", icon: Award },
                      { label: "Active Streak", value: "0 Days", sub: "Build daily habits", icon: Flame },
                      { label: "Accuracy Goal", value: "95%+", sub: "Target threshold", icon: CheckCircle },
                      { label: "Speed Sprint", value: "< 2.0s", sub: "Fastest reflex", icon: Timer },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <div key={m.label} className="border border-hairline-dark p-4 rounded-xl bg-black/60 flex items-center gap-3">
                          <div className="p-2 rounded-full bg-white/5 text-white border border-white/10 shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-shade-40 block font-semibold uppercase tracking-wider font-mono">{m.label}</span>
                            <span className="text-sm md:text-base font-bold text-white block mt-0.5">{m.value}</span>
                            <span className="text-[10px] text-shade-50 block">{m.sub}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-black/60 border border-hairline-dark p-4 rounded-xl flex items-center justify-between text-xs text-shade-40">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-400" />
                      <span>All progress saves automatically in local storage.</span>
                    </div>
                    <Link href="/profile" className="text-white font-semibold hover:underline shrink-0 ml-2">
                      Profile &rarr;
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </motion.section>

      {/* 4. FEATURES GRID */}
      <motion.section
        initial={sectionInitial}
        whileInView={sectionReveal}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ ...transition, delay: 0.2 }}
        className="py-20 md:py-28 border-b border-hairline-dark"
      >
        <Container>
          <div className="flex flex-col gap-14 md:gap-16">
            <div className="flex flex-col items-center text-center gap-4">
              <SectionBadge variant="amber">
                Training Modes
              </SectionBadge>
              <h2 className="display-xl text-white font-light font-heading">Interactive Modules</h2>
              <p className="text-shade-40 text-base md:text-lg max-w-2xl">
                Choose your focus: structured study, casual loops, or high-pressure speed runs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: BookOpen,
                  title: "Interactive Lessons",
                  desc: "Bite-sized modules covering anchor days, month keys, and leap year formulas with visual aids and quick quizzes.",
                  link: "/learn",
                  linkText: "Curriculum",
                },
                {
                  icon: Target,
                  title: "4 Practice Arenas",
                  desc: "Relaxed study, 10-question sprints, countdown speed runs (30s/60s/120s), and strict accuracy mode.",
                  link: "/practice",
                  linkText: "Arenas",
                },
                {
                  icon: Trophy,
                  title: "Offline Leaderboard",
                  desc: "Earn XP for every date solved and compare your accuracy and velocity against benchmark trainees.",
                  link: "/leaderboard",
                  linkText: "Leaderboard",
                },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <Card key={f.title} className="flex flex-col h-full border-hairline-dark bg-canvas-night-elevated hover:border-white/20 transition-all duration-200 rounded-2xl">
                    <CardHeader className="p-7 md:p-8 items-start text-left">
                      <div className="p-3 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl font-bold text-white font-heading">{f.title}</CardTitle>
                      <CardDescription className="text-sm text-shade-40 mt-1 leading-relaxed">{f.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-7 md:p-8 pt-0 mt-auto flex justify-start">
                      <Link href={f.link} className="text-sm text-white font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200">
                        Launch {f.linkText} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </motion.section>

      {/* 5. CALL TO ACTION */}
      <motion.section
        initial={sectionInitial}
        whileInView={sectionReveal}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ ...transition, delay: 0.2 }}
        className="py-20 md:py-28"
      >
        <Container className="max-w-4xl">
          <div className="rounded-3xl border border-hairline-dark bg-canvas-night-elevated p-10 md:p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[150px] bg-emerald-500/[0.08] blur-[80px] pointer-events-none rounded-full" />
            
            <SectionBadge variant="emerald">
              Zero Setup Required
            </SectionBadge>
            <h2 className="display-md text-white font-light font-heading">
              Ready to train your calendar brain?
            </h2>
            <p className="text-shade-40 text-base max-w-xl leading-relaxed">
              Step inside the first lesson, master your century anchors, and unlock instant date calculations.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button asChild variant="primary" size="lg" className="px-8 shadow-[0_0_25px_rgba(255,255,255,0.18)]">
                <Link href="/learn" className="flex items-center gap-2">
                  Start First Lesson <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </Button>
              <Button asChild variant="outline-on-dark" size="lg" className="px-7">
                <Link href="/practice/relaxed" className="flex items-center gap-2">
                  Try Relaxed Sandbox
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </motion.section>
    </div>
  );
}
