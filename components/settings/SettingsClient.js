"use client";

import React, { useEffect, useState } from "react";
import { ScrambleText } from "../shared/ScrambleText";
import {
  ShieldAlert,
  RotateCcw,
  User,
  Brain,
  Trophy,
  Calendar,
  Keyboard,
  Info,
} from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { SectionBadge } from "../ui/SectionBadge";
import { useSettingsStore } from "../../stores/settingsStore";
import { useProfileStore } from "../../stores/profileStore";
import { useDailyStore } from "../../stores/dailyStore";
import { cn } from "../../lib/utils";

const AVATAR_OPTIONS = [
  { id: "indigo-brain", label: "Indigo Brain", icon: Brain, color: "text-white", bg: "bg-white/5 border-white/10" },
  { id: "emerald-zap", label: "Emerald Zap", icon: Brain, color: "text-white", bg: "bg-white/5 border-white/10" },
  { id: "rose-trophy", label: "Rose Trophy", icon: Trophy, color: "text-white", bg: "bg-white/5 border-white/10" },
  { id: "amber-calendar", label: "Amber Calendar", icon: Calendar, color: "text-white", bg: "bg-white/5 border-white/10" },
];

export default function SettingsClient() {
  const [mounted, setMounted] = useState(false);
  const settings = useSettingsStore();
  const profile = useProfileStore();
  const daily = useDailyStore();

  const [tempName, setTempName] = useState("");

  useEffect(() => {
    useSettingsStore.persist.rehydrate();
    useProfileStore.persist.rehydrate();
    useDailyStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setTempName(profile.displayName);
    }
  }, [profile.displayName, mounted]);

  const handleSaveName = () => {
    if (!tempName.trim()) {
      alert("Display name cannot be empty.");
      return;
    }
    profile.setDisplayName(tempName.trim());
    alert("Display name updated!");
  };

  const handleReset = () => {
    const confirm = window.confirm(
      "Are you sure you want to reset all Daywise training data? This will permanently delete your Level, XP, Achievements, Streak Logs, and completed daily challenge history. Unrelated browser storage will NOT be affected."
    );
    if (confirm) {
      profile.resetProfile();
      daily.resetDaily();
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("daywise-profile-v2");
        localStorage.removeItem("daywise-daily-attempts");
        localStorage.removeItem("daywise-completed-lessons");
        localStorage.removeItem("daywise-settings-v2");
        window.location.reload();
      }
    }
  };

  if (!mounted) {
    return (
      <Container className="py-8 bg-black text-white">
        <div className="text-center py-20">
          <p className="text-shade-40">Loading settings…</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-3xl bg-black text-white">
      {/* Page Header */}
      <div className="flex flex-col items-center gap-3 border-b border-hairline-dark py-8 md:py-10 mb-8 text-center">
        <SectionBadge variant="emerald">Preferences</SectionBadge>
        <h1 className="display-md text-white font-light leading-none tracking-tight font-heading">
          <ScrambleText>Settings</ScrambleText>
        </h1>
        <p className="text-base text-shade-40 max-w-xl mx-auto">
          Configure your Daywise training environment, user identity details, audio logs, and accessibility preferences.
        </p>
      </div>

      <div className="space-y-6 pb-12 text-left">
        {/* User Identity Customization */}
        <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5" /> Profile Customization
            </CardTitle>
            <CardDescription className="text-xs text-shade-40">Update your training alias and card avatar.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-dark/50 pb-4">
              <div className="space-y-1">
                <span className="font-semibold text-sm block text-white">Display Name</span>
                <span className="text-xs text-shade-40 block">Used on local practice benchmarks.</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={20}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-canvas-night border border-hairline-dark px-4 py-1.5 text-sm rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus:ring-2 focus:ring-accent font-semibold text-white"
                />
                <Button size="sm" variant="outline-on-dark" onClick={handleSaveName}>
                  Save
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-semibold text-sm block text-white">Avatar Choice</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map((opt) => {
                  const OptIcon = opt.icon;
                  const active = profile.avatar === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => profile.setAvatar(opt.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer hover:bg-white/10 transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200",
                        active ? "border-white bg-canvas-night text-white" : "border-hairline-dark bg-canvas-night-elevated text-white"
                      )}
                    >
                      <div className="p-2 rounded-full bg-white/5 text-white mb-1.5">
                        <OptIcon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-xs font-semibold">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Ranges Training Card */}
        <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold text-white">Training Date Ranges</CardTitle>
            <CardDescription className="text-xs text-shade-40">Select the target centuries to display during practice games.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: "2000-2099", label: "2000 - 2099 (Current)", desc: "Best for beginners" },
                { id: "1900-1999", label: "1900 - 1999", desc: "Classic 20th century" },
                { id: "all", label: "All Centuries", desc: "1600s to 2100s" },
              ].map((r) => {
                const active = settings.dateRange === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => settings.setDateRange(r.id)}
                    className={cn(
                      "flex flex-col items-start gap-1 p-4 border rounded-xl text-left cursor-pointer transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 hover:bg-white/5",
                      active
                        ? "border-white bg-white text-black shadow-sm"
                        : "border-hairline-dark bg-canvas-night text-white"
                    )}
                  >
                    <span className="font-semibold text-sm">{r.label}</span>
                    <span className={cn("text-xs mt-0.5", active ? "text-shade-60" : "text-shade-40")}>
                      {r.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sounds & Audio Card */}
        <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold text-white">Audio Settings</CardTitle>
            <CardDescription className="text-xs text-shade-40">Configure sound chimes and feedback.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 p-2">
              <div>
                <span className="font-semibold text-sm block text-white">Sound Effects</span>
                <span className="text-xs text-shade-40 block">Play synthetic audio beeps on success, error, and level-ups.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => settings.setSoundEnabled(e.target.checked)}
                className="h-5 w-5 rounded border-hairline-dark bg-white/5 text-white accent-white focus:ring-white cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility & Reduced Motion Card */}
        <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="h-5 w-5" /> Accessibility
            </CardTitle>
            <CardDescription className="text-xs text-shade-40">Manage user assistance options.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 p-2">
              <div>
                <span className="font-semibold text-sm block text-white">Reduced Motion</span>
                <span className="text-xs text-shade-40 block">Suppress slide-in effects and transition durations.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => settings.setReducedMotion(e.target.checked)}
                className="h-5 w-5 rounded border-hairline-dark bg-white/5 text-white accent-white focus:ring-white cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts discoverability panel */}
        <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-xl">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Keyboard className="h-5 w-5" /> Keyboard Shortcuts Guide
            </CardTitle>
            <CardDescription className="text-xs text-shade-40">Quick discoverable desktop training hotkeys.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3.5 font-sans text-xs text-shade-40">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-hairline-dark/50 pb-2.5">
              <span>Choose Weekday Answers:</span>
              <kbd className="bg-white/10 border border-white/10 px-2.5 py-1 rounded font-mono text-[10px] text-white font-bold">
                1 - 7
              </kbd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-hairline-dark/50 pb-2.5">
              <span>Advance to next card on incorrect explanations:</span>
              <kbd className="bg-white/10 border border-white/10 px-2.5 py-1 rounded font-mono text-[10px] text-white font-bold">
                Enter
              </kbd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-hairline-dark/50 pb-2.5">
              <span>Start challenge sequences:</span>
              <kbd className="bg-white/10 border border-white/10 px-2.5 py-1 rounded font-mono text-[10px] text-white font-bold">
                Space / Enter
              </kbd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span>Quit / reset active training arena:</span>
              <kbd className="bg-white/10 border border-white/10 px-2.5 py-1 rounded font-mono text-[10px] text-white font-bold">
                Escape
              </kbd>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone / resets */}
        <Card className="border border-red-950 bg-red-955/20 text-red-400 rounded-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> Danger Zone
            </CardTitle>
            <CardDescription className="text-xs text-red-400/80">Irreversible local actions.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <span className="text-xs text-red-400/80 leading-relaxed">
              Resetting deletes Level progress, streaks, achievements, custom names, and historical challenge records. Other browser cache elements are untouched.
            </span>
            <Button variant="outline-on-dark" className="border-red-900 bg-red-950 text-red-400 hover:text-red-350 hover:bg-red-900/40 shrink-0 border cursor-pointer" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1.5" /> Reset All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
