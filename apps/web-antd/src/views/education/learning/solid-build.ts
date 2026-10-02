import type { SolidBuildVisual, SolidShape } from './types';
export const solidBuildSlots = [
  [180, 0, 120],
  [200, 90, 80],
  [150, 160, 180],
  [30, 175, 100],
  [350, 175, 100],
  [150, 295, 90],
  [250, 295, 90],
  [140, 375, 100],
  [250, 375, 100],
] as const;
export function isSolidBuildVisual(value: unknown): value is SolidBuildVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'solid-build' &&
    Array.isArray(model.shapes) &&
    model.shapes.length === solidBuildSlots.length &&
    [...model.shapes].every((shape) =>
      ['cube', 'cuboid', 'cylinder', 'sphere'].includes(shape),
    )
  );
}
export function solidBuildCount(
  model: SolidBuildVisual,
  shape: SolidShape,
): number {
  return model.shapes.filter((s) => s === shape).length;
}
