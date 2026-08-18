import React from "react";
import LeaderboardClient from "../../components/leaderboard/LeaderboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leaderboard — Daywise",
  description: "Review your mental calculation progress and local rank compared to sample benchmarks.",
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
