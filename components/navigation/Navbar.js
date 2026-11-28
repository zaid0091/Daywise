
"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useProfileStore } from "../../stores/profileStore";
import { useMounted } from "../../lib/shared/useMounted";
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NAV_ITEMS = [
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Practice", href: "/practice", icon: Target },
  { label: "Daily", href: "/daily", icon: Calendar },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const profile = useProfileStore();
  const navRef = useRef(null);

  useEffect(() => {
    useProfileStore.persist.rehydrate();
  }, []);

  useGSAP(() => {
    // Hysteresis: the bar compacts past 80px and expands again only below 24px, so scroll
    // jitter around a single threshold cannot toggle the state back and forth.
    const root = document.documentElement;
    const apply = (y) => {
      if (!root.classList.contains("scrolled") && y > 80) root.classList.add("scrolled");
      else if (root.classList.contains("scrolled") && y < 24) root.classList.remove("scrolled");
    };
    // Read the real scroll position on every scroll event, so the state does not depend on
    // ScrollTrigger's measured positions (those go stale when pages mount content later).
    const onScroll = () => apply(window.scrollY);
    apply(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Magnetic pull on desktop links and the settings button. Fine pointers only; motion allowed.
    const mm = gsap.matchMedia();
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const cleanups = [];
      gsap.utils.toArray("[data-nav-magnetic]", navRef.current).forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.2);
          yTo((e.clientY - r.top - r.height / 2) * 0.2);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set(el, { clearProps: "transform" });
        });
      });
      return () => cleanups.forEach((fn) => fn());
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, { scope: navRef });

  // Sliding indicator: glides to the active link on route change; jumps on resize.
  const pillRef = useRef(null);
  const indicatorRef = useRef(null);
  const placedOnce = useRef(false);
  useEffect(() => {
    const pill = pillRef.current;
    const ind = indicatorRef.current;
    if (!pill || !ind) return;

    const place = (animate) => {
      const active = pill.querySelector('[aria-current="page"]');
      if (!active) {
        gsap.to(ind, { opacity: 0, duration: 0.2 });
        return;
      }
      const pr = pill.getBoundingClientRect();
      const ar = active.getBoundingClientRect();
      const to = {
        x: ar.left - pr.left - pill.clientLeft,
        y: ar.top - pr.top - pill.clientTop,
        width: ar.width,
        height: ar.height,
        opacity: 1,
      };
      if (animate) gsap.to(ind, { ...to, duration: 0.65, ease: "expo.out" });
      else gsap.set(ind, to);
    };

    // First placement jumps into position; later route changes glide from the previous link.
    place(placedOnce.current);
    placedOnce.current = true;

    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <div ref={navRef}>
      {/* Desktop Navbar — single fixed bar that morphs via CSS */}
      <header className="fixed top-0 left-0 right-0 z-50 nav-header">
        <div className="nav-inner">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-none group nav-brand-link shrink-0"
          >
            <Image
              src="/logo.svg"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
              alt="Daywise Logo"
            />
            <span className="font-heading font-medium tracking-tight text-white group-hover:text-shade-30 nav-brand-text">
              Daywise
            </span>
          </Link>

          {/* Center Nav — desktop only */}
          <div ref={pillRef} className="relative hidden md:flex items-center gap-1 nav-center-pill bg-white/5 border border-white/10 rounded-xl">
            <div
              ref={indicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 rounded-lg border border-white/15 bg-white/10 opacity-0"
            />
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-nav-magnetic
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg font-medium focus-visible:outline-none nav-link-item",
                    active
                      ? "text-white"
                      : "text-shade-40 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  <Icon
                    className={cn(
                      "nav-link-icon",
                      active ? "text-white" : "text-shade-40"
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Badges & Settings */}
          <div className="flex items-center gap-2.5 shrink-0">
            {mounted && profile.streak > 0 && (
              <div
                className="hidden sm:flex items-center gap-1.5 border border-white/10 rounded-md text-shade-30 text-xs tabular-nums shrink-0 nav-badge-item"
                title={`Active Streak: ${profile.streak} Days`}
              >
                <Flame className="h-3.5 w-3.5 text-shade-30" />
                <span>{profile.streak}d</span>
              </div>
            )}

            {mounted && (
              <div
                className="hidden sm:flex items-center gap-1.5 border border-white/10 rounded-md text-shade-30 text-xs tabular-nums shrink-0 nav-badge-item"
                title={`Level ${profile.level} • ${profile.xp.toLocaleString()} XP`}
              >
                <Award className="h-3.5 w-3.5 text-shade-30" />
                <span>Lvl {profile.level}</span>
              </div>
            )}

            <Link
              href="/settings"
              data-nav-magnetic
              className={cn(
                "flex items-center justify-center rounded-xl border border-hairline-dark bg-white/5 text-shade-40 hover:bg-white/10 hover:text-white hover:border-white/20 focus-visible:outline-none cursor-pointer nav-settings-btn",
                pathname === "/settings" &&
                  "bg-white/15 text-white border-white/30"
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
      <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-white/[0.08] bg-black px-2 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
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
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors duration-200 select-none",
                  active
                    ? "text-white font-semibold"
                    : "text-shade-40 hover:text-white"
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "bg-transparent text-shade-40"
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
    </div>
  );
}
