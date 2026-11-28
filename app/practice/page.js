import React from "react";
import { PageReveal } from "../../components/shared/PageReveal";
import PracticeClient from "../../components/practice/PracticeClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Practice Arenas — Daywise",
  description: "Choose a training mode to build your Doomsday mental calculation speed, streaks, or test under time pressure.",
};

export default function PracticePage() {
  return (
    <PageReveal>
      <PracticeClient />
    </PageReveal>
  );
}
