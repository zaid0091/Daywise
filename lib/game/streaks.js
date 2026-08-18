/**
 * Daywise Streak Tracker Utility
 * Computes calendar-based daily activity streak logs.
 */

/**
 * Formats a Date object to local YYYY-MM-DD.
 * @param {Date} [date]
 * @returns {string}
 */
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats yesterday's local date as YYYY-MM-DD.
 * @returns {string}
 */
export function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

/**
 * Calculates updated streak values.
 * 
 * @param {string|null} lastActiveDateStr - YYYY-MM-DD of last activity
 * @param {number} currentStreak - Current streak count
 * @param {number} longestStreak - Historical longest streak count
 * @returns {object} - { streak: number, longestStreak: number, lastActiveDate: string, updated: boolean }
 */
export function calculateStreak(lastActiveDateStr, currentStreak = 0, longestStreak = 0) {
  const today = getLocalDateString();

  if (!lastActiveDateStr) {
    // First activity ever
    return {
      streak: 1,
      longestStreak: Math.max(longestStreak, 1),
      lastActiveDate: today,
      updated: true,
    };
  }

  if (lastActiveDateStr === today) {
    // Already registered activity today, keep streak unchanged
    return {
      streak: currentStreak,
      longestStreak,
      lastActiveDate: today,
      updated: false,
    };
  }

  const yesterday = getYesterdayDateString();
  if (lastActiveDateStr === yesterday) {
    // Solved consecutively yesterday and today, increment streak
    const nextStreak = currentStreak + 1;
    return {
      streak: nextStreak,
      longestStreak: Math.max(longestStreak, nextStreak),
      lastActiveDate: today,
      updated: true,
    };
  }

  // Missed days in between, reset streak to 1
  return {
    streak: 1,
    longestStreak: Math.max(longestStreak, 1),
    lastActiveDate: today,
    updated: true,
  };
}
