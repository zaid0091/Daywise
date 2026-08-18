"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Target,
  Calendar,
  Trophy,
  User,
  Settings,
  Flame,
  Award,
} from "lucide-react";
import { useProfileStore } from "../../stores/profileStore";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Practice", href: "/practice", icon: Target },
  { label: "Daily", href: "/daily", icon: Calendar },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Profile", href: "/profile", icon: User },
];

const SCROLL_THRESHOLD = 40;

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const profile = useProfileStore();

  useEffect(() => {
    setMounted(true);
    useProfileStore.persist.rehydrate();
  }, []);

  const handleScroll = useCallback(() => {
    const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if (y > SCROLL_THRESHOLD) {
      document.documentElement.classList.add("scrolled");
    } else {
      document.documentElement.classList.remove("scrolled");
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navbar — single fixed bar that morphs via CSS */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-header">
        <div className="nav-inner">
          {/* Brand */}
          <Link href="/" className="flex items-center focus-visible:outline-none group nav-brand-link shrink-0">
            <span className="font-heading font-extrabold tracking-tight text-white group-hover:opacity-90 nav-brand-text">
              Day<span className="text-emerald-400">wise</span>
            </span>
          </Link>

          {/* Center Nav — desktop only */}
          <div className="hidden md:flex items-center gap-1 nav-center-pill">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full font-medium focus-visible:outline-none nav-link-item",
                    active
                      ? "text-white bg-white/10 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                      : "text-shade-40 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  <Icon className={cn("nav-link-icon", active ? "text-emerald-400" : "text-shade-40")} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Badges & Settings */}
          <div className="flex items-center gap-2.5 shrink-0">
            {mounted && profile.streak > 0 && (
              <div
                className="hidden sm:flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold font-mono shrink-0 nav-badge-item"
                title={`Active Streak: ${profile.streak} Days`}
              >
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{profile.streak}d</span>
              </div>
            )}

            {mounted && (
              <div
                className="hidden sm:flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold font-mono shrink-0 nav-badge-item"
                title={`Level ${profile.level} • ${profile.xp.toLocaleString()} XP`}
              >
                <Award className="h-3.5 w-3.5 text-indigo-400" />
                <span>Lvl {profile.level}</span>
              </div>
            )}

            <Link
              href="/settings"
              className={cn(
                "flex items-center justify-center rounded-full border border-hairline-dark bg-white/5 text-shade-40 hover:bg-white/10 hover:text-white hover:border-white/20 focus-visible:outline-none cursor-pointer nav-settings-btn",
                pathname === "/settings" && "bg-white/15 text-white border-white/30"
              )}
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="nav-settings-icon" />
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[72px]" />

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-white/[0.08] bg-black/90 backdrop-blur-2xl px-2 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
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
