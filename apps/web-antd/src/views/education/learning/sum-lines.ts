import type { SumLinesVisual } from './types';

/** Given values are top/left/right for a triangle, top/left/centre for a cross. */
export function sumLineAnswers(model: SumLinesVisual): number[] {
  const [top, left, third] = model.given;
  return model.layout === 'triangle'
    ? [10 - top - left, 10 - left - third, 10 - top - third]
    : [10 - top - third, 10 - left - third];
}

export function isSumLinesVisual(value: unknown): value is SumLinesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 3 ||
    model.kind !== 'sum-lines' ||
    typeof model.layout !== 'string' ||
    !['cross', 'triangle'].includes(model.layout) ||
    !Array.isArray(model.given) ||
    model.given.length !== 3 ||
    !model.given.every((n) => Number.isInteger(n) && n >= 0 && n <= 10)
  )
    return false;
  const [top, left, third] = model.given;
  return (
    top + third <= 10 &&
    left + third <= 10 &&
    (model.layout !== 'triangle' || top + left <= 10)
  );
}
