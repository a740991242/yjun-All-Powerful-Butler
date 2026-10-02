export interface DigitCounterVisual {
  kind: 'digit-counter';
  tens: number;
  ones: number;
}
export function isDigitCounterVisual(
  value: unknown,
): value is DigitCounterVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const d = value as Record<string, unknown>;
  return (
    Object.keys(d).length === 3 &&
    d.kind === 'digit-counter' &&
    [d.tens, d.ones].every(
      (n) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 9,
    )
  );
}
export function beadNumbers(total: number) {
  if (!Number.isInteger(total) || total < 1 || total > 9)
    throw new Error('Invalid bead budget');
  return Array.from({ length: total }, (_, i) => (i + 1) * 10 + total - i - 1);
}
