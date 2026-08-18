import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLevelForXp } from "../lib/game/levels";
import { calculateStreak, getLocalDateString } from "../lib/game/streaks";
import { checkAchievements } from "../lib/game/achievements";
import { getCompletedLessons } from "../lib/storage/storage";

const DEFAULT_RECORDS = {
  fastestCorrect: null, // float seconds
  bestTimedScore: 0,
  bestAccuracyScore: 0,
  mostSpeedRunSolves: 0,
  bestDailyScore: 0,
  longestStreak: 0,
};

export const useProfileStore = create()(
  persist(
    (set, get) => ({
      // Profile Identity
      displayName: "Mental Trainer",
      avatar: "indigo-brain", // 'indigo-brain' | 'emerald-zap' | 'rose-trophy' | 'amber-calendar'

      // Profile Progression
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      lastActiveDate: null, // YYYY-MM-DD
      unlockedAchievements: [], // strings
      records: { ...DEFAULT_RECORDS },
      
      // Detailed completed sessions history
      // Each item: { date: YYYY-MM-DD, type: 'practice'|'daily', mode: string, score: number, accuracy: number, correctCount: number, totalQuestions: number, fastestSolve: number|null }
      history: [], 

      // Notification flags for popups
      newLevelUnlocked: false,
      newRecordsBroken: [],
      newAchievementsUnlocked: [],

      // Identity actions
      setDisplayName: (displayName) => set({ displayName }),
      setAvatar: (avatar) => set({ avatar }),

      // Increments XP and checks level-ups
      addXp: (amount) => {
        const { xp, level } = get();
        const nextXp = xp + Math.max(0, amount);
        const nextLevel = getLevelForXp(nextXp);
        const levelUp = nextLevel > level;

        set({
          xp: nextXp,
          level: nextLevel,
          newLevelUnlocked: levelUp || get().newLevelUnlocked,
        });
      },

      // Submit finished training rounds or lessons to verify progression updates
      submitActivity: (type, stats = {}) => {
        const { streak, longestStreak, lastActiveDate, records, unlockedAchievements, history } = get();
        
        // 1. Compute daily activity streak
        const streakResult = calculateStreak(lastActiveDate, streak, longestStreak);
        
        // 2. Compute records updates
        const recordsBroken = [];
        const updatedRecords = { ...records };

        if (stats.fastestCorrectSolve !== undefined && stats.fastestCorrectSolve > 0) {
          if (records.fastestCorrect === null || stats.fastestCorrectSolve < records.fastestCorrect) {
            updatedRecords.fastestCorrect = stats.fastestCorrectSolve;
            recordsBroken.push("Fastest Correct Answer");
          }
        }

        if (type === "practice" || type === "daily") {
          const { mode, score, correctCount, accuracy } = stats;
          
          if (mode === "timed" && score > records.bestTimedScore) {
            updatedRecords.bestTimedScore = score;
            recordsBroken.push("Best Timed Score");
          }
          if (mode === "accuracy" && score > records.bestAccuracyScore) {
            updatedRecords.bestAccuracyScore = score;
            recordsBroken.push("Best Accuracy Score");
          }
          if (mode === "speed" && correctCount > records.mostSpeedRunSolves) {
            updatedRecords.mostSpeedRunSolves = correctCount;
            recordsBroken.push("Most Speed Run Solves");
          }
          if (mode === "daily" && score > records.bestDailyScore) {
            updatedRecords.bestDailyScore = score;
            recordsBroken.push("Best Daily Challenge");
          }
        }

        if (streakResult.streak > records.longestStreak) {
          updatedRecords.longestStreak = streakResult.streak;
          recordsBroken.push("Longest Training Streak");
        }

        // 3. Save completed round to history
        const sessionLog = {
          date: getLocalDateString(),
          type,
          mode: stats.mode || "daily",
          score: stats.score || 0,
          accuracy: stats.accuracy || 0,
          correctCount: stats.correctCount || 0,
          totalQuestions: stats.totalQuestions || 10,
          fastestSolve: stats.fastestCorrectSolve || null,
        };
        const nextHistory = [...history, sessionLog];

        // 4. Evaluate unlocked achievements
        const lessonsCompleted = getCompletedLessons();
        const evaluationStats = {
          completedLessonsCount: lessonsCompleted.length,
          streak: streakResult.streak,
          lastDifficulty: stats.difficulty || "medium",
          lastAccuracy: stats.accuracy || 0,
          lastSpeed: stats.fastestCorrectSolve || 999,
          hasCompletedDaily: type === "daily" && stats.completedAll,
        };

        const freshlyUnlocked = checkAchievements(evaluationStats, unlockedAchievements);
        const nextAchievements = [...unlockedAchievements, ...freshlyUnlocked.map(a => a.id)];

        // 5. Update state variables
        set({
          streak: streakResult.streak,
          longestStreak: streakResult.longestStreak,
          lastActiveDate: streakResult.lastActiveDate,
          records: updatedRecords,
          unlockedAchievements: nextAchievements,
          history: nextHistory,
          newRecordsBroken: [...get().newRecordsBroken, ...recordsBroken],
          newAchievementsUnlocked: [...get().newAchievementsUnlocked, ...freshlyUnlocked],
        });

        // Award XP for records broken (+100 XP per record)
        if (recordsBroken.length > 0) {
          get().addXp(recordsBroken.length * 100);
        }

        // Award XP for achievements unlocked (+200 XP per achievement)
        if (freshlyUnlocked.length > 0) {
          get().addXp(freshlyUnlocked.length * 200);
        }
      },

      // Dismiss triggers
      clearNotificationFlags: () => {
        set({
          newLevelUnlocked: false,
          newRecordsBroken: [],
          newAchievementsUnlocked: [],
        });
      },

      // Reset profile data
      resetProfile: () => {
        set({
          displayName: "Mental Trainer",
          avatar: "indigo-brain",
          xp: 0,
          level: 1,
          streak: 0,
          longestStreak: 0,
          lastActiveDate: null,
          unlockedAchievements: [],
          records: { ...DEFAULT_RECORDS },
          history: [],
          newLevelUnlocked: false,
          newRecordsBroken: [],
          newAchievementsUnlocked: [],
        });
      },
    }),
    {
      name: "daywise-profile-v2", // use a new version key to prevent conflicts with old schemas
      skipHydration: true,
    }
  )
);
