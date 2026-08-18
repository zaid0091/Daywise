import React from "react";
import DailyChallengeClient from "../../components/game/DailyChallengeClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daily Challenge — Daywise",
  description: "All users globally calculate the same dates today. One attempt per day.",
};

export default function DailyPage() {
  return <DailyChallengeClient />;
}
