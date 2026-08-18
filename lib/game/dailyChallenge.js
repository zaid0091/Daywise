import { generateQuestion } from "./questionGenerator";
import { createSeededRandom } from "./seededRandom";

/**
 * Generates the deterministic questions for the Daily Challenge on a given date.
 * All players on the same date will receive the same questions in the same order.
 * 
 * @param {string} dateStr - YYYY-MM-DD string format
 * @returns {object[]} - Array of 10 question objects
 */
export function generateDailyQuestions(dateStr) {
  const rng = createSeededRandom(dateStr);

  // Mixed difficulty: 3 easy, 3 medium, 2 hard, 2 expert
  const difficulties = [
    "easy", "easy", "easy",
    "medium", "medium", "medium",
    "hard", "hard",
    "expert", "expert"
  ];

  const questions = [];
  for (let i = 0; i < 10; i++) {
    const difficulty = difficulties[i];
    questions.push(
      generateQuestion(difficulty, {
        randomFunc: rng,
        index: i,
        id: `q-daily-${dateStr}-${i}`,
      })
    );
  }

  return questions;
}
