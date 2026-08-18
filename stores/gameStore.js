import { create } from "zustand";
import { generateQuestion, generateQuestions } from "../lib/game/questionGenerator";
import { calculateScore } from "../lib/game/scoring";

export const useGameStore = create((set, get) => ({
  // Core State
  mode: "relaxed", // 'relaxed' | 'timed' | 'speed' | 'accuracy'
  difficulty: "medium", // 'easy' | 'medium' | 'hard' | 'expert'
  gameState: "idle", // 'idle' | 'playing' | 'completed'
  
  questions: [],
  currentIndex: 0,
  answers: [], // submission logs
  currentAnswer: null, // holds the result of the active answer for feedback
  
  score: 0,
  streak: 0,
  maxStreak: 0,
  
  elapsedTime: 0, // seconds elapsed or countdown seconds remaining
  speedRunDuration: 60, // 30 | 60 | 120

  // Initialize a new round
  initGame: (mode, difficulty, options = {}) => {
    const { speedRunDuration = 60, customQuestions } = options;
    
    let generatedList = customQuestions || [];
    if (generatedList.length === 0) {
      if (mode === "timed" || mode === "accuracy" || mode === "daily") {
        generatedList = generateQuestions(10, difficulty);
      } else if (mode === "speed") {
        generatedList = generateQuestions(50, difficulty);
      } else {
        generatedList = Array.from({ length: 5 }, (_, i) => generateQuestion(difficulty, { index: i }));
      }
    }

    set({
      mode,
      difficulty,
      gameState: "playing",
      questions: generatedList,
      currentIndex: 0,
      answers: [],
      currentAnswer: null,
      score: 0,
      streak: 0,
      maxStreak: 0,
      elapsedTime: mode === "speed" ? speedRunDuration : 0,
      speedRunDuration,
    });
  },

  // Submit answer for the active question (evaluate & record, do not slide index yet)
  submitAnswer: (selectedAnswer, responseTimeSeconds) => {
    const { questions, currentIndex, streak, maxStreak, score, difficulty, answers, gameState } = get();
    
    if (gameState !== "playing") return null;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Compute score details
    const scoreResult = calculateScore({
      difficulty,
      responseTimeSeconds,
      streak,
      isCorrect,
    });

    const newStreak = isCorrect ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);
    const newScore = score + scoreResult.points;

    const answerLog = {
      questionId: currentQuestion.id,
      dateStr: currentQuestion.formattedDate,
      correctAnswer: currentQuestion.correctAnswer,
      selectedAnswer,
      isCorrect,
      responseTimeSeconds,
      scoreGained: scoreResult.points,
      scoreBreakdown: scoreResult,
    };

    const updatedAnswers = [...answers, answerLog];

    set({
      answers: updatedAnswers,
      currentAnswer: answerLog,
      streak: newStreak,
      maxStreak: newMaxStreak,
      score: newScore,
    });

    return answerLog;
  },

  // Slide index to next question
  goToNextQuestion: () => {
    const { mode, questions, currentIndex, difficulty, gameState } = get();
    if (gameState !== "playing") return;

    let nextIndex = currentIndex + 1;
    let newQuestions = [...questions];
    let nextGameState = "playing";

    if (mode === "relaxed") {
      if (nextIndex >= newQuestions.length) {
        newQuestions.push(generateQuestion(difficulty, { index: nextIndex }));
      }
    } else if (mode === "timed" || mode === "accuracy") {
      if (nextIndex >= 10) {
        nextGameState = "completed";
      }
    } else if (mode === "speed") {
      if (nextIndex >= newQuestions.length) {
        const moreQuestions = generateQuestions(10, difficulty);
        newQuestions = [...newQuestions, ...moreQuestions];
      }
    }

    set({
      currentIndex: nextIndex,
      questions: newQuestions,
      currentAnswer: null, // Reset active answer feedback
      gameState: nextGameState,
    });
  },

  // Clock tick trigger
  tickTimer: () => {
    const { mode, gameState, elapsedTime } = get();
    if (gameState !== "playing") return;

    if (mode === "speed") {
      const nextTime = elapsedTime - 1;
      if (nextTime <= 0) {
        set({ elapsedTime: 0, gameState: "completed", currentAnswer: null });
      } else {
        set({ elapsedTime: nextTime });
      }
    } else {
      set({ elapsedTime: elapsedTime + 1 });
    }
  },

  // Set game directly to completed state (for pausing/stopping)
  endGame: () => {
    set({ gameState: "completed", currentAnswer: null });
  },

  // Reset to initial screen
  resetGame: () => {
    set({
      gameState: "idle",
      questions: [],
      currentIndex: 0,
      answers: [],
      currentAnswer: null,
      score: 0,
      streak: 0,
      maxStreak: 0,
      elapsedTime: 0,
    });
  },
}));
