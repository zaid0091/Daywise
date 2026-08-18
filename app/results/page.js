import React from "react";
import Link from "next/link";
import { ArrowLeft, Award, Trophy, Timer, CheckCircle, RefreshCw } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function ResultsPage() {
  const mockResults = {
    mode: "Speed Sprint",
    correct: 8,
    total: 10,
    time: "24.5s",
    avgSpeed: "3.1s/date",
    xpEarned: 80,
  };

  return (
    <Container className="py-8 max-w-xl">
      <div className="mb-6">
        <Link href="/practice" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Practice
        </Link>
      </div>

      <Card className="border border-border shadow-md text-center overflow-hidden">
        <div className="bg-success/15 border-b border-border/60 py-6 text-success flex flex-col items-center gap-1">
          <Award className="h-10 w-10 text-success" />
          <h1 className="font-heading text-2xl font-extrabold tracking-tight">Round Completed!</h1>
          <p className="text-sm font-medium text-success/90">{mockResults.mode}</p>
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border p-4 rounded-xl bg-surface">
              <span className="text-xs text-muted block font-medium">Score</span>
              <span className="font-heading text-2xl font-bold text-foreground block mt-1">
                {mockResults.correct} / {mockResults.total}
              </span>
            </div>
            <div className="border border-border p-4 rounded-xl bg-surface">
              <span className="text-xs text-muted block font-medium">XP Earned</span>
              <span className="font-heading text-2xl font-bold text-accent block mt-1">
                +{mockResults.xpEarned} XP
              </span>
            </div>
            <div className="border border-border p-4 rounded-xl bg-surface">
              <span className="text-xs text-muted block font-medium">Total Time</span>
              <span className="font-heading text-2xl font-bold text-foreground block mt-1">
                {mockResults.time}
              </span>
            </div>
            <div className="border border-border p-4 rounded-xl bg-surface">
              <span className="text-xs text-muted block font-medium">Avg Latency</span>
              <span className="font-heading text-2xl font-bold text-foreground block mt-1 font-mono">
                {mockResults.avgSpeed}
              </span>
            </div>
          </div>

          {/* Interactive alert explaining it's a shell */}
          <div className="bg-surface-hover border border-border rounded-lg p-4 text-xs text-muted text-left">
            <p className="font-semibold text-foreground mb-1">Results Route Shell</p>
            <p>This results screen is the base layout structure for post-round evaluations. Actual route redirects and score states will be wired to the gameplay mechanics in Phase 2.</p>
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
          <Button asChild variant="primary" className="w-full sm:flex-1">
            <Link href="/practice" className="flex items-center justify-center gap-1.5">
              Practice Again <RefreshCw className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:flex-1">
            <Link href="/leaderboard" className="flex items-center justify-center gap-1.5">
              Leaderboard <Trophy className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
