/**
 * Spaced-repetition review queue for missed dates.
 * Stored under its own key so it never touches profile or lesson data.
 *
 * Each item: { id, formattedDate, correctAnswer, dueDate, step }
 *   - A missed date is added due tomorrow (step 0).
 *   - A correct review advances the step (1 day -> 3 days -> 7 days) and reschedules it.
 *   - Once it has passed the final step, a correct review removes it from the queue.
 *   - A miss resets the item to step 0.
 */

const KEY = "daywise-review-v1";
const INTERVALS = [1, 3, 7]; // days between reviews, by step

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDay, days) {
  const d = new Date(`${isoDay}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getReviewQueue() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(queue) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(queue));
  } catch {
    // Storage full or unavailable: review simply does not persist this time.
  }
}

/** Record a missed date. Re-missing an existing item resets it to the first step. */
export function recordMiss({ id, formattedDate, correctAnswer }) {
  const queue = getReviewQueue();
  const existing = queue.find((item) => item.id === id);
  if (existing) {
    existing.step = 0;
    existing.dueDate = addDays(today(), INTERVALS[0]);
  } else {
    queue.push({ id, formattedDate, correctAnswer, step: 0, dueDate: addDays(today(), INTERVALS[0]) });
  }
  save(queue);
}

/** Items whose due date is today or earlier. */
export function getDueReviews(now = today()) {
  return getReviewQueue().filter((item) => item.dueDate <= now);
}

/** Record a correct review: advance the step, or drop the item once it has finished the schedule. */
export function recordReviewSuccess(id, now = today()) {
  const queue = getReviewQueue();
  const item = queue.find((i) => i.id === id);
  if (!item) return;
  const nextStep = item.step + 1;
  if (nextStep >= INTERVALS.length) {
    save(queue.filter((i) => i.id !== id));
    return;
  }
  item.step = nextStep;
  item.dueDate = addDays(now, INTERVALS[nextStep]);
  save(queue);
}

/** Record a wrong review: reset the item to the first step. */
export function recordReviewFailure(id, now = today()) {
  const queue = getReviewQueue();
  const item = queue.find((i) => i.id === id);
  if (!item) return;
  item.step = 0;
  item.dueDate = addDays(now, INTERVALS[0]);
  save(queue);
}
