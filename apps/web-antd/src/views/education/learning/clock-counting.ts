export interface ClockCountingVisual {
  kind: 'clock-counting';
}
export function isClockCountingVisual(
  value: unknown,
): value is ClockCountingVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const p = value as Record<string, unknown>;
  return Object.keys(p).length === 1 && p.kind === 'clock-counting';
}
/** A closed ring has one interval per vertex; the starting mark is not duplicated. */
export function clockCountingMarks() {
  return Array.from({ length: 60 }, (_, index) => ({
    index,
    angle: index * 6,
    major: index % 5 === 0,
  }));
}
