import { ACHIEVEMENTS } from "../../data/achievements";

/**
 * Checks for newly unlocked achievements based on stats.
 * 
 * @param {object} stats - Active progression metrics
 * @param {number} stats.completedLessonsCount
 * @param {number} stats.streak
 * @param {string} stats.lastDifficulty
 * @param {number} stats.lastAccuracy - 0 to 100
 * @param {number} stats.lastSpeed - solve speed in seconds
 * @param {boolean} stats.hasCompletedDaily
 * @param {string[]} unlockedIds - List of already unlocked achievement IDs
 * @returns {object[]} - Array of newly unlocked achievement definitions
 */
export function checkAchievements(stats, unlockedIds = []) {
  const newlyUnlocked = [];

  const evaluate = (id, condition) => {
    if (!unlockedIds.includes(id) && condition) {
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (ach) newlyUnlocked.push(ach);
    }
  };

  const {
    completedLessonsCount = 0,
    streak = 0,
    lastDifficulty = "",
    lastAccuracy = 0,
    lastSpeed = 999, // default slow value
    hasCompletedDaily = false,
  } = stats;

  // Lesson completions
  evaluate("FIRST_STEP", completedLessonsCount >= 1);
  evaluate("GETTING_STARTED", completedLessonsCount >= 3);
  evaluate("MASTER", completedLessonsCount >= 10);
  
  // Streaks
  evaluate("WEEK_WARRIOR", streak >= 7);
  
  // Century triggers (solving dates in hard/expert ranges)
  evaluate("CENTURY", ["hard", "expert"].includes(lastDifficulty?.toLowerCase()) && lastAccuracy > 0);
  
  // Perfect rounds
  evaluate("PERFECT_TEN", lastAccuracy === 100);
  
  // Speed bounds
  evaluate("SPEED_DEMON", lastSpeed > 0 && lastSpeed <= 2.0);
  
  // Daily achievements
  evaluate("PERFECT_SCORE", hasCompletedDaily);

  return newlyUnlocked;
}
