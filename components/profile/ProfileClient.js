"use client";

import React, { useEffect, useState } from "react";
import {
  Flame,
  Award,
  Timer,
  CheckCircle,
  History,
  Zap,
  Target,
  Edit2,
  Sparkles,
  Trophy,
  Brain,
  Compass,
  Star,
} from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { SectionBadge } from "../ui/SectionBadge";
import { useProfileStore } from "../../stores/profileStore";
import { getLevelProgress } from "../../lib/game/levels";
import { StatsCharts } from "../charts/StatsCharts";
import { ACHIEVEMENTS } from "../../data/achievements";
import { cn } from "../../lib/utils";

const AVATAR_OPTIONS = [
  { id: "brain", label: "Calculator", icon: Brain },
  { id: "zap", label: "Speedster", icon: Zap },
  { id: "target", label: "Bullseye", icon: Target },
  { id: "star", label: "Master", icon: Star },
];

export default function ProfileClient() {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");

  const profile = useProfileStore();

  useEffect(() => {
    setMounted(true);
    useProfileStore.persist.rehydrate();
    setTempName(profile.displayName);
  }, [profile.displayName]);

  const handleSaveProfile = () => {
    if (!tempName.trim()) {
      alert("Display name cannot be empty.");
      return;
    }
    profile.setDisplayName(tempName.trim());
    setIsEditing(false);
  };

  if (!mounted) {
    return (
      <Container className="py-8 bg-black text-white">
        <div className="text-center py-20">
          <p className="text-shade-40">Loading Profile...</p>
        </div>
      </Container>
    );
  }

  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === profile.avatar) || AVATAR_OPTIONS[0];
  const AvatarIcon = currentAvatar.icon;

  const { level, xpInCurrentLevel, xpNeededForNextLevel, xpRemaining, percent } = getLevelProgress(profile.xp);

  const totalQuestions = profile.history?.reduce((acc, h) => acc + h.totalQuestions, 0) || 0;
  const totalCorrect = profile.history?.reduce((acc, h) => acc + h.correctCount, 0) || 0;
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalSessions = profile.history?.length || 0;

  const metrics = [
    {
      label: "Active Streak",
      value: `${profile.streak} Days`,
      desc: `Longest: ${profile.longestStreak}d`,
      icon: Flame,
      color: "text-amber-300",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    },
    {
      label: "Fastest Answer",
      value: profile.records.fastestCorrect ? `${profile.records.fastestCorrect.toFixed(1)}s` : "--",
      desc: "Correct solve speed",
      icon: Timer,
      color: "text-cyan-300",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    },
    {
      label: "Accuracy Rate",
      value: `${accuracy}%`,
      desc: `${totalCorrect}/${totalQuestions} solves`,
      icon: CheckCircle,
      color: "text-emerald-300",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    },
    {
      label: "Practice Sessions",
      value: `${totalSessions}`,
      desc: "Completed rounds",
      icon: History,
      color: "text-indigo-300",
      iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25 shadow-[0_0_15px_rgba(99,102,241,0.15)]",
    },
  ];

  return (
    <Container className="py-8 max-w-5xl bg-black text-white">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 border-b border-hairline-dark py-8 md:py-10 mb-8 text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar Icon */}
          <div className="h-18 w-18 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-indigo-500/20 text-white border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            <AvatarIcon className="h-9 w-9 text-emerald-300" />
          </div>

          <div className="space-y-1">
            {isEditing ? (
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  maxLength={20}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-canvas-night-elevated border border-emerald-500/40 px-3 py-1.5 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold text-white"
                />
                <Button size="sm" variant="primary" onClick={handleSaveProfile}>Save</Button>
                <Button size="sm" variant="outline-on-dark" onClick={() => { setIsEditing(false); setTempName(profile.displayName); }}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h1 className="display-md text-white font-light leading-none tracking-tight font-heading">{profile.displayName}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-white/10 border border-transparent hover:border-hairline-dark text-shade-40 hover:text-white rounded-full transition-all cursor-pointer"
                  title="Edit Display Name"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="pt-2">
              <SectionBadge variant="emerald">
                Role: Doomsday Apprentice
              </SectionBadge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-canvas-night-elevated p-4 rounded-2xl border border-hairline-dark shrink-0">
          <div className="text-center px-4 border-r border-hairline-dark">
            <span className="text-[10px] text-shade-40 font-bold uppercase tracking-wider block font-mono">Level</span>
            <span className="font-heading text-2xl font-bold text-indigo-300">{profile.level}</span>
          </div>
          <div className="text-center px-4">
            <span className="text-[10px] text-shade-40 font-bold uppercase tracking-wider block font-mono">Total XP</span>
            <span className="font-heading text-2xl font-bold text-emerald-300">{profile.xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Avatar Customization Cards */}
      {isEditing && (
        <Card className="mb-8 border border-white/10 bg-white/5 rounded-2xl">
          <CardHeader className="p-6 pb-2 text-left">
            <CardTitle className="text-base font-bold text-white">Choose Avatar Style</CardTitle>
            <CardDescription className="text-xs text-shade-40">Customize your visual badge.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AVATAR_OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              const active = profile.avatar === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => profile.setAvatar(opt.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-200",
                    active ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-hairline-dark bg-canvas-night-elevated text-white"
                  )}
                >
                  <div className="p-2.5 rounded-full bg-white/5 text-white mb-2">
                    <OptIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Level XP Progress Bar */}
      <Card className="mb-8 border border-hairline-dark bg-canvas-night-elevated rounded-2xl">
        <CardContent className="p-6 space-y-3 text-left">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white font-mono">
            <span>Level {level} Progress</span>
            <span className="text-indigo-300">{xpInCurrentLevel} / {xpNeededForNextLevel} XP</span>
          </div>
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-shade-40">
            {xpRemaining.toLocaleString()} XP remaining to reach Level {level + 1}.
          </p>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border border-hairline-dark bg-canvas-night-elevated rounded-2xl hover:border-white/20 transition-all">
              <CardContent className="p-5 flex items-center gap-4 text-left">
                <div className={cn("p-2.5 rounded-xl shrink-0 border flex items-center justify-center", metric.iconBg)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-shade-40 block font-semibold uppercase tracking-wider font-mono">{metric.label}</span>
                  <span className={cn("font-heading text-xl font-bold block mt-0.5", metric.color)}>{metric.value}</span>
                  <span className="text-[9px] text-shade-40 block mt-0.5">{metric.desc}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Personal Records Cards */}
      <Card className="mb-8 border border-hairline-dark bg-canvas-night-elevated rounded-2xl">
        <CardHeader className="p-6 pb-2 border-b border-hairline-dark/60 text-left">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Award className="h-5 w-5 text-amber-400" /> Personal Bests
          </CardTitle>
          <CardDescription className="text-xs text-shade-40">Your highest local scores and milestones.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 font-sans text-xs text-left">
          <div className="border border-hairline-dark p-4 rounded-xl bg-black/60">
            <span className="text-shade-40 block font-mono">Fastest Solve:</span>
            <strong className="text-lg text-cyan-300 block mt-1 font-mono">
              {profile.records.fastestCorrect ? `${profile.records.fastestCorrect.toFixed(1)}s` : "--"}
            </strong>
          </div>
          <div className="border border-hairline-dark p-4 rounded-xl bg-black/60">
            <span className="text-shade-40 block font-mono">High Score (Timed):</span>
            <strong className="text-lg text-amber-300 block mt-1 font-mono">
              {(profile.records.bestTimedScore ?? 0).toLocaleString()} pts
            </strong>
          </div>
          <div className="border border-hairline-dark p-4 rounded-xl bg-black/60">
            <span className="text-shade-40 block font-mono">High Score (Speed):</span>
            <strong className="text-lg text-emerald-300 block mt-1 font-mono">
              {(profile.records.mostSpeedRunSolves ?? 0).toLocaleString()} solves
            </strong>
          </div>
        </CardContent>
      </Card>

      {/* Stats Charts */}
      <div className="mb-8">
        <StatsCharts />
      </div>

      {/* Achievements Badges */}
      <Card className="border border-hairline-dark bg-canvas-night-elevated rounded-2xl">
        <CardHeader className="p-6 pb-2 border-b border-hairline-dark/60 text-left">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Trophy className="h-5 w-5 text-amber-400" /> Achievement Milestones
          </CardTitle>
          <CardDescription className="text-xs text-shade-40">Badges earned through mental date mastery.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = (profile.unlockedAchievements ?? []).includes(ach.id);
            return (
              <div
                key={ach.id}
                className={cn(
                  "p-4 rounded-xl border flex items-start gap-3 text-left transition-all duration-200",
                  isUnlocked
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-white/5 border-hairline-dark text-shade-40 opacity-40"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg shrink-0",
                    isUnlocked ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-shade-40"
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <strong className={cn("text-xs block font-bold", isUnlocked ? "text-emerald-200" : "text-shade-40")}>
                    {ach.name}
                  </strong>
                  <p className="text-[11px] text-shade-40 leading-snug">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </Container>
  );
}
