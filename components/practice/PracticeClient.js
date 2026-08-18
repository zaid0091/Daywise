"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Timer, CheckCircle, ArrowRight, Gauge, Brain } from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { SectionBadge } from "../ui/SectionBadge";
import { cn } from "../../lib/utils";

const MODES = [
  {
    id: "relaxed",
    title: "Relaxed Mode",
    description: "Unlimited calendar dates. No countdowns, no lives. View step-by-step formulas for incorrect solves. Ideal for study.",
    icon: Brain,
    href: "/practice/relaxed",
    color: "cyan",
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    cardBorder: "hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]",
  },
  {
    id: "timed",
    title: "Timed Sprint",
    description: "Test yourself on a standard deck of 10 dates. Tracks accuracy, latency, and points earned. Causal training.",
    icon: CheckCircle,
    href: "/practice/timed",
    color: "emerald",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    cardBorder: "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
  },
  {
    id: "speed",
    title: "Speed Run",
    description: "Countdown timer (30s, 60s, or 120s). Solve as many dates as possible before the clock expires. High adrenaline.",
    icon: Timer,
    href: "/practice/speed",
    color: "amber",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    cardBorder: "hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]",
  },
  {
    id: "accuracy",
    title: "Accuracy Classic",
    description: "Strict 10-question deck. Incorrect answers reset streaks and cost more. Focus on building clean, faultless records.",
    icon: Zap,
    href: "/practice/accuracy",
    color: "indigo",
    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25 shadow-[0_0_15px_rgba(99,102,241,0.15)]",
    cardBorder: "hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]",
  },
];

export default function PracticeClient() {
  const [difficulty, setDifficulty] = useState("medium");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Container className="py-8 bg-black text-white">
        <div className="text-center py-20">
          <p className="text-shade-40">Loading practice deck...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-6xl bg-black text-white">
      {/* Page Header */}
      <div className="flex flex-col items-center gap-3 border-b border-hairline-dark py-8 md:py-10 mb-8 text-center">
        <SectionBadge variant="emerald">Training Presets</SectionBadge>
        <h1 className="display-md text-white font-light leading-none tracking-tight font-heading">
          Practice Arenas
        </h1>
        <p className="text-base text-shade-40 max-w-xl mx-auto">
          Choose a training mode to build your Doomsday mental calculation speed, streaks, or test under time pressure.
        </p>
      </div>

      {/* Difficulty Preset Selector */}
      <div className="mb-8 max-w-3xl mx-auto">
        <Card className="border border-hairline-dark bg-canvas-night-elevated shadow-none rounded-2xl">
          <CardContent className="p-6 flex flex-col items-center gap-5 text-center">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold flex items-center justify-center gap-2 text-white">
                <Gauge className="h-5 w-5 text-emerald-400" /> Select Training Difficulty
              </h3>
              <p className="text-xs text-shade-40">
                Influences the year ranges generated for date challenges.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-lg mx-auto">
              {[
                { id: "easy", label: "Easy", desc: "2000 - 2029", activeColor: "bg-emerald-500/20 border-emerald-400 text-emerald-300" },
                { id: "medium", label: "Medium", desc: "1950 - 2050", activeColor: "bg-cyan-500/20 border-cyan-400 text-cyan-300" },
                { id: "hard", label: "Hard", desc: "1800 - 2199", activeColor: "bg-amber-500/20 border-amber-400 text-amber-300" },
                { id: "expert", label: "Expert", desc: "1600 - 2400", activeColor: "bg-purple-500/20 border-purple-400 text-purple-300" },
              ].map((diff) => {
                const active = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => setDifficulty(diff.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-center transition-all duration-200",
                      active
                        ? `${diff.activeColor} shadow-md`
                        : "border-hairline-dark bg-transparent text-white hover:bg-white/5"
                    )}
                  >
                    <span className="font-bold text-sm block">{diff.label}</span>
                    <span className={cn("text-[10px] block mt-0.5", active ? "text-white/80" : "text-shade-40")}>
                      {diff.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid of modes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card
              key={mode.id}
              className={cn(
                "flex flex-col h-full bg-canvas-night-elevated border border-hairline-dark transition-all duration-300 rounded-2xl relative overflow-hidden group",
                mode.cardBorder
              )}
            >
              <CardHeader className="p-6 items-center text-center">
                <div className={cn("p-3 w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-110", mode.iconBg)}>
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-white">{mode.title}</CardTitle>
                <CardDescription className="text-sm text-shade-40 mt-2 min-h-[80px] leading-relaxed">
                  {mode.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-0 mt-auto border-t border-hairline-dark/40 pt-4">
                <Button asChild variant="outline-on-dark" className="w-full cursor-pointer hover:border-white/40">
                  <Link
                    href={`${mode.href}?diff=${difficulty}`}
                    className="flex items-center justify-center gap-1.5"
                  >
                    Launch Arena <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
