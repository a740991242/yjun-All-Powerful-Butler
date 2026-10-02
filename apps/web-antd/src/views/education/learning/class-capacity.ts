export interface ClassCapacityVisual {
  kind: 'class-capacity';
  variant: 'main' | 'review';
}
export function isClassCapacityVisual(
  value: unknown,
): value is ClassCapacityVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 2 &&
    m.kind === 'class-capacity' &&
    (m.variant === 'main' || m.variant === 'review')
  );
}
/** Known, non-overlapping team counts only. Totals and classroom assignments are not drawn. */
export function classCapacityFacts(variant: ClassCapacityVisual['variant']) {
  return variant === 'main'
    ? {
        classes: [
          { id: 'A', first: 12, second: 20 },
          { id: 'B', first: 13, second: 10 },
          { id: 'C', first: 18, second: 20 },
        ],
        rooms: [
          { id: 'X', capacity: 40 },
          { id: 'Y', capacity: 32 },
          { id: 'Z', capacity: 24 },
        ],
      }
    : {
        classes: [
          { id: 'A', first: 14, second: 20 },
          { id: 'B', first: 15, second: 10 },
          { id: 'C', first: 10, second: 30 },
        ],
        rooms: [
          { id: 'X', capacity: 42 },
          { id: 'Y', capacity: 36 },
          { id: 'Z', capacity: 26 },
        ],
      };
}
