/**
 * Daywise Level Progression Rules
 * Maps experience points (XP) to levels.
 */

// Fixed thresholds for levels 1 to 10
const LEVEL_THRESHOLDS = [
  0,       // Level 1
  500,     // Level 2
  1200,    // Level 3
  2500,    // Level 4
  4500,    // Level 5
  7000,    // Level 6
  10000,   // Level 7
  13500,   // Level 8
  17500,   // Level 9
  22000,   // Level 10
];

/**
 * Gets the total XP threshold needed to reach a given level.
 * @param {number} level 
 * @returns {number}
 */
export function getXpThreshold(level) {
  const lvl = Math.max(1, Math.floor(level));
  if (lvl <= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[lvl - 1];
  }
  // Formula-based threshold extension above level 10:
  // Add 5000 + (level - 10) * 1000 for each level beyond 10
  const baseTenXp = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  let extraXp = 0;
  for (let i = 11; i <= lvl; i++) {
    extraXp += 5000 + (i - 11) * 1000;
  }
  return baseTenXp + extraXp;
}

/**
 * Determines the current level based on total accumulated XP.
 * @param {number} xp 
 * @returns {number}
 */
export function getLevelForXp(xp) {
  const currentXp = Math.max(0, Math.floor(xp));
  
  // Find the highest level threshold that currentXp satisfies
  let level = 1;
  while (true) {
    const nextThreshold = getXpThreshold(level + 1);
    if (currentXp >= nextThreshold) {
      level++;
    } else {
      break;
    }
  }
  return level;
}

/**
 * Returns detailed level progress metrics.
 * 
 * @param {number} xp - Cumulative XP
 * @returns {object} - { level, currentLevelXp, nextLevelXp, percent, xpRemaining }
 */
export function getLevelProgress(xp) {
  const currentXp = Math.max(0, Math.floor(xp));
  const level = getLevelForXp(currentXp);
  
  const currentThreshold = getXpThreshold(level);
  const nextThreshold = getXpThreshold(level + 1);
  
  const xpInCurrentLevel = currentXp - currentThreshold;
  const xpNeededForNextLevel = nextThreshold - currentThreshold;
  const xpRemaining = nextThreshold - currentXp;

  const percent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100))
  );

  return {
    level,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    xpRemaining,
    percent,
  };
}
