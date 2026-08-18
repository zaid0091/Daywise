import React, { Suspense } from "react";
import { GameClient } from "../../../components/game/GameClient";

export const dynamic = "force-dynamic";

export default function AccuracyPracticePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-semibold text-muted">Loading Accuracy Arena...</div>}>
      <GameClient mode="accuracy" />
    </Suspense>
  );
}
