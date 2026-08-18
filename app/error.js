"use client";

import React from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

export default function ErrorPage({ error, reset }) {
  return (
    <Container className="py-24 max-w-md text-center flex flex-col items-center gap-6 bg-black text-white">
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <span className="eyebrow-cap text-rose-400">Calculation Anomaly</span>
        <h1 className="display-md font-light text-white leading-tight">
          Unexpected Shift
        </h1>
        <p className="text-sm text-shade-40 leading-relaxed max-w-sm mx-auto">
          Daywise encountered a calculation boundary error. Your local training progress is safe.
        </p>
      </div>

      <Button onClick={() => reset()} variant="outline-on-dark" className="mt-2">
        <span className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Try Recalculating
        </span>
      </Button>
    </Container>
  );
}
