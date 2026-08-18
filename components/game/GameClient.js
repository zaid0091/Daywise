"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Award,
  Timer,
  RefreshCw,
  Zap,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Medal,
  Activity,
} from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/Card";
import { useGameStore } from "../../stores/gameStore";
import { useProfileStore } from "../../stores/profileStore";
import { useDailyStore } from "../../stores/dailyStore";
import { getLocalDateString } from "../../lib/game/streaks";
import { generateDailyQuestions } from "../../lib/game/dailyChallenge";
import { getDoomsdayExplanation } from "../../lib/game/dateCalculator";
import { cn } from "../../lib/utils";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function GameClient({ mode: initialMode }) {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("diff") || "medium";

  const store = useGameStore();
  const profile = useProfileStore();

  const [selectedDuration, setSelectedDuration] = useState(60); // for speed mode
  const [mounted, setMounted] = useState(false);

  // Time tracking reference
  const questionStartTimeRef = useRef(0);
  const timerIntervalRef = useRef(null);

  // Hydrate stores on mount
  useEffect(() => {
    setMounted(true);
    store.resetGame();
    useProfileStore.persist.rehydrate();
    return () => {
      stopInterval();
    };
  }, []);

  // Sync intervals for countdown or elapsed clocks
  useEffect(() => {
    if (store.gameState === "playing") {
      questionStartTimeRef.current = performance.now();
      startInterval();
    } else {
      stopInterval();
    }
  }, [store.gameState]);

  // Track start time on index changes
  useEffect(() => {
    if (store.gameState === "playing" && !store.currentAnswer) {
      questionStartTimeRef.current = performance.now();
    }
  }, [store.currentIndex, store.currentAnswer, store.gameState]);

  // Check round completions and award XP/records
  useEffect(() => {
    if (store.gameState === "completed") {
      const totalQuestions = store.answers.length;
      const correctAnswers = store.answers.filter((a) => a.isCorrect);
      const correctCount = correctAnswers.length;
      const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      
      const fastestCorrectSolve =
        correctAnswers.length > 0
          ? Math.min(...correctAnswers.map((a) => a.responseTimeSeconds))
          : null;

      if (initialMode === "daily") {
        const todayStr = getLocalDateString();
        
        // 1. Save attempt
        useDailyStore.getState().saveAttempt(todayStr, {
          score: store.score,
          accuracy,
          elapsedTime: store.elapsedTime,
          answers: store.answers,
        });

        // 2. Submit daily activity to profile
        profile.submitActivity("daily", {
          completedAll: true,
          accuracy,
          lastDifficulty: "mixed",
          lastSpeed: fastestCorrectSolve,
        });

        // 3. Award daily challenge XP (+150 XP)
        profile.addXp(150);
      } else {
        // Submit activity to update streaks, records, achievements
        profile.submitActivity("practice", {
          mode: initialMode,
          score: store.score,
          correctCount,
          accuracy,
          fastestCorrectSolve,
          difficulty,
        });

        // Award +50 XP for completing a practice round
        profile.addXp(50);
      }
    }
  }, [store.gameState]);

  const startInterval = () => {
    stopInterval();
    timerIntervalRef.current = setInterval(() => {
      store.tickTimer();
    }, 1000);
  };

  const stopInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Keyboard Shortcuts (1 = Monday ... 7 = Sunday, Enter = Next on explanation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (store.gameState !== "playing") return;

      if (store.currentAnswer && !store.currentAnswer.isCorrect && e.key === "Enter") {
        e.preventDefault();
        store.goToNextQuestion();
        return;
      }

      if (!store.currentAnswer) {
        const key = e.key;
        const keyNum = parseInt(key, 10);
        if (keyNum >= 1 && keyNum <= 7) {
          e.preventDefault();
          const selectedDay = WEEKDAYS[keyNum - 1];
          handleChoice(selectedDay);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [store.gameState, store.currentAnswer, store.currentIndex]);

  const handleStart = () => {
    if (initialMode === "daily") {
      const todayStr = getLocalDateString();
      const dailyQuestions = generateDailyQuestions(todayStr);
      store.initGame("daily", "mixed", { customQuestions: dailyQuestions });
    } else {
      store.initGame(initialMode, difficulty, { speedRunDuration: selectedDuration });
    }
  };

  const handleChoice = (selectedDay) => {
    if (store.currentAnswer) return;

    const now = performance.now();
    const durationSeconds = (now - questionStartTimeRef.current) / 1000;
    
    const result = store.submitAnswer(selectedDay, durationSeconds);

    if (result && result.isCorrect) {
      // Award +10 XP immediately on correct solve
      profile.addXp(10);
      
      // Auto transition next
      setTimeout(() => {
        if (useGameStore.getState().gameState === "playing") {
          store.goToNextQuestion();
        }
      }, 700);
    }
  };

  if (!mounted) {
    return (
      <Container className="py-8 bg-black text-white">
        <div className="text-center py-20 text-shade-40">Loading Arena...</div>
      </Container>
    );
  }

  // --- 1. START PANEL (IDLE VIEW) ---
  if (store.gameState === "idle") {
    return (
      <Container className="py-10 md:py-16 max-w-2xl bg-black text-white">
        <div className="mb-6">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-sm text-shade-40 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Arenas
          </Link>
        </div>

        <Card className="border-hairline-dark bg-canvas-night-elevated text-center rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="p-8 md:p-10 items-center space-y-2">
            <div className="flex justify-center mb-2">
              <span className="p-4 bg-white/5 border border-white/10 text-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.06)]">
                <Play className="h-8 w-8 fill-white" />
              </span>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold capitalize text-white font-heading">
              {initialMode} Arena
            </CardTitle>
            <div className="pt-1">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/5 border border-hairline-dark text-xs sm:text-sm text-shade-40 font-mono">
                Difficulty Preset: <strong className="text-white uppercase font-bold">{difficulty}</strong>
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-8 md:p-10 pt-0 space-y-7 text-left">
            <div className="space-y-4 border-t border-hairline-dark/60 pt-6 text-sm md:text-base text-shade-30 leading-relaxed">
              <h4 className="text-base md:text-lg font-bold text-white flex items-center gap-2 font-heading">
                Rule Guidelines:
              </h4>
              {initialMode === "relaxed" && (
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Unlimited questions with zero countdown pressure.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Instant Doomsday mental calculation steps displayed on incorrect solves.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Ideal for studying century anchors and month keys.</span>
                  </li>
                </ul>
              )}
              {initialMode === "timed" && (
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Solve a standard deck of 10 dates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Scores are weighted by answer velocity and streak multiplier.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Compete to set new personal speed records.</span>
                  </li>
                </ul>
              )}
              {initialMode === "speed" && (
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Countdown timer active. Solve as many dates as possible before time expires.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Instant feedback. Focus on rapid muscle memory reflexes.</span>
                  </li>
                </ul>
              )}
              {initialMode === "accuracy" && (
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>10-question sequence where errors heavily penalize streaks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>Focus on flawless calculation precision.</span>
                  </li>
                </ul>
              )}
            </div>

            {initialMode === "speed" && (
              <div className="space-y-3 pt-2">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-shade-40 block font-mono">
                  Select Round Duration:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[30, 60, 120].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSelectedDuration(sec)}
                      className={cn(
                        "h-12 text-sm font-semibold rounded-xl border transition-all cursor-pointer",
                        selectedDuration === sec
                          ? "bg-white text-black border-white shadow-md font-bold"
                          : "bg-transparent text-white border-hairline-dark hover:bg-white/5"
                      )}
                    >
                      {sec} seconds
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-8 md:p-10 pt-0 border-t border-hairline-dark/60 mt-2 flex">
            <Button onClick={handleStart} variant="primary" className="w-full h-14 text-lg font-bold shadow-[0_0_25px_rgba(255,255,255,0.15)]">
              Start Training Loop
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  // --- 2. PROGRESSION & REWARDS MILESTONE SCREEN ---
  const hasMilestones =
    profile.newLevelUnlocked ||
    profile.newRecordsBroken.length > 0 ||
    profile.newAchievementsUnlocked.length > 0;

  if (store.gameState === "completed" && hasMilestones) {
    return (
      <Container className="py-8 md:py-12 max-w-xl bg-black text-white">
        <Card className="border-white/20 bg-canvas-night-elevated shadow-xl overflow-hidden">
          <div className="bg-white/5 border-b border-hairline-dark py-8 text-white flex flex-col items-center gap-2">
            <Sparkles className="h-10 w-10 text-aloe animate-pulse" />
            <h1 className="display-md text-white font-light">Milestones Unlocked!</h1>
            <p className="text-xs font-semibold text-shade-40">You earned special rewards during this round.</p>
          </div>

          <CardContent className="p-6 md:p-8 space-y-5 text-center">
            {profile.newLevelUnlocked && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 border border-aloe/25 bg-aloe/5 rounded-2xl flex flex-col items-center gap-2"
              >
                <Medal className="h-9 w-9 text-aloe" />
                <h3 className="font-heading text-lg font-bold text-aloe">LEVEL UP!</h3>
                <p className="text-xs text-shade-40">
                  You reached <strong className="text-white">Level {profile.level}</strong>. Keep training!
                </p>
              </motion.div>
            )}

            {profile.newRecordsBroken.length > 0 && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 border border-amber-500/25 bg-amber-500/5 rounded-2xl flex flex-col items-center gap-2"
              >
                <Flame className="h-9 w-9 text-amber-400 fill-amber-400/20" />
                <h3 className="font-heading text-lg font-bold text-amber-400">NEW PERSONAL BEST!</h3>
                <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                  {profile.newRecordsBroken.map((rec, idx) => (
                    <span key={idx} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                      {rec}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-shade-50 mt-1">+100 XP bonus awarded per record!</p>
              </motion.div>
            )}

            {profile.newAchievementsUnlocked.length > 0 && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 border border-white/15 bg-white/5 rounded-2xl flex flex-col items-center gap-3 text-left"
              >
                <div className="flex items-center gap-2 border-b border-hairline-dark pb-2 text-white font-bold w-full">
                  <Trophy className="h-4.5 w-4.5" />
                  <span className="text-sm">Achievements Unlocked!</span>
                </div>
                <div className="space-y-2.5 w-full">
                  {profile.newAchievementsUnlocked.map((ach) => (
                    <div key={ach.id} className="flex gap-3 items-start">
                      <span className="p-1.5 bg-white/10 text-white rounded-lg shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div>
                        <strong className="text-xs font-bold text-white block">{ach.name}</strong>
                        <span className="text-[11px] text-shade-40 block mt-0.5">{ach.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-shade-50 text-center w-full pt-1 border-t border-hairline-dark">+200 XP bonus awarded!</p>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="p-6 md:p-8 pt-0 flex">
            <Button onClick={() => profile.clearNotificationFlags()} variant="primary" className="w-full h-11 text-sm font-bold">
              Claim Rewards & View Dashboard
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  // --- 3. STANDARD RESULTS VIEW ---
  if (store.gameState === "completed") {
    const totalQuestions = store.answers.length;
    const correctCount = store.answers.filter((a) => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    const avgSpeed =
      totalQuestions > 0
        ? (store.answers.reduce((acc, a) => acc + a.responseTimeSeconds, 0) / totalQuestions).toFixed(1)
        : "0.0";

    const correctAnswers = store.answers.filter((a) => a.isCorrect);
    const fastestAnswer =
      correctAnswers.length > 0
        ? Math.min(...correctAnswers.map((a) => a.responseTimeSeconds)).toFixed(1)
        : "0.0";

    return (
      <Container className="py-8 md:py-12 max-w-xl bg-black text-white">
        <Card className="border-hairline-dark bg-canvas-night-elevated text-center overflow-hidden">
          <div className="bg-white/5 border-b border-hairline-dark py-6 text-white flex flex-col items-center gap-1.5">
            <Award className="h-10 w-10 text-aloe" />
            <h1 className="display-md text-white font-light">Round Completed!</h1>
            <p className="text-xs text-shade-40 capitalize font-mono">{initialMode} Mode &bull; {difficulty}</p>
          </div>

          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="border border-hairline-dark p-4 rounded-xl bg-black/60">
                <span className="text-[10px] text-shade-40 block font-semibold uppercase tracking-wider">Score</span>
                <span className="font-mono text-2xl font-bold text-white block mt-1">
                  {store.score.toLocaleString()}
                </span>
              </div>
              <div className="border border-hairline-dark p-4 rounded-xl bg-black/60">
                <span className="text-[10px] text-shade-40 block font-semibold uppercase tracking-wider">Accuracy</span>
                <span className="font-mono text-2xl font-bold text-white block mt-1">
                  {accuracy}%
                </span>
              </div>
              <div className="border border-hairline-dark p-4 rounded-xl bg-black/60">
                <span className="text-[10px] text-shade-40 block font-semibold uppercase tracking-wider">Solves</span>
                <span className="font-mono text-2xl font-bold text-white block mt-1">
                  {correctCount} / {totalQuestions}
                </span>
              </div>
              <div className="border border-hairline-dark p-4 rounded-xl bg-black/60">
                <span className="text-[10px] text-shade-40 block font-semibold uppercase tracking-wider">Average Speed</span>
                <span className="font-mono text-2xl font-bold text-white block mt-1">
                  {avgSpeed}s
                </span>
              </div>
            </div>

            {correctAnswers.length > 0 && (
              <div className="bg-black/60 border border-hairline-dark p-3.5 rounded-xl flex items-center justify-between text-xs text-shade-40">
                <span>Fastest Solve in Round:</span>
                <strong className="text-aloe font-mono text-sm">{fastestAnswer}s</strong>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-6 md:p-8 pt-0 flex flex-col sm:flex-row gap-3">
            <Button onClick={handleStart} variant="primary" className="w-full sm:flex-1 h-11 text-sm font-bold">
              Play Again <RefreshCw className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline-on-dark" className="w-full sm:flex-1 h-11 text-sm font-bold">
              <Link href="/practice">
                Other Arenas
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  // --- 4. ACTIVE GAME PLAYING VIEW ---
  const currentQuestion = store.questions[store.currentIndex];
  const questionNum = store.currentIndex + 1;
  const isEndless = initialMode === "relaxed";
  
  const parseDateDetails = () => {
    if (!currentQuestion) return null;
    const dateObj = new Date(currentQuestion.date);
    return {
      year: dateObj.getUTCFullYear(),
      month: dateObj.getUTCMonth() + 1,
      day: dateObj.getUTCDate(),
    };
  };
  const dateDetails = parseDateDetails();
  const explanation = dateDetails ? getDoomsdayExplanation(dateDetails.year, dateDetails.month, dateDetails.day) : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-6 md:py-10 select-none bg-black text-white">
      <Container className="max-w-2xl flex flex-col gap-6 w-full px-4">
        {/* Game Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => store.resetGame()}
            className="flex items-center gap-1 text-xs text-shade-40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded px-1.5 py-0.5 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Quit Arena
          </button>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs uppercase tracking-wider font-mono font-bold px-3 py-1 rounded-full border shadow-sm",
              initialMode === "relaxed" && "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
              initialMode === "timed" && "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
              initialMode === "speed" && "bg-amber-500/15 border-amber-500/30 text-amber-300",
              initialMode === "accuracy" && "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
              initialMode === "daily" && "bg-purple-500/15 border-purple-500/30 text-purple-300"
            )}>
              {initialMode} &bull; {difficulty}
            </span>
          </div>
        </div>

        {/* HUD Stats Dashboard */}
        <div className="flex items-center justify-between border-b border-hairline-dark pb-3.5">
          <div className="flex flex-col">
            <span className="text-[10px] text-shade-40 uppercase font-semibold tracking-wider font-mono">Progress</span>
            <span className="font-mono text-sm font-bold text-white">
              {isEndless ? `Solves: ${store.answers.length}` : `${questionNum} of 10`}
            </span>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            <div className="text-right">
              <span className="text-[10px] text-shade-40 uppercase font-semibold tracking-wider block font-mono">Score</span>
              <span className="font-mono text-base font-bold text-amber-300">{store.score}</span>
            </div>
            
            {store.streak > 0 && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/35 px-3 py-1 rounded-full text-amber-300 font-bold text-xs font-mono shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{store.streak}x</span>
              </div>
            )}

            <div className="text-right">
              <span className="text-[10px] text-shade-40 uppercase font-semibold tracking-wider block font-mono">
                {initialMode === "speed" ? "Time Left" : "Timer"}
              </span>
              <span className={cn(
                "font-mono text-base font-bold",
                initialMode === "speed" && store.elapsedTime <= 10 ? "text-rose-400 animate-pulse" : "text-cyan-300"
              )}>
                {store.elapsedTime}s
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar with Multi-stop Gradient */}
        {!isEndless && (
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden -mt-3">
            <div
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.round(((questionNum - 1) / 10) * 100)}%` }}
            />
          </div>
        )}

        {/* Active Question Target Date Display */}
        <Card className="border border-emerald-500/20 text-center py-8 px-4 bg-[#090c12] shadow-[0_0_35px_rgba(16,185,129,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          <CardContent className="p-0 flex flex-col gap-2">
            <span className="eyebrow-cap text-emerald-400 font-mono">Calculate Weekday</span>
            <h2 className="display-lg text-white select-none font-heading">
              {currentQuestion?.formattedDate}
            </h2>
            <p className="text-xs text-shade-40">Which day of the week was this?</p>
          </CardContent>
        </Card>

        {/* Answer Keyboard Grid (7 Weekday Buttons) */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {WEEKDAYS.map((day, idx) => {
              const keyShortcut = idx + 1;
              const hasAnswered = store.currentAnswer !== null;
              
              const isCorrect = day === currentQuestion?.correctAnswer;
              const isSelected = store.currentAnswer?.selectedAnswer === day;

              let btnClass = "border-hairline-dark bg-canvas-night-elevated text-white hover:border-emerald-400/40 hover:bg-white/5";

              if (hasAnswered) {
                if (isSelected) {
                  btnClass = isCorrect
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.35)] cursor-default font-bold"
                    : "bg-rose-500/20 border-rose-500 text-rose-300 cursor-default font-bold";
                } else if (isCorrect) {
                  btnClass = "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 cursor-default font-bold";
                } else {
                  btnClass = "opacity-30 border-hairline-dark text-shade-60 pointer-events-none cursor-default";
                }
              }

              return (
                <button
                  key={day}
                  disabled={hasAnswered}
                  onClick={() => handleChoice(day)}
                  className={cn(
                    "relative flex flex-col items-center justify-center h-14 rounded-xl border text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 cursor-pointer select-none",
                    btnClass
                  )}
                >
                  <span className="block truncate px-1">{day.slice(0, 3)}</span>
                  <span className="text-[9px] font-mono text-shade-50 block mt-0.5">
                    [{keyShortcut}]
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Calculation Explanation Container */}
          <AnimatePresence>
            {store.currentAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Incorrect explanation walkthrough */}
                {!store.currentAnswer.isCorrect && explanation && (
                  <Card className="border border-rose-500/25 bg-canvas-night-elevated rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.08)]">
                    <CardContent className="p-5 flex flex-col gap-4 text-xs leading-relaxed text-shade-40 font-sans">
                      <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                        <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                        <span>Incorrect. Let&apos;s review the 4-step Doomsday proof:</span>
                      </div>

                      <div className="space-y-2.5 bg-black/70 p-4 rounded-xl border border-hairline-dark font-sans text-xs">
                        <div className="flex items-start gap-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold shrink-0">Step 1</span>
                          <p><strong className="text-white">Century Anchor:</strong> For the {explanation.centuryStr}, start with <strong className="text-indigo-300">{explanation.centuryDay}</strong> (Code {explanation.centuryCode}).</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold shrink-0">Step 2</span>
                          <p>
                            <strong className="text-white">Year Offset:</strong> {explanation.yearDigits} / 12 = {explanation.yearDiv12} rem {explanation.yearRem12}. Leaps: {explanation.yearRem12}/4 = {explanation.yearLeaps}. <br />
                            Sum = {explanation.yearDiv12 + explanation.yearRem12 + explanation.yearLeaps} &rarr; mod 7 = <span className="text-cyan-300 font-mono font-bold">+{explanation.yearOffset}</span>. <br />
                            Year Doomsday = {explanation.centuryDay} + {explanation.yearOffset} = <strong className="text-cyan-200">{explanation.yearDoomsdayDay}</strong>.
                          </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold shrink-0">Step 3</span>
                          <p><strong className="text-white">Month Anchor:</strong> Doomsday is <strong className="text-teal-300">{explanation.monthName} {explanation.monthAnchorDay}</strong>.</p>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold shrink-0">Step 4</span>
                          <p>
                            <strong className="text-white">Target Date:</strong> {dateDetails.day} is {explanation.targetDiffAbs} days {explanation.targetDiff >= 0 ? "after" : "before"} the anchor {explanation.monthAnchorDay}. <br />
                            {explanation.yearDoomsdayDay} {explanation.targetDiffSign} {explanation.targetDiffAbs} days = <strong className="text-emerald-300 text-sm font-bold">{explanation.finalDay}</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] text-shade-50">Press <kbd className="kbd-badge">Enter</kbd> to advance</span>
                        <Button
                          onClick={() => store.goToNextQuestion()}
                          variant="primary"
                          size="sm"
                          className="flex items-center gap-1 text-xs font-bold"
                        >
                          Next Date <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Correct answer brief alert */}
                {store.currentAnswer.isCorrect && (
                  <div className="bg-emerald-500/10 border border-emerald-500/25 p-3.5 rounded-xl flex items-center justify-between text-emerald-300 text-xs">
                    <span className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      Correct solve! (+{store.currentAnswer.scoreGained} pts)
                    </span>
                    <span className="font-mono">
                      {store.currentAnswer.responseTimeSeconds.toFixed(2)}s
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
