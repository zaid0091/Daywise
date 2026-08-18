import { describe, test, expect } from "vitest";
import { calculateWeekDay, isLeapYear, getDaysInMonth } from "./dateCalculator";
import { createSeededRandom } from "./seededRandom";
import { getDifficultyRange, DIFFICULTY_CONFIGS } from "./difficulty";
import { generateQuestion, generateQuestions } from "./questionGenerator";
import { calculateScore } from "./scoring";
import { getLevelForXp, getLevelProgress } from "./levels";
import { calculateStreak } from "./streaks";
import { checkAchievements } from "./achievements";
import { generateDailyQuestions } from "./dailyChallenge";

describe("Date Calculator Engine", () => {
  test("Leap year detection", () => {
    // Standard leap years
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2028)).toBe(true);
    // Standard common years
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);

    // Century years (divisible by 100)
    // Divisible by 400 -> Leap
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2400)).toBe(true);
    // Not divisible by 400 -> Common
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
  });

  test("Days in month checks", () => {
    // Leap Feb
    expect(getDaysInMonth(2024, 2)).toBe(29);
    // Common Feb
    expect(getDaysInMonth(2026, 2)).toBe(28);
    // 30 day months
    expect(getDaysInMonth(2026, 4)).toBe(30); // April
    expect(getDaysInMonth(2026, 9)).toBe(30); // September
    // 31 day months
    expect(getDaysInMonth(2026, 1)).toBe(31); // Jan
    expect(getDaysInMonth(2026, 12)).toBe(31); // Dec
  });

  test("Gregorian Weekday Calculations (Deterministic)", () => {
    // Known historical date anchors:
    // Apollo 11: July 20, 1969 was Sunday
    expect(calculateWeekDay(1969, 7, 20)).toBe("Sunday");

    // Pi Day: March 14, 2024 was Thursday
    expect(calculateWeekDay(2024, 3, 14)).toBe("Thursday");

    // Doomsday 2026 anchor: June 6, 2026 is Saturday
    expect(calculateWeekDay(2026, 6, 6)).toBe("Saturday");

    // Feb 28, Feb 29, March 1 transitions:
    // 2024 (Leap):
    // Feb 28, 2024 is Wednesday
    expect(calculateWeekDay(2024, 2, 28)).toBe("Wednesday");
    // Feb 29, 2024 is Thursday
    expect(calculateWeekDay(2024, 2, 29)).toBe("Thursday");
    // March 1, 2024 is Friday
    expect(calculateWeekDay(2024, 3, 1)).toBe("Friday");

    // 1900 (Common Century):
    // Feb 28, 1900 is Wednesday
    expect(calculateWeekDay(1900, 2, 28)).toBe("Wednesday");
    // March 1, 1900 is Thursday (no Feb 29!)
    expect(calculateWeekDay(1900, 3, 1)).toBe("Thursday");

    // 2100 (Common Century):
    // Feb 28, 2100 is Sunday
    expect(calculateWeekDay(2100, 2, 28)).toBe("Sunday");
    // March 1, 2100 is Monday
    expect(calculateWeekDay(2100, 3, 1)).toBe("Monday");

    // 2400 (Leap Century):
    // Feb 28, 2400 is Monday
    expect(calculateWeekDay(2400, 2, 28)).toBe("Monday");
    // Feb 29, 2400 is Tuesday
    expect(calculateWeekDay(2400, 2, 29)).toBe("Tuesday");
    // March 1, 2400 is Wednesday
    expect(calculateWeekDay(2400, 3, 1)).toBe("Wednesday");
  });

  test("Native JS Date equivalence", () => {
    const testCases = [
      { y: 2026, m: 8, d: 17 }, // Today
      { y: 1985, m: 10, d: 15 },
      { y: 2012, m: 12, d: 21 },
      { y: 1815, m: 6, d: 18 }, // Waterloo
      { y: 2150, m: 1, d: 1 },
    ];

    const weekDaysMap = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    testCases.forEach(({ y, m, d }) => {
      // Calculate using our engine
      const calculated = calculateWeekDay(y, m, d);
      // Double check using JS Native (Month is 0-based in JS date)
      const jsDate = new Date(y, m - 1, d);
      const expected = weekDaysMap[jsDate.getDay()];

      expect(calculated).toBe(expected);
    });
  });
});

describe("Seeded Random Generator", () => {
  test("Determinism: same seed produces identical sequence", () => {
    const rng1 = createSeededRandom("daywise-test-seed");
    const rng2 = createSeededRandom("daywise-test-seed");
    const rngDiff = createSeededRandom("different-seed");

    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    const seqDiff = Array.from({ length: 10 }, () => rngDiff());

    // Identical
    expect(seq1).toEqual(seq2);
    // Distinct from other seed
    expect(seq1).not.toEqual(seqDiff);
  });
});

describe("Difficulty Configurations", () => {
  test("Spans retrieve", () => {
    expect(getDifficultyRange("easy")).toEqual(DIFFICULTY_CONFIGS.easy);
    expect(getDifficultyRange("expert")).toEqual(DIFFICULTY_CONFIGS.expert);
    // Fallback
    expect(getDifficultyRange("non-existent")).toEqual(DIFFICULTY_CONFIGS.medium);
  });
});

describe("Question Generator", () => {
  test("Structured question schema validation", () => {
    const question = generateQuestion("medium");

    expect(question).toHaveProperty("id");
    expect(question).toHaveProperty("date");
    expect(question).toHaveProperty("formattedDate");
    expect(question).toHaveProperty("correctAnswer");
    expect(question).toHaveProperty("difficulty");
    expect(question.difficulty).toBe("medium");

    // CorrectAnswer must be a valid weekday string
    expect([
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]).toContain(question.correctAnswer);
  });

  test("Determinism with seeds for sequences", () => {
    const list1 = generateQuestions(5, "easy", "daily-challenge-2026-08-17");
    const list2 = generateQuestions(5, "easy", "daily-challenge-2026-08-17");

    expect(list1).toEqual(list2);
  });

  test("Difficulty boundaries are respected", () => {
    const rng = createSeededRandom("difficulty-boundary-test");
    const easyQuestions = Array.from({ length: 30 }, () => 
      generateQuestion("easy", { randomFunc: rng })
    );

    easyQuestions.forEach((q) => {
      // Extract year from formattedDate (e.g. "July 24, 2026" -> 2026)
      const year = parseInt(q.formattedDate.split(" ").pop(), 10);
      expect(year).toBeGreaterThanOrEqual(2000);
      expect(year).toBeLessThanOrEqual(2029);
    });
  });

  test("Leap year dates generated are strictly valid", () => {
    // Generate many questions and verify no Date conversion throws an error
    for (let i = 0; i < 200; i++) {
      const q = generateQuestion("expert");
      const d = new Date(q.date);
      expect(d.getTime()).not.toBeNaN();
    }
  });
});

describe("Scoring Engine", () => {
  test("Computes score based on difficulty and speed latency", () => {
    // Correct solve under 3 seconds in medium difficulty
    const resFast = calculateScore({
      difficulty: "medium",
      responseTimeSeconds: 1.5,
      streak: 5,
      isCorrect: true,
    });
    
    // Incorrect solve
    const resWrong = calculateScore({
      difficulty: "medium",
      responseTimeSeconds: 1.5,
      streak: 5,
      isCorrect: false,
    });

    expect(resFast.points).toBeGreaterThan(0);
    expect(resFast.speedBonus).toBeGreaterThan(0);
    expect(resWrong.points).toBe(0);
  });
});

describe("Levels Progression Engine", () => {
  test("Computes level correct mappings for XP values", () => {
    expect(getLevelForXp(0)).toBe(1);
    expect(getLevelForXp(499)).toBe(1);
    expect(getLevelForXp(500)).toBe(2);
    expect(getLevelForXp(1200)).toBe(3);
    expect(getLevelForXp(23000)).toBe(10);
  });

  test("Computes level progress percentage boundaries", () => {
    const progress = getLevelProgress(250); // half way to level 2 (500 XP)
    expect(progress.level).toBe(1);
    expect(progress.percent).toBe(50);
    expect(progress.xpRemaining).toBe(250);
  });
});

describe("Streak Tracker Engine", () => {
  test("Streak updates consecutively", () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    // Consecutively yesterday to today
    const resConsecutive = calculateStreak(yesterdayStr, 2, 2);
    expect(resConsecutive.streak).toBe(3);
    expect(resConsecutive.updated).toBe(true);

    // Same day activity does not duplicate
    const resSameDay = calculateStreak(todayStr, 3, 3);
    expect(resSameDay.streak).toBe(3);
    expect(resSameDay.updated).toBe(false);

    // Missed days reset streak
    const resReset = calculateStreak("2020-01-01", 3, 3);
    expect(resReset.streak).toBe(1);
    expect(resReset.updated).toBe(true);
  });
});

describe("Achievements Evaluator", () => {
  test("Unlocks badges upon satisfying criteria", () => {
    const stats = {
      completedLessonsCount: 3,
      streak: 7,
      lastDifficulty: "hard",
      lastAccuracy: 100,
      lastSpeed: 1.5,
      hasCompletedDaily: true,
    };

    const unlocked = checkAchievements(stats, []);
    const unlockedIds = unlocked.map(a => a.id);

    expect(unlockedIds).toContain("FIRST_STEP");
    expect(unlockedIds).toContain("GETTING_STARTED");
    expect(unlockedIds).toContain("WEEK_WARRIOR");
    expect(unlockedIds).toContain("CENTURY");
    expect(unlockedIds).toContain("PERFECT_TEN");
    expect(unlockedIds).toContain("SPEED_DEMON");
    expect(unlockedIds).toContain("PERFECT_SCORE");
  });
});

describe("Daily Seeded Challenge", () => {
  test("Seeded daily generation is deterministic", () => {
    const date = "2026-08-17";
    const run1 = generateDailyQuestions(date);
    const run2 = generateDailyQuestions(date);
    const runDiff = generateDailyQuestions("2026-08-18");

    expect(run1).toEqual(run2);
    expect(run1).not.toEqual(runDiff);
    expect(run1.length).toBe(10);
  });
});
