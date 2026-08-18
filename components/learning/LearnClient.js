"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ArrowRight, Clock, BookOpen, Zap, Trophy } from "lucide-react";
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
  const currentLessonIndex = LESSONS.findIndex(
    (l, i) => !completedList.includes(l.id) && (i === 0 || completedList.includes(LESSONS[i - 1].id))
  );

  const isLessonUnlocked = (lesson, idx) => {
    if (idx === 0) return true;
    const prevLesson = LESSONS[idx - 1];
    return completedList.includes(prevLesson.id);
  };

  if (!mounted) {
    return (
      <Container className="py-12">
        <div className="text-center py-24">
          <div className="inline-flex items-center gap-3 text-shade-40">
            <div className="h-5 w-5 border-2 border-shade-50 border-t-white rounded-full animate-spin" />
            <span className="text-sm font-mono tracking-wider uppercase">Loading curriculum...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl">
      {/* ——— Top Header ——— */}
      <section className="flex flex-col items-center text-center pt-10 pb-8 md:pt-14 md:pb-10">
        <SectionBadge variant="emerald" className="mb-5">Curriculum</SectionBadge>
        <h1 className="display-md text-white font-light leading-none tracking-tight font-heading mb-3">
          Learn the Method
        </h1>
        <p className="text-base text-shade-40 max-w-lg mx-auto leading-relaxed">
          Master Conway&apos;s Doomsday Rule — sequential lessons from first principles to mental speed.
        </p>
      </section>

      {/* ——— Two-Column Layout ——— */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 pb-16">

        {/* ═══ LEFT SIDEBAR — sticky progress panel ═══ */}
        <aside className="lg:w-[320px] xl:w-[340px] shrink-0">
          <div className="lg:sticky lg:top-28 space-y-6">
            {/* Progress Card */}
            <div className="rounded-2xl border border-hairline-dark bg-canvas-night-elevated p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono uppercase tracking-wider text-shade-50 font-semibold">Progress</span>
                <span className="text-3xl font-heading font-bold text-white">{progressPercent}%</span>
              </div>

              {/* Circular-style progress ring */}
              <div className="flex justify-center">
                <div className="relative h-32 w-32">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${progressPercent * 2.64} ${264 - progressPercent * 2.64}`}
                      className="transition-all duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#818cf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-mono font-bold text-emerald-300">{completedCount}/{totalLessons}</span>
                    <span className="text-xs text-shade-50 uppercase tracking-wider font-medium mt-0.5">Lessons</span>
                  </div>
                </div>
              </div>

              {/* Linear bar */}
              <div>
                <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-hairline-dark bg-canvas-night-elevated p-5 text-center">
                <BookOpen className="h-5 w-5 text-emerald-400 mx-auto mb-2.5" />
                <div className="text-2xl font-bold text-white font-mono">{completedCount}</div>
                <div className="text-xs text-shade-50 uppercase tracking-wider font-medium mt-1">Done</div>
              </div>
              <div className="rounded-xl border border-hairline-dark bg-canvas-night-elevated p-5 text-center">
                <Zap className="h-5 w-5 text-indigo-400 mx-auto mb-2.5" />
                <div className="text-2xl font-bold text-white font-mono">{totalLessons - completedCount}</div>
                <div className="text-xs text-shade-50 uppercase tracking-wider font-medium mt-1">Left</div>
              </div>
            </div>

            {/* Next Up Quick Link */}
            {currentLessonIndex >= 0 && (
              <Link
                href={`/learn/${LESSONS[currentLessonIndex].id}`}
                className="block rounded-xl border border-indigo-500/25 bg-indigo-500/[0.06] p-5 hover:border-indigo-500/40 hover:bg-indigo-500/[0.10] transition-all duration-200 group"
              >
                <div className="text-xs uppercase tracking-wider text-indigo-400 font-mono font-bold mb-2">Continue →</div>
                <div className="text-base font-bold text-white group-hover:text-indigo-100 transition-colors font-heading leading-snug">
                  {LESSONS[currentLessonIndex].title}
                </div>
                <div className="text-xs text-shade-50 mt-1.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {LESSONS[currentLessonIndex].estimatedTime}
                </div>
              </Link>
            )}

            {completedCount === totalLessons && (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 text-center">
                <Trophy className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-emerald-300 font-heading">All Complete!</div>
                <div className="text-[11px] text-shade-50 mt-1">You&apos;ve mastered every lesson.</div>
              </div>
            )}
          </div>
        </aside>

        {/* ═══ RIGHT COLUMN — lesson cards ═══ */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-3">
            {LESSONS.map((lesson, idx) => {
              const completed = completedList.includes(lesson.id);
              const unlocked = isLessonUnlocked(lesson, idx);
              const isCurrent = unlocked && !completed;

              return (
                <div key={lesson.id} className="group">
                  <Card
                    className={cn(
                      "border rounded-xl transition-all duration-200",
                      isCurrent
                        ? "border-indigo-500/40 bg-gradient-to-r from-indigo-950/20 via-canvas-night-elevated to-canvas-night-elevated ring-1 ring-indigo-500/20 shadow-[0_4px_30px_rgba(99,102,241,0.08)]"
                        : completed
                          ? "border-emerald-500/15 bg-canvas-night-elevated hover:border-emerald-500/30"
                          : unlocked
                            ? "border-hairline-dark bg-canvas-night-elevated hover:border-white/15"
                            : "border-hairline-dark/50 bg-white/[0.015] opacity-35 pointer-events-none select-none"
                    )}
                  >
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Lesson Number Circle */}
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-mono font-bold transition-all",
                            completed
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : isCurrent
                                ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                                : unlocked
                                  ? "border-white/15 bg-white/5 text-white"
                                  : "border-transparent bg-white/[0.03] text-shade-50"
                          )}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <span>{String(idx + 1).padStart(2, "0")}</span>
                          )}
                        </span>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={cn(
                                "text-[10px] uppercase border px-2 py-[2px] rounded-full font-mono tracking-wider",
                                completed
                                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25 font-bold"
                                  : isCurrent
                                    ? "bg-indigo-500/12 text-indigo-300 border-indigo-500/30 font-bold"
                                    : unlocked
                                      ? "bg-white/5 text-shade-40 border-white/10"
                                      : "bg-transparent text-shade-50 border-transparent"
                              )}
                            >
                              {completed ? "Done" : isCurrent ? "Up Next" : unlocked ? "Available" : "Locked"}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-shade-50 font-mono">
                              <Clock className="h-3 w-3" />
                              {lesson.estimatedTime}
                            </span>
                          </div>

                          <CardTitle className="text-base sm:text-[17px] font-bold text-white font-heading leading-snug">
                            {lesson.title}
                          </CardTitle>
                          <CardDescription className="text-[13px] text-shade-40 leading-relaxed mt-1 line-clamp-2">
                            {lesson.description}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Action */}
                      {unlocked && (
                        <Button
                          asChild
                          variant={isCurrent ? "primary" : "outline-on-dark"}
                          className={cn(
                            "shrink-0 cursor-pointer text-sm",
                            isCurrent && "shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                          )}
                        >
                          <Link href={`/learn/${lesson.id}`} className="flex items-center gap-1.5">
                            {completed ? "Review" : "Start"} <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}

                      {!unlocked && (
                        <div className="shrink-0 flex items-center gap-1.5 text-shade-50 text-xs font-mono">
                          <Lock className="h-3.5 w-3.5" /> Locked
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
}
