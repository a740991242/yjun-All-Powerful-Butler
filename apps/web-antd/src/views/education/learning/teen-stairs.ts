export interface TeenStairsVisual {
  kind: 'teen-stairs';
  variant: 'main' | 'review';
}
export function isTeenStairsVisual(value: unknown): value is TeenStairsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return (
    Object.keys(value).length === 2 &&
    'kind' in value &&
    value.kind === 'teen-stairs' &&
    'variant' in value &&
    (value.variant === 'main' || value.variant === 'review')
  );
}
/** Letters replace the nine source figures; no publisher artwork is used. */
export function teenStairs(visual: TeenStairsVisual) {
  const occupied =
    visual.variant === 'main'
      ? [6, 7, 9, 10, 13, 14, 16, 18, 19]
      : [5, 6, 8, 9, 12, 13, 15, 17, 18];
  return Array.from({ length: 19 }, (_, index) => {
    const level = index + 1;
    const marker = occupied.indexOf(level);
    return {
      level,
      label: marker === -1 ? null : String.fromCodePoint(65 + marker),
      x: 20 + index * 56,
      y: 560 - level * 24,
    };
  });
}
