/**
 * Daywise Difficulty Configuration
 * Defines target year spans and settings for question generation difficulty.
 */

export const DIFFICULTY_CONFIGS = {
  easy: {
    startYear: 2000,
    endYear: 2029,
  },
  medium: {
    startYear: 1950,
    endYear: 2050,
  },
  hard: {
    startYear: 1800,
    endYear: 2199,
  },
  expert: {
    startYear: 1600,
    endYear: 2400,
  },
};

/**
 * Retrieves the year range configuration for a given difficulty level.
 * @param {string} difficulty - "easy" | "medium" | "hard" | "expert"
 * @returns {{startYear: number, endYear: number}}
 */
export function getDifficultyRange(difficulty) {
  const level = difficulty?.toLowerCase();
  if (level in DIFFICULTY_CONFIGS) {
    return DIFFICULTY_CONFIGS[level];
  }
  // Default fallback to medium
  return DIFFICULTY_CONFIGS.medium;
}
