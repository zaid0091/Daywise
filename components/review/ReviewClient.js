"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { GameClient } from "../game/GameClient";
import { useMounted } from "../../lib/shared/useMounted";
import { getDueReviews } from "../../lib/review/spacedRepetition";
import { calculateWeekDay } from "../../lib/game/dateCalculator";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Rebuild a stored review item as a question. Uses the stored ISO date, so the answer is exact.
function toQuestion(item) {
  const d = new Date(item.id);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return {
    id: `review-${item.id}`,
    date: item.id,
    formattedDate: `${MONTH_NAMES[month - 1]} ${day}, ${year}`,
    correctAnswer: calculateWeekDay(year, month, day),
    difficulty: "mixed",
  };
}

export function ReviewClient() {
  const mounted = useMounted();
  const [due, setDue] = useState([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (mounted) setDue(getDueReviews());
  }, [mounted]);

  if (!mounted) {
    return (
      <Container className="py-16 text-center text-shade-40">
        <span className="text-sm">Loading review…</span>
      </Container>
    );
  }

  if (started && due.length > 0) {
    return <GameClient mode="review" customQuestions={due.map(toQuestion)} />;
  }

  return (
    <Container className="max-w-2xl py-16 md:py-24">
      <p className="mb-4 inline-flex w-fit items-center rounded-sm border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.14em] leading-none text-shade-30">
        Review
      </p>
      <h1 className="display-md font-heading font-light tracking-tight text-white">Due today</h1>

      {due.length === 0 ? (
        <div className="mt-8 space-y-6">
          <p className="text-base leading-relaxed text-shade-30">Nothing is due. Missed dates come back here on schedule.</p>
          <Button asChild variant="outline-on-dark" size="md">
            <Link href="/practice">Back to arenas</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <p className="text-base leading-relaxed text-shade-30">
            {due.length} {due.length === 1 ? "date is" : "dates are"} due. Solve them to move each one further out.
          </p>
          <ul className="divide-y divide-hairline-dark border-y border-hairline-dark">
            {due.map((item) => (
              <li key={item.id} className="py-3 text-sm text-shade-30">{toQuestion(item).formattedDate}</li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" onClick={() => setStarted(true)} className="px-8">
              Start review
            </Button>
            <Button asChild variant="outline-on-dark" size="lg" className="px-7">
              <Link href="/practice">Back to arenas</Link>
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
