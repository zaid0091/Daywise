import React, { Suspense } from "react";
import { GameClient } from "../../../components/game/GameClient";

export const dynamic = "force-dynamic";

export default function RelaxedPracticePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-shade-50 font-medium">Loading</div>}>
      <GameClient mode="relaxed" />
    </Suspense>
  );
}
