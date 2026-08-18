import { getDifficultyRange } from "./difficulty";
import { calculateWeekDay, getDaysInMonth } from "./dateCalculator";
import { createSeededRandom } from "./seededRandom";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Generates a valid date question algorithmically.
 * 
 * @param {string} difficulty - "easy" | "medium" | "hard" | "expert"
 * @param {object} [options]
 * @param {function} [options.randomFunc] - Custom random generator () => number
 * @param {string|number} [options.seed] - Seed to generate a unique random sequence
 * @param {number} [options.index] - Index offset if using seed sequence
 * @param {string} [options.id] - Optional custom ID
 * @returns {object} - Question object
 */
export function generateQuestion(difficulty = "medium", options = {}) {
  const { randomFunc, seed, index = 0, id } = options;

  let rng = randomFunc;
  if (!rng) {
    if (seed !== undefined) {
      // Create a unique composite seed based on seed value and index
      const compositeSeed = typeof seed === "string" 
        ? `${seed}-${index}` 
        : seed + index;
      rng = createSeededRandom(compositeSeed);
    } else {
      rng = Math.random;
    }
  }

  const { startYear, endYear } = getDifficultyRange(difficulty);
  const yearRange = endYear - startYear + 1;
  const year = startYear + Math.floor(rng() * yearRange);

  // Month: 1-12
  const month = 1 + Math.floor(rng() * 12);

  // Day: 1-maxDays
  const maxDays = getDaysInMonth(year, month);
  const day = 1 + Math.floor(rng() * maxDays);

  const correctAnswer = calculateWeekDay(year, month, day);
  const formattedDate = `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
  
  // Use UTC to prevent local timezone shifts when converting to ISO string
  const jsDate = new Date(Date.UTC(year, month - 1, day));

  const questionId = id || `q-${year}-${month}-${day}-${index}-${Math.floor(rng() * 1000)}`;

  return {
    id: questionId,
    date: jsDate.toISOString(),
    formattedDate,
    correctAnswer,
    difficulty,
  };
}

/**
 * Generates a series of questions.
 * 
 * @param {number} count 
 * @param {string} difficulty 
 * @param {string|number} [seed] 
 * @returns {object[]}
 */
export function generateQuestions(count, difficulty = "medium", seed) {
  const questions = [];
  const rng = seed !== undefined ? createSeededRandom(seed) : Math.random;

  for (let i = 0; i < count; i++) {
    questions.push(generateQuestion(difficulty, { randomFunc: rng, index: i, id: `q-${seed || "rand"}-${i}` }));
  }

  return questions;
}
