import React from "react";
import { Brain } from "lucide-react";
import { Container } from "../components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-32 flex flex-col items-center justify-center gap-4 text-muted">
      <div className="relative flex items-center justify-center">
        <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-accent/20 opacity-75" />
        <span className="relative rounded-full p-3 bg-accent/10 text-accent">
          <Brain className="h-6 w-6 " />
        </span>
      </div>
      <span className="text-xs font-bold text-muted/80 ">
        Synchronizing Anchors...
      </span>
    </Container>
  );
}
