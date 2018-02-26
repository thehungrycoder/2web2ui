/**
 * Safely divides two numbers, returning 0 for NaN or infinite values
 * @param numerator
 * @param denominator
 * @return {number}
 */
export function safeDivide(numerator, denominator) {
  const value = numerator / denominator;
  return isFinite(value) ? value : 0;
}

/**
 * Calculates percentile rate by safely dividing numbers; returns 0 for NaN or infinite values
 * @param numerator
 * @param denominator
 * @return {number}
 */
export function safeRate(numerator, denominator) {
  return safeDivide(numerator, denominator) * 100;
}
