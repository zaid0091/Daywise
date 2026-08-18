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
    <div className="w-full max-w-lg rounded-2xl border border-emerald-500/25 bg-[#0a0a0c] shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(16,185,129,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden relative">
      {/* Luminous Top Gradient Rim */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      <div className="p-6 md:p-7 flex flex-col gap-5">
        {/* Card Header Top Bar */}
        <div className="flex items-center justify-between border-b border-hairline-dark pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/90 font-mono">
              Live Mental Math Simulator
            </span>
          </div>
          {selected && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-shade-40 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        {/* Target Date Section */}
        <div className="text-center py-1 space-y-1.5">
          <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-mono uppercase tracking-wider font-semibold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            {targetDate.event}
          </span>
          <p className="text-xs text-shade-40 pt-1">What day of the week was</p>
          <h3 className="display-md text-white font-light mt-0.5">
            {targetDate.dateStr}
          </h3>
        </div>

        {/* 2x2 Option Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {targetDate.options.map((option, idx) => {
            const isCorrect = option === targetDate.correctDay;
            const isChosen = option === selected;

            let customStyle = "border-hairline-dark bg-white/5 text-white hover:border-emerald-400/40 hover:bg-white/10";

            if (selected) {
              if (isChosen) {
                customStyle = isCorrect
                  ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  : "bg-rose-500/25 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.25)]";
              } else if (isCorrect) {
                customStyle = "border-emerald-400/60 text-emerald-300 bg-emerald-500/15";
              } else {
                customStyle = "border-hairline-dark/60 text-shade-60 opacity-30";
              }
            }

            return (
              <button
                key={option}
                onClick={() => !selected && handleSelect(option)}
                disabled={selected !== null}
                className={cn(
                  "relative h-13 rounded-xl border px-4 flex items-center justify-between text-sm font-medium transition-all duration-200 cursor-pointer select-none",
                  customStyle
                )}
              >
                <span className="flex items-center gap-2">
                  {selected && isChosen && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                  {selected && isChosen && !isCorrect && <XCircle className="h-4 w-4 text-rose-400 shrink-0" />}
                  {selected && !isChosen && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                  <span>{option}</span>
                </span>
                <span className="text-[10px] font-mono text-shade-50">
                  [{idx + 1}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Step-by-Step Mathematical Explanation on Selection */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-hairline-dark flex flex-col gap-3.5 text-xs text-shade-40 leading-relaxed">
                {selected === targetDate.correctDay ? (
                  <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Correct! July 20, 1969 was indeed a Sunday.</span>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-200 text-xs font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                    <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>July 20, 1969 was a Sunday. Let&apos;s calculate why:</span>
                  </div>
                )}

                {/* 4 Steps Formula Breakdown */}
                <div className="space-y-2.5 bg-black/70 p-3.5 rounded-xl border border-hairline-dark text-[11px] font-sans">
                  <div className="flex items-start gap-2">
                    <span className="kbd-badge shrink-0 text-[9px] px-1.5 py-0.5">1</span>
                    <p><strong className="text-white">Century Anchor (1900s):</strong> Wednesday (Code 3).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="kbd-badge shrink-0 text-[9px] px-1.5 py-0.5">2</span>
                    <p>
                      <strong className="text-white">Year Offset (&apos;69):</strong> (5 + 9 + 2) % 7 = <span className="text-emerald-300 font-mono font-bold">+2 days</span> &rarr; Wednesday + 2 = <strong className="text-white">Friday</strong> (1969 Doomsday).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="kbd-badge shrink-0 text-[9px] px-1.5 py-0.5">3</span>
                    <p><strong className="text-white">Month Anchor (July):</strong> July 11 (7/11) is always Friday.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="kbd-badge shrink-0 text-[9px] px-1.5 py-0.5">4</span>
                    <p>
                      <strong className="text-white">Target Date:</strong> July 20 is 9 days after July 11 (+2 mod 7) &rarr; Friday + 2 = <strong className="text-white text-xs">Sunday</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-shade-40 hover:text-white transition-colors cursor-pointer"
                  >
                    &larr; Try again
                  </button>
                  <Button asChild variant="primary" size="sm" className="h-8 px-4 text-xs font-semibold shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    <Link href="/learn" className="flex items-center gap-1.5">
                      Full Curriculum <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
