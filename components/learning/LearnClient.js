"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ArrowRight, BookOpen } from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Button } from "../ui/Button";
import { SectionBadge } from "../ui/SectionBadge";
import { LESSONS } from "../../data/lessons";
import { getCompletedLessons } from "../../lib/storage/storage";
import { cn } from "../../lib/utils";

export function LearnClient() {
  const [completedList, setCompletedList] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompletedList(getCompletedLessons());
  }, []);

  const totalLessons = LESSONS.length;
  const completedCount = completedList.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isLessonUnlocked = (lesson, idx) => {
    if (idx === 0) return true;
    const prevLesson = LESSONS[idx - 1];
    return completedList.includes(prevLesson.id);
  };

  if (!mounted) {
    return (
      <Container className="py-8">
        <div className="text-center py-20">
          <p className="text-shade-40">Loading curriculum map...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-4xl bg-black text-white">
      {/* Page Header with progress summary */}
      <div className="flex flex-col items-center gap-6 border-b border-hairline-dark py-8 md:py-10 mb-8 text-center">
        <div className="space-y-3 flex flex-col items-center">
          <SectionBadge variant="emerald">Curriculum Map</SectionBadge>
          <h1 className="display-md text-white font-light leading-none tracking-tight font-heading">
            Learn the Method
          </h1>
          <p className="text-base text-shade-40 max-w-xl mx-auto">
            Complete sequential lessons to master John Conway&apos;s Doomsday Rule step by step.
          </p>
        </div>

        {/* Progress Card with Multi-stop Gradient */}
        <div className="flex items-center gap-6 bg-canvas-night-elevated p-6 rounded-2xl border border-hairline-dark shrink-0 min-w-[280px] md:min-w-[340px] shadow-[0_0_30px_rgba(16,185,129,0.06)]">
          <div className="flex-1 space-y-2 text-left">
            <div className="flex justify-between text-xs font-bold text-white uppercase tracking-wider font-mono">
              <span className="text-shade-40">Completed</span>
              <span className="text-emerald-300">{completedCount} / {totalLessons}</span>
            </div>
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500/15 to-indigo-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold font-mono text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Curriculum Path timeline */}
      <div className="max-w-2xl mx-auto flex flex-col gap-6 relative pl-5 sm:pl-7 border-l-2 border-hairline-dark ml-4">
        {LESSONS.map((lesson, idx) => {
          const completed = completedList.includes(lesson.id);
          const unlocked = isLessonUnlocked(lesson, idx);
          const isCurrent = unlocked && !completed;

          let statusText = "Locked";
          let badgeClass = "bg-white/5 text-shade-40 border-transparent";
          if (completed) {
            statusText = "Completed";
            badgeClass = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold";
          } else if (isCurrent) {
            statusText = "Current Lesson";
            badgeClass = "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold shadow-[0_0_10px_rgba(99,102,241,0.2)]";
          }

          return (
            <div key={lesson.id} className="relative group">
              {/* Timeline marker node */}
              <span
                className={cn(
                  "absolute -left-[35px] sm:-left-[43px] top-6 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border text-xs transition-all duration-200",
                  completed
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : isCurrent
                      ? "border-indigo-400 bg-indigo-500/30 text-indigo-200 ring-4 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      : unlocked
                        ? "border-white bg-black text-white font-bold"
                        : "border-hairline-dark bg-white/5 text-shade-40"
                )}
              >
                {completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 animate-ping" />
                ) : unlocked ? (
                  <span className="h-2 w-2 rounded-full bg-white" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
              </span>

              {/* Lesson Card */}
              <Card
                className={cn(
                  "bg-canvas-night-elevated border transition-all duration-200 rounded-2xl",
                  isCurrent
                    ? "border-indigo-500/50 bg-gradient-to-r from-indigo-950/20 via-black to-black ring-1 ring-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.12)]"
                    : completed
                      ? "border-emerald-500/20 hover:border-emerald-500/40"
                      : unlocked
                        ? "border-hairline-dark hover:border-white/20"
                        : "opacity-45 border-hairline-dark pointer-events-none select-none bg-white/5"
                )}
              >
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-7">
                  <div className="space-y-2 flex-1 text-left">
                    <div className="flex items-center gap-2.5">
                      <span className={cn("text-[10px] uppercase border px-2.5 py-0.5 rounded-full font-mono", badgeClass)}>
                        {statusText}
                      </span>
                      <span className="text-xs text-shade-40 font-mono">{lesson.estimatedTime}</span>
                    </div>
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-heading">
                      {lesson.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-shade-40 leading-relaxed">
                      {lesson.description}
                    </CardDescription>
                  </div>

                  {unlocked ? (
                    <Button
                      asChild
                      variant={isCurrent ? "primary" : "outline-on-dark"}
                      className={cn(
                        "shrink-0 cursor-pointer",
                        isCurrent && "shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      )}
                    >
                      <Link href={`/learn/${lesson.id}`} className="flex items-center gap-1.5">
                        {completed ? "Review" : "Start"} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline-on-dark"
                      disabled
                      className="shrink-0 bg-white/5 border-hairline-dark"
                    >
                      <span className="flex items-center gap-1.5 text-shade-50">
                        Locked <Lock className="h-3.5 w-3.5" />
                      </span>
                    </Button>
                  )}
                </CardHeader>
              </Card>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
