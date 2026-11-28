"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ArrowRight, Clock } from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Button } from "../ui/Button";
import { LESSONS } from "../../data/lessons";
import { getCompletedLessons } from "../../lib/storage/storage";
import { useMounted } from "../../lib/shared/useMounted";
import { cn } from "../../lib/utils";

export function LearnClient() {
  const mounted = useMounted();
  const completedList = useMemo(
    () => (mounted ? getCompletedLessons() : []),
    [mounted]
  );

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
            <span className="text-sm">Loading curriculum…</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl">
      {/* ——— Top Header ——— */}
      <header className="mb-10 flex flex-col gap-4 border-b border-hairline-dark pb-10 pt-8 md:pb-12 md:pt-12">
        <p className="text-sm text-shade-40">Curriculum</p>
        <h1 className="display-lg font-heading font-light tracking-tight text-balance text-white">
          Learn the method
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-shade-40">
          Conway&apos;s Doomsday Rule, one lesson at a time: from the idea itself to fast mental arithmetic.
        </p>
      </header>

      {/* ——— Two-Column Layout ——— */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 pb-16">

        {/* ═══ LEFT SIDEBAR — sticky progress panel ═══ */}
        <aside className="lg:w-[320px] xl:w-[340px] shrink-0">
          <div className="lg:sticky lg:top-28 space-y-6">
            {/* Progress Card */}
            <div className="rounded-2xl border border-hairline-dark bg-canvas-night-elevated p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-shade-40">Progress</span>
                <span className="text-3xl font-heading font-light text-white tabular-nums">{progressPercent}%</span>
              </div>

              {/* Circular-style progress ring */}
              <div className="flex justify-center">
                <div className="relative h-32 w-32">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${progressPercent * 2.64} ${264 - progressPercent * 2.64}`}
                      className="text-white transition-[stroke-dasharray] duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-medium text-white tabular-nums">{completedCount}/{totalLessons}</span>
                    <span className="mt-0.5 text-xs text-shade-40">Lessons</span>
                  </div>
                </div>
              </div>

              {/* Linear bar */}
              <div>
                <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-hairline-dark bg-canvas-night-elevated p-5 text-center">
                <div className="text-2xl font-light text-white tabular-nums">{completedCount}</div>
                <div className="mt-1 text-xs text-shade-40">Done</div>
              </div>
              <div className="rounded-xl border border-hairline-dark bg-canvas-night-elevated p-5 text-center">
                <div className="text-2xl font-light text-white tabular-nums">{totalLessons - completedCount}</div>
                <div className="mt-1 text-xs text-shade-40">Left</div>
              </div>
            </div>

            {/* Next Up Quick Link */}
            {currentLessonIndex >= 0 && (
              <Link
                href={`/learn/${LESSONS[currentLessonIndex].id}`}
                className="group block rounded-xl border border-hairline-dark bg-canvas-night-elevated p-5 transition-[border-color,background-color] duration-200 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <div className="mb-2 text-xs text-shade-40">Continue</div>
                <div className="font-heading text-base leading-snug text-white">
                  {LESSONS[currentLessonIndex].title}
                </div>
                <div className="text-xs text-shade-50 mt-1.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {LESSONS[currentLessonIndex].estimatedTime}
                </div>
              </Link>
            )}

            {completedCount === totalLessons && (
              <div className="rounded-xl border border-hairline-dark bg-canvas-night-elevated p-4 text-center">
                <div className="font-heading text-sm text-white">All lessons complete</div>
                <div className="mt-1 text-xs text-shade-40">You have worked through every lesson.</div>
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
                      "border rounded-xl transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200",
                      isCurrent
                        ? "border-white/30 bg-canvas-night-elevated"
                        : completed
                          ? "border-hairline-dark bg-canvas-night-elevated hover:border-white/20"
                          : unlocked
                            ? "border-hairline-dark bg-canvas-night-elevated hover:border-white/20"
                            : "border-hairline-dark/50 bg-transparent text-shade-50 pointer-events-none select-none"
                    )}
                  >
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Lesson Number Circle */}
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-mono font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity]",
                            completed
                              ? "border-hairline-dark bg-white/[0.04] text-white"
                              : isCurrent
                                ? "border-white/30 bg-white/10 text-white"
                                : unlocked
                                  ? "border-hairline-dark bg-white/[0.03] text-white"
                                  : "border-transparent bg-transparent text-shade-50"
                          )}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-label="Completed" />
                          ) : (
                            <span className="tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                          )}
                        </span>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={cn(
                                "text-xs",
                                isCurrent ? "text-white" : "text-shade-40"
                              )}
                            >
                              {completed ? "Done" : isCurrent ? "Up next" : unlocked ? "Available" : "Locked"}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-shade-40">
                              <Clock className="h-3 w-3" />
                              {lesson.estimatedTime}
                            </span>
                          </div>

                          <CardTitle className="font-heading text-base font-normal leading-snug text-white sm:text-lg">
                            {lesson.title}
                          </CardTitle>
                          <CardDescription className="mt-1 line-clamp-2 text-sm leading-relaxed text-shade-40">
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
                            isCurrent && ""
                          )}
                        >
                          <Link href={`/learn/${lesson.id}`} className="flex items-center gap-1.5">
                            {completed ? "Review" : "Start"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      )}

                      {!unlocked && (
                        <div className="flex shrink-0 items-center gap-1.5 text-xs text-shade-40">
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Locked
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
