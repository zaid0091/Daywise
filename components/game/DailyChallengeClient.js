"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { Calendar, Flame, CheckCircle2, XCircle, Play, Timer, Award } from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";
import { Button } from "../ui/Button";
import { SectionBadge } from "../ui/SectionBadge";
import { useDailyStore } from "../../stores/dailyStore";
import { useProfileStore } from "../../stores/profileStore";
import { getLocalDateString } from "../../lib/game/streaks";
import { useMounted } from "../../lib/shared/useMounted";
import { GameClient } from "./GameClient";
import { cn } from "../../lib/utils";

export default function DailyChallengeClient() {
  const mounted = useMounted();
  const [isPlaying, setIsPlaying] = useState(false);

  const dailyStore = useDailyStore();
  const profileStore = useProfileStore();

  useEffect(() => {
    useDailyStore.persist.rehydrate();
    useProfileStore.persist.rehydrate();
  }, []);

  if (!mounted) {
    return (
      <Container className="py-8 bg-black text-white">
        <div className="text-center py-20">
          <p className="text-shade-40">Loading Daily Challenge…</p>
        </div>
      </Container>
    );
  }

  const todayStr = getLocalDateString();
  const todayAttempt = dailyStore.attempts[todayStr];
  const isCompleted = todayAttempt?.completed || false;

  const formatDateHeader = (str) => {
    try {
      const [year, month, day] = str.split("-").map(Number);
      const dateObj = new Date(Date.UTC(year, month - 1, day));
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    } catch (e) {
      return str;
    }
  };

  if (isPlaying && !isCompleted) {
    return (
      <Suspense fallback={<div className="py-20 text-center text-shade-40">Loading Daily Arena…</div>}>
        <GameClient mode="daily" />
      </Suspense>
    );
  }

  return (
    <Container className="py-8 max-w-4xl bg-black text-white">
      {/* Page Header */}
      <div className="flex flex-col items-center gap-4 border-b border-hairline-dark py-8 md:py-10 mb-8 text-center">
        <div className="space-y-3 flex flex-col items-center">
          <SectionBadge variant="emerald">Seeded Training</SectionBadge>
          <h1 className="display-md text-white font-light leading-none tracking-tight font-heading">
            Daily Challenge
          </h1>
          <p className="text-base text-shade-40 max-w-lg mx-auto">
            All users globally calculate the same dates today. One attempt per day.
          </p>
        </div>

        {/* Date Stamp Badge */}
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full shrink-0 text-sm font-semibold flex items-center gap-2 text-white">
          <Calendar className="h-4.5 w-4.5" />
          <span>{formatDateHeader(todayStr)}</span>
        </div>
      </div>

      {isCompleted ? (
        // --- COMPLETED STATE VIEW ---
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-hairline-dark bg-canvas-night-elevated text-center py-6 px-4 rounded-xl">
              <CardContent className="p-0 flex flex-col items-center gap-2 text-white">
                <CheckCircle2 className="h-10 w-10 text-white" />
                <h2 className="text-xl font-bold text-white">Challenge Completed!</h2>
                <p className="text-sm text-shade-40">You have completed your attempt for today.</p>
              </CardContent>
            </Card>

            {/* Answer Log Table */}
            <Card className="border border-hairline-dark bg-canvas-night-elevated overflow-hidden rounded-xl">
              <CardHeader className="p-6 border-b border-hairline-dark text-left">
                <CardTitle className="text-lg font-bold text-white">Your Solves Log</CardTitle>
                <CardDescription className="text-xs text-shade-40">Summary of your results across today&apos;s 10 dates.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-xs text-left border-collapse font-sans">
                    <thead>
                      <tr className="bg-white/5 border-b border-hairline-dark text-white text-[10px]  font-semibold">
                        <th className="py-3 px-6">Target Date</th>
                        <th className="py-3 px-6">Correct Answer</th>
                        <th className="py-3 px-6">Your Answer</th>
                        <th className="py-3 px-6 text-right">Speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayAttempt.answers?.map((ans, idx) => (
                        <tr key={idx} className="border-b border-hairline-dark/50 hover:bg-white/5 text-white">
                          <td className="py-3 px-6 font-semibold text-white">{ans.dateStr}</td>
                          <td className="py-3 px-6 font-mono text-white">{ans.correctAnswer}</td>
                          <td className="py-3 px-6">
                            <span className="flex items-center gap-1.5">
                              {ans.isCorrect ? (
                                <span className="bg-white/10 border border-white/10 text-white font-semibold px-2 py-0.5 rounded-full text-[10px]">
                                  Correct
                                </span>
                              ) : (
                                <span className="bg-red-955/40 border border-red-900/60 text-red-400 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                                  {ans.selectedAnswer}
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-right font-mono text-shade-40">
                            {ans.responseTimeSeconds.toFixed(1)}s
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HUD Column */}
          <div className="space-y-6">
            <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
              <CardHeader className="p-6 pb-2 text-left">
                <CardTitle className="text-base font-bold text-white">Your Scoreboard</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 text-sm leading-relaxed text-shade-40 text-left">
                <div className="flex justify-between border-b border-hairline-dark/40 pb-2">
                  <span>Score:</span>
                  <strong className="text-white font-mono">{todayAttempt.score.toLocaleString()} pts</strong>
                </div>
                <div className="flex justify-between border-b border-hairline-dark/40 pb-2">
                  <span>Accuracy:</span>
                  <strong className="text-white font-mono">{todayAttempt.accuracy}%</strong>
                </div>
                <div className="flex justify-between border-b border-hairline-dark/40 pb-2">
                  <span>Total Time:</span>
                  <strong className="text-white font-mono">{todayAttempt.elapsedTime}s</strong>
                </div>
                <div className="flex justify-between border-b border-hairline-dark/40 pb-2">
                  <span>XP Gained:</span>
                  <strong className="text-white font-mono font-bold">+150 XP</strong>
                </div>
                <div className="flex justify-between">
                  <span>Solve Streak:</span>
                  <strong className="text-white flex items-center gap-1 font-mono">
                    <Flame className="h-4 w-4 text-orange-500 fill-orange-500/10" />
                    {profileStore.streak} Days
                  </strong>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 mt-2">
                <Button asChild variant="outline-on-dark" className="w-full cursor-pointer">
                  <Link href="/practice">
                    Practice More Dates
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        // --- ACTIVE ENTRY STATE VIEW ---
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
              <CardHeader className="p-6 text-left">
                <div className="p-2.5 w-11 h-11 rounded-full bg-white/5 text-white border border-white/10 flex items-center justify-center mb-3">
                  <Calendar className="h-5.5 w-5.5" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Today&apos;s Seeded Challenge</CardTitle>
                <CardDescription className="text-sm text-shade-40">
                  Mixed difficulty • 10 target dates • One official attempt.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 text-left">
                <p className="text-sm text-shade-40 leading-relaxed">
                  Test your speed on a fixed calendar date list, computed deterministically using the day&apos;s date seed. Solves reward <strong>+150 XP</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="border border-hairline-dark p-4 rounded-xl bg-canvas-night-elevated flex items-center gap-3">
                    <div className="p-2 bg-white/5 text-white border border-white/10 rounded-full shrink-0">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-shade-40 block font-semibold ">Difficulty</span>
                      <span className="text-sm font-bold text-white block mt-0.5">Mixed</span>
                    </div>
                  </div>

                  <div className="border border-hairline-dark p-4 rounded-xl bg-canvas-night-elevated flex items-center gap-3">
                    <div className="p-2 bg-white/5 text-white border border-white/10 rounded-full shrink-0">
                      <Timer className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-shade-40 block font-semibold ">Estimated Time</span>
                      <span className="text-sm font-bold text-white block mt-0.5">1 - 2 mins</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 mt-4 flex">
                <Button onClick={() => setIsPlaying(true)} variant="outline-on-dark" className="w-full cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Play className="h-4.5 w-4.5 fill-current" /> Start Today&apos;s Challenge
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Stats HUD side column */}
          <div className="space-y-6">
            <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
              <CardHeader className="p-6 pb-2 text-left">
                <CardTitle className="text-base font-bold text-white">Your Local Best</CardTitle>
                <CardDescription className="text-xs text-shade-40">Your personal highest score in Daily Challenge.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 text-sm leading-relaxed text-shade-40 text-left">
                <div className="flex justify-between border-b border-hairline-dark/40 pb-2">
                  <span>Record High Score:</span>
                  <strong className="text-white font-mono">{dailyStore.bestDailyScore.toLocaleString()} pts</strong>
                </div>
                <div className="flex justify-between border-b border-hairline-dark/40 pb-2">
                  <span>Active Streak:</span>
                  <strong className="text-white flex items-center gap-1 font-mono">
                    <Flame className="h-4 w-4 text-orange-500 fill-orange-500/10" />
                    {profileStore.streak} Days
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Lesson Progress:</span>
                  <strong className="text-white">Lvl {profileStore.level}</strong>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Container>
  );
}
