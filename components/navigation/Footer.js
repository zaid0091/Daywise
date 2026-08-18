import React from "react";
import Link from "next/link";
import { Brain, Heart } from "lucide-react";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="w-full border-t border-hairline-dark bg-black mt-auto pb-16 md:pb-0">
      <Container className="flex flex-col items-center justify-center gap-6 py-12 md:py-16 text-center">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white">
            <Brain className="h-3.5 w-3.5" />
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-white">
            Daywise
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs md:text-sm">
          <Link
            href="/learn"
            className="text-shade-40 hover:text-white transition-colors duration-200"
          >
            Curriculum
          </Link>
          <Link
            href="/practice"
            className="text-shade-40 hover:text-white transition-colors duration-200"
          >
            Practice Arenas
          </Link>
          <Link
            href="/daily"
            className="text-shade-40 hover:text-white transition-colors duration-200"
          >
            Daily Challenge
          </Link>
          <Link
            href="/leaderboard"
            className="text-shade-40 hover:text-white transition-colors duration-200"
          >
            Leaderboard
          </Link>
          <Link
            href="/about"
            className="text-shade-40 hover:text-white transition-colors duration-200"
          >
            About the Method
          </Link>
          <Link
            href="/settings"
            className="text-shade-40 hover:text-white transition-colors duration-200"
          >
            Settings
          </Link>
        </div>

        {/* Credits */}
        <div className="space-y-1 text-xs text-shade-50">
          <p>
            Based on John Horton Conway&apos;s mental Doomsday algorithm (1973).
          </p>
          <p>
            &copy; {new Date().getFullYear()} Daywise. Calculate any calendar day in your head.
          </p>
        </div>
      </Container>
    </footer>
  );
}
