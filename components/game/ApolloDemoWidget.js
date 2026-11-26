"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Sparkles, Brain } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export function ApolloDemoWidget() {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const targetDate = {
    dateStr: "July 20, 1969",
    event: "Apollo 11 Moon Landing",
    correctDay: "Sunday",
    options: ["Monday", "Wednesday", "Friday", "Sunday"],
  };

  const handleSelect = (option) => {
    setSelected(option);
    setShowExplanation(true);
  };

  const handleReset = () => {
    setSelected(null);
    setShowExplanation(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selected !== null) return;
      const key = e.key;
      if (key >= "1" && key <= "4") {
        const idx = parseInt(key, 10) - 1;
        if (targetDate.options[idx]) {
          e.preventDefault();
          handleSelect(targetDate.options[idx]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.75)] overflow-hidden relative">
      <div className="p-6 flex flex-col justify-between min-h-[344px] gap-4">
        {/* Card Header Top Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-shade-40">
              Mental math simulator
            </span>
          </div>
          {selected && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs text-shade-40 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.5} /> Reset
            </button>
          )}
        </div>

        {/* Fixed-Footprint Body: Crossfades between Question & Breakdown without expanding hero */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!showExplanation ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="flex flex-col gap-5"
              >
                {/* Target Date Section */}
                <div className="text-center py-1 space-y-1">
                  <p className="text-xs font-mono text-emerald-400">
                    {targetDate.event}
                  </p>
                  <p className="text-xs text-shade-40">What day of the week was</p>
                  <h3 className="display-md text-white font-normal tabular-nums pt-1">
                    {targetDate.dateStr}
                  </h3>
                </div>

                {/* 2x2 Option Buttons Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {targetDate.options.map((option, idx) => (
                    <button
                      key={option}
                      onClick={() => !selected && handleSelect(option)}
                      className="relative h-12 rounded-xl border border-white/10 bg-white/[0.03] text-white hover:border-white/25 hover:bg-white/[0.07] px-4 flex items-center justify-between text-sm font-medium transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                    >
                      <span>{option}</span>
                      <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[11px] font-mono text-shade-40 tabular-nums">
                        {idx + 1}
                      </kbd>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="flex flex-col gap-3 text-xs text-shade-40 leading-snug"
              >
                {selected === targetDate.correctDay ? (
                  <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-400/25 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={1.5} />
                    <span>Correct — July 20, 1969 was a Sunday</span>
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-rose-500/10 border border-rose-400/25 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
                    <XCircle className="h-4 w-4 shrink-0 text-rose-400" strokeWidth={1.5} />
                    <span>Not {selected} — July 20, 1969 was a Sunday</span>
                  </div>
                )}

                {/* 4 Steps Formula Breakdown */}
                <div className="space-y-2 bg-black/60 p-3 rounded-xl border border-white/[0.08] text-xs font-sans tabular-nums">
                  <div className="flex items-start gap-2">
                    <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[11px] font-mono text-shade-40 shrink-0">1</kbd>
                    <p><span className="text-white font-medium">Century (1900s):</span> Wednesday (Code 3)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[11px] font-mono text-shade-40 shrink-0">2</kbd>
                    <p>
                      <span className="text-white font-medium">Year (&apos;69):</span> (5 + 9 + 2) % 7 = <span className="text-emerald-400 font-mono">+2</span> &rarr; Wed + 2 = <span className="text-white font-medium">Friday</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[11px] font-mono text-shade-40 shrink-0">3</kbd>
                    <p><span className="text-white font-medium">Month (July):</span> 7/11 is always Friday</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[11px] font-mono text-shade-40 shrink-0">4</kbd>
                    <p>
                      <span className="text-white font-medium">Target (20th):</span> +9 days (+2 mod 7) &rarr; Fri + 2 = <span className="text-emerald-400 font-medium">Sunday</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button
                    onClick={handleReset}
                    className="text-xs text-shade-40 hover:text-white transition-colors cursor-pointer"
                  >
                    &larr; Try again
                  </button>
                  <Button asChild variant="primary" size="sm" className="h-8 px-4 text-xs font-medium">
                    <Link href="/learn" className="flex items-center gap-2">
                      Full curriculum <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
