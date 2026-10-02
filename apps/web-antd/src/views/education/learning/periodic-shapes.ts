import type { PeriodicShapesVisual } from './types';

import { planeShapes } from './plane-cards';
export function periodicShapeAt(model: PeriodicShapesVisual, index: number) {
  return Number.isInteger(index) && index >= 0 && index < model.total
    ? model.pattern[index % 3]
    : undefined;
}
export function shapeKey(
  item: PeriodicShapesVisual['pattern'][number],
): string {
  return `${item.size}-${item.shape}`;
}
export function isPeriodicShapesVisual(
  value: unknown,
): value is PeriodicShapesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 4 ||
    model.kind !== 'periodic-shapes' ||
    !Array.isArray(model.pattern) ||
    model.pattern.length !== 3
  )
    return false;
  const keys: string[] = [];
  for (const value of [...model.pattern]) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
      return false;
    const item = value as Record<string, unknown>;
    if (
      Object.keys(item).length !== 2 ||
      typeof item.shape !== 'string' ||
      !planeShapes.some((shape) => shape === item.shape) ||
      (item.size !== 1 && item.size !== 2)
    )
      return false;
    keys.push(`${item.size}-${item.shape}`);
  }
  return (
    new Set(keys).size >= 2 &&
    typeof model.total === 'number' &&
    Number.isInteger(model.total) &&
    model.total >= 7 &&
    model.total <= 12 &&
    typeof model.shown === 'number' &&
    (model.shown === 6 || model.shown === 9) &&
    model.shown < model.total
  );
}
