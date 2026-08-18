"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Target,
  Calendar,
  Trophy,
  User,
  Settings,
  Brain,
  Flame,
  Award,
} from "lucide-react";
import { Container } from "../ui/Container";
import { useProfileStore } from "../../stores/profileStore";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Practice", href: "/practice", icon: Target },
  { label: "Daily", href: "/daily", icon: Calendar },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const profile = useProfileStore();

  useEffect(() => {
    setMounted(true);
    useProfileStore.persist.rehydrate();
  }, []);

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 w-full border-b border-hairline-dark bg-black/85 backdrop-blur-xl supports-[backdrop-filter]:bg-black/75">
        <Container className="flex h-16 items-center justify-between">
          {/* Logo with Gradient Icon */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-indigo-500 text-black font-bold shadow-[0_0_15px_rgba(52,211,153,0.35)] transition-transform group-hover:scale-105">
                <Brain className="h-4.5 w-4.5 text-black stroke-[2.5]" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Daywise
              </span>
            </Link>
            <span className="hidden text-xs text-shade-40 md:inline-block border-l border-hairline-dark pl-3 ml-1 font-mono">
              Doomsday Mental Engine
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40",
                    active
                      ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : "text-shade-40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", active ? "text-emerald-400" : "text-shade-40")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Status Badges & Settings */}
          <div className="flex items-center gap-2.5">
            {mounted && profile.streak > 0 && (
              <div
                className="hidden sm:flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-bold font-mono shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                title={`Active Streak: ${profile.streak} Days`}
              >
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{profile.streak}d</span>
              </div>
            )}

            {mounted && (
              <div
                className="hidden sm:flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold font-mono shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                title={`Level ${profile.level} • ${profile.xp.toLocaleString()} XP`}
              >
                <Award className="h-3.5 w-3.5 text-indigo-400" />
                <span>Lvl {profile.level}</span>
              </div>
            )}

            <Link
              href="/settings"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-hairline-dark bg-white/5 text-shade-40 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 cursor-pointer",
                pathname === "/settings" && "bg-white/15 text-white border-white/30"
              )}
              title="Settings & Preferences"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-hairline-dark bg-black/90 backdrop-blur-2xl px-2 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
        <nav className="flex items-center justify-around">
          {[
            ...NAV_ITEMS,
            { label: "Settings", href: "/settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all duration-200 select-none",
                  active
                    ? "text-emerald-300 font-semibold"
                    : "text-shade-40 hover:text-white"
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-full transition-all",
                    active ? "bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-transparent text-shade-40"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
