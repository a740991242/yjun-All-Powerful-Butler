import type { CubeColumnsVisual } from './types';

import { fold } from './fold';

/** One cube deep, contiguous columns; no hidden rear row or floating cubes. */
export function cubeColumnsTotal(model: CubeColumnsVisual) {
  return fold(model.heights, 0, (sum, height) => sum + height);
}

export function cubeColumnsSolid(
  model: CubeColumnsVisual,
): 'cube' | 'cuboid' | null {
  if (!model.heights.every((height) => height === model.heights[0]))
    return null;
  return model.heights.length === 1 && model.heights[0] === 1
    ? 'cube'
    : 'cuboid';
}

export function isCubeColumnsVisual(
  value: unknown,
): value is CubeColumnsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'cube-columns' &&
    Array.isArray(model.heights) &&
    model.heights.length > 0 &&
    model.heights.length <= 5 &&
    model.heights.every(
      (height) => Number.isInteger(height) && height >= 1 && height <= 4,
    ) &&
    fold(model.heights, 0, (sum, height) => sum + height) <= 10
  );
}
