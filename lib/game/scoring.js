/**
 * Daywise Gameplay Scoring Engine
 * Centralizes the computation of scores, speed rewards, and streak multipliers.
 */

/**
 * Computes points awarded for a correct answer.
 * 
 * @param {object} params
 * @param {string} params.difficulty - "easy" | "medium" | "hard" | "expert"
 * @param {number} params.responseTimeSeconds - High-res response time in seconds
 * @param {number} params.streak - Active streak before this solve
 * @param {boolean} params.isCorrect - Whether the user answered correctly
 * @returns {object} - Score breakdown
 */
export function calculateScore({ difficulty, responseTimeSeconds, streak, isCorrect }) {
  if (!isCorrect) {
    return {
      points: 0,
      base: 0,
      difficultyBonus: 0,
      speedBonus: 0,
      streakMultiplier: 1.0,
    };
  }

  const base = 100;

  // 1. Difficulty Multiplier Configuration
  const difficultyMultipliers = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    expert: 3.0,
  };
  const diffMult = difficultyMultipliers[difficulty.toLowerCase()] || 1.5;
  const difficultyBonus = Math.floor(base * (diffMult - 1.0));

  // 2. Speed Bonus Configuration
  // Max 100 extra points for answers under 1 second.
  // Scales down linearly to 0 at 6 seconds or slower.
  let speedBonus = 0;
  if (responseTimeSeconds <= 1.0) {
    speedBonus = 100;
  } else if (responseTimeSeconds < 6.0) {
    speedBonus = Math.floor((6.0 - responseTimeSeconds) * 20);
  }

  // 3. Streak Multiplier Configuration
  // Starts at 1.0x. Adds +0.5x multiplier for every 3 consecutive correct answers.
  // Capped at 3.0x multiplier.
  const streakMultiplier = 1.0 + Math.min(2.0, Math.floor(streak / 3) * 0.5);

  // Combine
  const subtotal = base + difficultyBonus + speedBonus;
  const points = Math.floor(subtotal * streakMultiplier);

  return {
    points,
    base,
    difficultyBonus,
    speedBonus,
    streakMultiplier,
  };
}
