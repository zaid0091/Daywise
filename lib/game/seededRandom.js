/**
 * Linear Congruential Generator (LCG) for seeded randomness.
 * Ensures the same seed always produces the same sequence of random floats.
 */
export function createSeededRandom(seed) {
  let s = 1;
  
  if (typeof seed === "string") {
    // Hash string into a numeric seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    s = Math.abs(hash) || 1;
  } else if (typeof seed === "number") {
    s = Math.abs(Math.floor(seed)) || 1;
  }

  // Returns a function that produces a number between 0 (inclusive) and 1 (exclusive)
  return function next() {
    // LCG parameters (numerical recipes constants)
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
