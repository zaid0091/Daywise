import React from "react";
import { PageReveal } from "../../components/shared/PageReveal";
import LeaderboardClient from "../../components/leaderboard/LeaderboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leaderboard — Daywise",
  description: "Review your mental calculation progress and local rank compared to sample benchmarks.",
};

export default function LeaderboardPage() {
  return (
    <PageReveal>
      <LeaderboardClient />
    </PageReveal>
  );
}
