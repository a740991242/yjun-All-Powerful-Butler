import type { PlanePatch, ShapePatchVisual } from './types';

import { planeShapes } from './plane-cards';
export function patchKey(patch: PlanePatch): string {
  return `${patch.shape}-${patch.width}-${patch.height}`;
}
export function isPlanePatch(value: unknown): value is PlanePatch {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const patch = value as Record<string, unknown>;
  const bound = (v: unknown): v is number =>
    typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 4;
  return (
    Object.keys(patch).length === 3 &&
    typeof patch.shape === 'string' &&
    planeShapes.some((shape) => shape === patch.shape) &&
    bound(patch.width) &&
    bound(patch.height) &&
    (patch.shape === 'triangle' ||
      (patch.shape === 'rectangle'
        ? patch.width !== patch.height
        : patch.width === patch.height))
  );
}
/** This activity permits translation only; rotation and resizing are separate tasks. */
export function matchingPatch(model: ShapePatchVisual): number {
  return model.candidates.findIndex(
    (patch) => patchKey(patch) === patchKey(model.target),
  );
}
export function isShapePatchVisual(value: unknown): value is ShapePatchVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 3 ||
    model.kind !== 'shape-patch' ||
    !isPlanePatch(model.target) ||
    !Array.isArray(model.candidates) ||
    model.candidates.length < 3 ||
    model.candidates.length > 5
  )
    return false;
  const target = model.target;
  const candidates: PlanePatch[] = [];
  for (const candidate of [...model.candidates]) {
    if (!isPlanePatch(candidate)) return false;
    candidates.push(candidate);
  }
  return (
    new Set(candidates.map((item) => patchKey(item))).size ===
      candidates.length &&
    candidates.filter((candidate) => patchKey(candidate) === patchKey(target))
      .length === 1
  );
}
export function patchTrianglePoints(patch: PlanePatch): string {
  return `72,${72 - patch.height * 12} ${72 + patch.width * 12},${72 + patch.height * 12} ${72 - patch.width * 12},${72 + patch.height * 12}`;
}
