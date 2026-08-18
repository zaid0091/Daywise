import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDailyStore = create()(
  persist(
    (set, get) => ({
      // Map YYYY-MM-DD -> { score, accuracy, elapsedTime, completed: true, answers: [] }
      attempts: {},
      bestDailyScore: 0,

      // Save user attempt for a specific day
      saveAttempt: (dateStr, attemptData) => {
        const { attempts, bestDailyScore } = get();
        const currentScore = attemptData.score || 0;

        const nextAttempts = {
          ...attempts,
          [dateStr]: {
            ...attemptData,
            completed: true,
          },
        };

        set({
          attempts: nextAttempts,
          bestDailyScore: Math.max(bestDailyScore, currentScore),
        });
      },

      // Reset logs
      resetDaily: () => {
        set({
          attempts: {},
          bestDailyScore: 0,
        });
      },
    }),
    {
      name: "daywise-daily-attempts",
      skipHydration: true,
    }
  )
);
