"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Timer, CheckCircle, ArrowRight, Gauge, Brain } from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { useMounted } from "../../lib/shared/useMounted";
import { cn } from "../../lib/utils";

const MODES = [
  {
    id: "relaxed",
    title: "Relaxed Mode",
    description: "Unlimited calendar dates. No countdowns, no lives. View step-by-step formulas for incorrect solves. Ideal for study.",
    icon: Brain,
    href: "/practice/relaxed",
    iconBg: "bg-white/[0.04] text-white border-hairline-dark",
    cardBorder: "hover:border-white/25",
  },
  {
    id: "timed",
    title: "Timed Sprint",
    description: "Test yourself on a standard deck of 10 dates. Tracks accuracy, latency, and points earned. Causal training.",
    icon: CheckCircle,
    href: "/practice/timed",
    iconBg: "bg-white/[0.04] text-white border-hairline-dark",
    cardBorder: "hover:border-white/25",
  },
  {
    id: "speed",
    title: "Speed Run",
    description: "Countdown timer (30s, 60s, or 120s). Solve as many dates as possible before the clock expires. High adrenaline.",
    icon: Timer,
    href: "/practice/speed",
    iconBg: "bg-white/[0.04] text-white border-hairline-dark",
    cardBorder: "hover:border-white/25",
  },
  {
    id: "accuracy",
    title: "Accuracy Classic",
    description: "Strict 10-question deck. Incorrect answers reset streaks and cost more. Focus on building clean, faultless records.",
    icon: Zap,
    href: "/practice/accuracy",
    iconBg: "bg-white/[0.04] text-white border-hairline-dark",
    cardBorder: "hover:border-white/25",
  },
];

export default function PracticeClient() {
  const [difficulty, setDifficulty] = useState("medium");
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Container className="py-8 bg-black text-white">
        <div className="text-center py-20">
          <p className="text-shade-40">Loading practice deck…</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-6xl bg-black text-white">
      {/* Page Header */}
      <header className="mb-10 flex flex-col gap-4 border-b border-hairline-dark pb-10 pt-8 md:pb-12 md:pt-12">
        <h1 className="display-lg font-heading font-light tracking-tight text-balance text-white">
          Practice arenas
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-shade-40">
          Choose a training mode to build your Doomsday mental calculation speed, streaks, or test under time pressure.
        </p>
      </header>

      {/* Difficulty Preset Selector */}
      <div className="mb-8 max-w-3xl mx-auto">
        <Card className="border border-hairline-dark bg-canvas-night-elevated shadow-none rounded-2xl">
          <CardContent className="p-6 flex flex-col items-center gap-5 text-center">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold flex items-center justify-center gap-2 text-white">
                <Gauge className="h-5 w-5 text-shade-40" /> Select Training Difficulty
              </h3>
              <p className="text-xs text-shade-40">
                Influences the year ranges generated for date challenges.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-lg mx-auto">
              {[
                { id: "easy", label: "Easy", desc: "2000 – 2029", activeColor: "bg-white text-black border-white" },
                { id: "medium", label: "Medium", desc: "1950 – 2050", activeColor: "bg-white text-black border-white" },
                { id: "hard", label: "Hard", desc: "1800 – 2199", activeColor: "bg-white text-black border-white" },
                { id: "expert", label: "Expert", desc: "1600 – 2400", activeColor: "bg-white text-black border-white" },
              ].map((diff) => {
                const active = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => setDifficulty(diff.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-center transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200",
                      active
                        ? diff.activeColor
                        : "border-hairline-dark bg-transparent text-white hover:bg-white/5"
                    )}
                  >
                    <span className="font-bold text-sm block">{diff.label}</span>
                    <span className={cn("text-xs block mt-0.5", active ? "text-black/70" : "text-shade-40")}>
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
                "flex flex-col h-full bg-canvas-night-elevated border border-hairline-dark transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-300 rounded-2xl relative overflow-hidden group",
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
