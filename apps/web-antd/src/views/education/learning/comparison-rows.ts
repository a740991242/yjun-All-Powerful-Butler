export interface ComparisonRowsVisual {
  kind: 'comparison-rows';
  counts: [number, number];
}
export function isComparisonRowsVisual(
  value: unknown,
): value is ComparisonRowsVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'comparison-rows' &&
    Array.isArray(model.counts) &&
    model.counts.length === 2 &&
    [...model.counts].every(
      (n) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 20,
    )
  );
}
