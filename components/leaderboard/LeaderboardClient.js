"use client";

import React, { useEffect } from "react";
import { Trophy, Award, Sparkles, Medal, ShieldAlert } from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { SectionBadge } from "../ui/SectionBadge";
import { useProfileStore } from "../../stores/profileStore";
import { useMounted } from "../../lib/shared/useMounted";
import { cn } from "../../lib/utils";

const DEMO_PLAYERS = [
  { name: "ConwayDisciple (Demo)", xp: 12450, avgSpeed: "1.8s", accuracy: "99%", isUser: false },
  { name: "CalendarQueen (Demo)", xp: 10890, avgSpeed: "2.1s", accuracy: "98%", isUser: false },
  { name: "DoomsdayMaster (Demo)", xp: 9550, avgSpeed: "2.4s", accuracy: "97%", isUser: false },
  { name: "DateSlicer (Demo)", xp: 6990, avgSpeed: "3.1s", accuracy: "93%", isUser: false },
  { name: "LeapYearLeaper (Demo)", xp: 5800, avgSpeed: "4.2s", accuracy: "91%", isUser: false },
  { name: "AnchorLord (Demo)", xp: 5410, avgSpeed: "3.9s", accuracy: "92%", isUser: false },
];

export default function LeaderboardClient() {
  const mounted = useMounted();
  const profile = useProfileStore();

  useEffect(() => {
    useProfileStore.persist.rehydrate();
  }, []);

  if (!mounted) {
    return (
      <Container className="py-8 bg-black text-white">
        <div className="text-center py-20">
          <p className="text-shade-40">Loading Leaderboard…</p>
        </div>
      </Container>
    );
  }

  const totalQuestions = profile.history?.reduce((acc, h) => acc + h.totalQuestions, 0) || 0;
  const totalCorrect = profile.history?.reduce((acc, h) => acc + h.correctCount, 0) || 0;
  const accuracyStr = totalQuestions > 0 ? `${Math.round((totalCorrect / totalQuestions) * 100)}%` : "--";
  const speedStr = profile.records.fastestCorrect ? `${profile.records.fastestCorrect.toFixed(1)}s` : "--";

  const sortedPlayers = [
    ...DEMO_PLAYERS,
    {
      name: `${profile.displayName} (You)`,
      xp: profile.xp,
      avgSpeed: speedStr,
      accuracy: accuracyStr,
      isUser: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  const userRankIndex = sortedPlayers.findIndex((p) => p.isUser) + 1;

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500 fill-yellow-500/20" />;
      case 2:
        return <Medal className="h-5 w-5 text-zinc-400 fill-zinc-400/20" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600 fill-amber-600/20" />;
      default:
        return <span className="font-mono text-sm text-shade-40 font-bold w-5 text-center">{rank}</span>;
    }
  };

  return (
    <Container className="py-8 max-w-5xl bg-black text-white">
      {/* Page Header */}
      <div className="flex flex-col items-center gap-3 border-b border-hairline-dark py-8 md:py-10 mb-8 text-center">
        <SectionBadge variant="emerald">Local Trainee Standings</SectionBadge>
        <h1 className="display-md text-white font-light leading-none tracking-tight font-heading">
          Practice Leaderboard
        </h1>
        <p className="text-base text-shade-40 max-w-xl mx-auto">
          Review your mental calculation progress and local rank compared to sample benchmarks. This leaderboard operates entirely offline.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Leaderboard Table Card */}
        <div className="lg:col-span-2">
          <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl overflow-hidden">
            <CardHeader className="p-6 border-b border-hairline-dark/60 text-left">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-white" />
                Offline Rank Benchmark
              </CardTitle>
              <CardDescription className="text-xs text-shade-40 mt-1">
                Fictional competitor records are designated with the <strong>Demo</strong> tag.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left border-collapse font-sans">
                  <thead>
                    <tr className="text-xs text-white border-b border-hairline-dark bg-white/5">
                      <th className="py-4 px-6 font-semibold w-16 text-center">Rank</th>
                      <th className="py-4 px-6 font-semibold">User</th>
                      <th className="py-4 px-6 font-semibold text-right">Personal Best</th>
                      <th className="py-4 px-6 font-semibold text-right">Accuracy</th>
                      <th className="py-4 px-6 font-semibold text-right">Accumulated XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((player, idx) => {
                      const rankNum = idx + 1;
                      return (
                        <tr
                          key={player.name}
                          className={cn(
                            "border-b border-hairline-dark/50 transition-colors last:border-0 text-white",
                            player.isUser
                              ? "bg-white/10 hover:bg-white/20 border-l-2 border-l-white font-semibold"
                              : "hover:bg-white/5"
                          )}
                        >
                          <td className="py-4 px-6 flex items-center justify-center">
                            {getRankBadge(rankNum)}
                          </td>
                          <td className="py-4 px-6">
                            <span className="flex items-center gap-2">
                              {player.name}
                              {player.isUser && (
                                <span className="text-[9px] font-bold bg-white text-black px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-mono">{player.avgSpeed}</td>
                          <td className="py-4 px-6 text-right font-mono">{player.accuracy}</td>
                          <td className="py-4 px-6 text-right font-mono font-bold">
                            {player.xp.toLocaleString()} XP
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-6">
          <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
            <CardHeader className="p-6 pb-2 text-left">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-white" />
                Rank Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 text-sm leading-relaxed text-shade-40 text-left">
              <p>
                You are currently ranked <strong className="text-white font-bold">#{userRankIndex}</strong> on your local training simulator.
              </p>
              <div className="space-y-2 pt-2 border-t border-hairline-dark">
                <div className="flex justify-between">
                  <span>Your Rank:</span>
                  <span className="font-semibold text-white">#{userRankIndex} of {sortedPlayers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Total XP:</span>
                  <span className="font-semibold text-white">{profile.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
            <CardHeader className="p-6 pb-2 text-left">
              <CardTitle className="text-xs flex items-center gap-1.5 font-bold text-white">
                <ShieldAlert className="h-4.5 w-4.5" /> Offline Sandbox Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-xs leading-relaxed text-shade-40 text-left">
              <p>
                Daywise operates entirely client-side. Scores are stored in your local browser profile storage. No global accounts or databases are maintained.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
