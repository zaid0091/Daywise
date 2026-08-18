"use client";

import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-hairline-dark bg-black mt-auto overflow-hidden pb-16 md:pb-0">
      <Container className="max-w-7xl pt-10 md:pt-14 pb-6 flex flex-col justify-between">
        {/* Top Section: Split Headline & Link Columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12 mb-4 md:mb-6">
          {/* Left Column: Bold Editorial Headline */}
          <div className="max-w-sm">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-light text-white leading-tight">
              Know the day on your next glance.
            </h2>
          </div>

          {/* Right Columns: 3 Navigation Link Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16 text-sm md:text-[15px]">
            {/* Column 1: Method */}
            <div className="space-y-3 flex flex-col">
              <span className="text-xs font-mono uppercase tracking-widest text-shade-50 font-semibold mb-1">
                Method
              </span>
              <Link href="/learn/the-idea" className="text-shade-40 hover:text-white transition-colors duration-150">
                The Core Idea
              </Link>
              <Link href="/learn/anchor-days" className="text-shade-40 hover:text-white transition-colors duration-150">
                Anchor Days
              </Link>
              <Link href="/learn/century-anchors" className="text-shade-40 hover:text-white transition-colors duration-150">
                Century Anchors
              </Link>
              <Link href="/learn/year-calculation" className="text-shade-40 hover:text-white transition-colors duration-150">
                Year Calculation
              </Link>
              <Link href="/learn/month-anchors" className="text-shade-40 hover:text-white transition-colors duration-150">
                Month Anchors
              </Link>
            </div>

            {/* Column 2: Arenas */}
            <div className="space-y-3 flex flex-col">
              <span className="text-xs font-mono uppercase tracking-widest text-shade-50 font-semibold mb-1">
                Training
              </span>
              <Link href="/practice" className="text-shade-40 hover:text-white transition-colors duration-150">
                Practice Arenas
              </Link>
              <Link href="/daily" className="text-shade-40 hover:text-white transition-colors duration-150">
                Daily Challenge
              </Link>
              <Link href="/practice/timed" className="text-shade-40 hover:text-white transition-colors duration-150">
                Timed Sprint
              </Link>
              <Link href="/practice/speed" className="text-shade-40 hover:text-white transition-colors duration-150">
                Speed Run
              </Link>
              <Link href="/practice/relaxed" className="text-shade-40 hover:text-white transition-colors duration-150">
                Relaxed Sandbox
              </Link>
            </div>

            {/* Column 3: Project & Details */}
            <div className="space-y-3 flex flex-col col-span-2 sm:col-span-1">
              <span className="text-xs font-mono uppercase tracking-widest text-shade-50 font-semibold mb-1">
                Daywise
              </span>
              <Link href="/about" className="text-shade-40 hover:text-white transition-colors duration-150">
                About the Method
              </Link>
              <Link href="/leaderboard" className="text-shade-40 hover:text-white transition-colors duration-150">
                Leaderboard
              </Link>
              <Link href="/profile" className="text-shade-40 hover:text-white transition-colors duration-150">
                Profile & Records
              </Link>
              <Link href="/settings" className="text-shade-40 hover:text-white transition-colors duration-150">
                Settings
              </Link>
              <a
                href="https://github.com/zaid0091/Daywise"
                target="_blank"
                rel="noreferrer"
                className="text-shade-40 hover:text-white transition-colors duration-150"
              >
                GitHub Source
              </a>
            </div>
          </div>
        </div>

        {/* Center: Massive Dual-Tone Typography Watermark */}
        <div className="w-full select-none leading-none overflow-hidden my-2 md:my-3 flex items-center justify-center text-center">
          <div className="inline-flex items-center justify-center tracking-tighter">
            <span className="font-heading font-black text-white text-[17vw] sm:text-[15vw] md:text-[14vw] leading-none inline-block">
              Day
            </span>
            <span className="font-heading font-black text-emerald-400 text-[17vw] sm:text-[15vw] md:text-[14vw] leading-none inline-block">
              wise
            </span>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="w-full border-t border-hairline-dark/70 pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-shade-40">
          <div className="flex flex-wrap items-center gap-5 sm:gap-7">
            <span className="text-white font-medium">&copy; {currentYear} Daywise</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Method Guide
            </Link>
            <Link href="/learn" className="hover:text-white transition-colors">
              Curriculum
            </Link>
            <Link href="/settings" className="hover:text-white transition-colors">
              Preferences
            </Link>
          </div>

          <div className="text-xs sm:text-sm font-mono tracking-widest uppercase text-shade-40">
            A PROJECT BY{" "}
            <a
              href="https://github.com/zaid0091"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline transition-all"
            >
              ZAID0091
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
