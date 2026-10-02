export interface ComparisonBarsVisual {
  kind: 'comparison-bars';
  reference: number;
  difference: number;
  direction: 'less' | 'more';
}
export function isComparisonBarsVisual(
  value: unknown,
): value is ComparisonBarsVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 4 ||
    model.kind !== 'comparison-bars' ||
    !Number.isInteger(model.reference) ||
    typeof model.reference !== 'number' ||
    model.reference < 1 ||
    model.reference > 99 ||
    typeof model.difference !== 'number' ||
    !Number.isInteger(model.difference) ||
    model.difference < 0 ||
    model.difference > 99 ||
    (model.direction !== 'more' && model.direction !== 'less')
  )
    return false;
  return model.direction === 'more'
    ? model.reference + model.difference <= 99
    : model.difference <= model.reference;
}
