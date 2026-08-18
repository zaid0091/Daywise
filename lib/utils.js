import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and merges Tailwind classes correctly.
 * @param  {...any[]} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
