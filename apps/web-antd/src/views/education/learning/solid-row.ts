import type { SolidRowVisual, SolidShape } from './types';

export function isSolidRowVisual(value: unknown): value is SolidRowVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  return (
    Object.keys(row).length === 2 &&
    row.kind === 'solid-row' &&
    Array.isArray(row.shapes) &&
    row.shapes.length >= 2 &&
    row.shapes.length <= 9 &&
    row.shapes.every(
      (shape) =>
        typeof shape === 'string' &&
        ['cube', 'cuboid', 'cylinder', 'sphere'].includes(shape),
    )
  );
}

/** Positions start at 1 at the left. Identical shapes may occur more than once. */
export function solidPositions(
  row: SolidRowVisual,
  shape: SolidShape,
): number[] {
  return row.shapes.flatMap((item, index) =>
    item === shape ? [index + 1] : [],
  );
}

export function solidCounts(row: SolidRowVisual) {
  return {
    cube: solidPositions(row, 'cube').length,
    cuboid: solidPositions(row, 'cuboid').length,
    cylinder: solidPositions(row, 'cylinder').length,
    sphere: solidPositions(row, 'sphere').length,
  };
}
