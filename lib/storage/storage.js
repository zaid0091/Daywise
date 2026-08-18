/**
 * Daywise Local Storage Controller
 * Manages player progress state locally in the browser.
 */

const STORAGE_KEYS = {
  COMPLETED_LESSONS: "daywise-completed-lessons",
};

/**
 * Retrieves the array of completed lesson IDs.
 * @returns {string[]}
 */
export function getCompletedLessons() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read completed lessons from storage", e);
    return [];
  }
}

/**
 * Saves a lesson ID as completed.
 * @param {string} lessonId 
 */
export function completeLesson(lessonId) {
  if (typeof window === "undefined") return;
  try {
    const completed = getCompletedLessons();
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completed));
    }
  } catch (e) {
    console.error("Failed to save completed lesson to storage", e);
  }
}

/**
 * Checks if a specific lesson is completed.
 * @param {string} lessonId 
 * @returns {boolean}
 */
export function isLessonCompleted(lessonId) {
  return getCompletedLessons().includes(lessonId);
}

/**
 * Resets all learning progress.
 */
export function resetProgress() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
  } catch (e) {
    console.error("Failed to reset storage progress", e);
  }
}
