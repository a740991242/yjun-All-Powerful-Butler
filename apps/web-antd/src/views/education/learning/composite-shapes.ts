import type { CompositeShapesVisual } from './types';

import { fold } from './fold';
export function isCompositeShapesVisual(
  value: unknown,
): value is CompositeShapesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'composite-shapes' &&
    typeof model.layout === 'string' &&
    ['rectangle-strip', 'square-grid', 'triangle-fan'].includes(model.layout) &&
    (model.divisions === 2 ||
      model.divisions === 3 ||
      (model.divisions === 4 && model.layout === 'triangle-fan'))
  );
}
/** Groups are ordered from the smallest span to the complete outer boundary. */
export function compositeGroups(model: CompositeShapesVisual): number[] {
  return Array.from({ length: model.divisions }, (_, index) => {
    const positions = model.divisions - index;
    return model.layout === 'square-grid' ? positions * positions : positions;
  });
}
export function compositeTotal(model: CompositeShapesVisual): number {
  return fold(compositeGroups(model), 0, (total, count) => total + count);
}
/** The drawing shows the supplied segments only, never enumerated answers. */
export function compositeSegments(
  model: CompositeShapesVisual,
): [number, number, number, number][] {
  const n = model.divisions;
  if (model.layout === 'rectangle-strip')
    return Array.from({ length: n - 1 }, (_, i) => [
      ((i + 1) * 240) / n,
      0,
      ((i + 1) * 240) / n,
      40,
    ]);
  if (model.layout === 'square-grid')
    return Array.from(
      { length: n - 1 },
      (_, i): [number, number, number, number][] => [
        [((i + 1) * 180) / n, 0, ((i + 1) * 180) / n, 180],
        [0, ((i + 1) * 180) / n, 180, ((i + 1) * 180) / n],
      ],
    ).flat();
  return Array.from({ length: n - 1 }, (_, i) => [
    120,
    0,
    ((i + 1) * 240) / n,
    140,
  ]);
}
