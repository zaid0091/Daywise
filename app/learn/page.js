import React from "react";
import { PageReveal } from "../../components/shared/PageReveal";
import { LearnClient } from "../../components/learning/LearnClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doomsday Method Training Curriculum — Daywise",
  description: "Learn Conway's Doomsday Rule step by step. Master anchor days, leap year offsets, and speed technique shortcuts through 10 structured lesson modules.",
  openGraph: {
    title: "Doomsday Method Training Curriculum — Daywise",
    description: "Learn Conway's Doomsday Rule step by step. Master anchor days, leap year offsets, and speed technique shortcuts.",
    type: "website",
  },
};

export default function LearnPage() {
  return (
    <PageReveal>
      <LearnClient />
    </PageReveal>
  );
}
