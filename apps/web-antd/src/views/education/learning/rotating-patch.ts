import type { PlanePatch, RotatingPatch, RotatingPatchVisual } from './types';

import { required } from './required';
import { isPlanePatch } from './shape-patch';

const turns = [0, 45, 90, 135, 180, 225, 270, 315];
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
export function isRotatingPatch(value: unknown): value is RotatingPatch {
  return (
    record(value) &&
    Object.keys(value).length === 2 &&
    isPlanePatch(value.patch) &&
    typeof value.turn === 'number' &&
    turns.includes(value.turn)
  );
}
/** Congruence under the stated eight rotations and translation; never under resizing or equal area alone. */
export function congruentPatchKey(patch: PlanePatch): string {
  if (patch.shape === 'circle') return `circle-${patch.width}`;
  const points =
    patch.shape === 'triangle'
      ? [
          [0, -patch.height],
          [patch.width, patch.height],
          [-patch.width, patch.height],
        ]
      : [
          [-patch.width, -patch.height],
          [patch.width, -patch.height],
          [patch.width, patch.height],
          [-patch.width, patch.height],
        ];
  const keys = turns.map((turn) => {
    const angle = (turn * Math.PI) / 180;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rotated = points.map(([x, y]) => [
      required(x) * c - required(y) * s,
      required(x) * s + required(y) * c,
    ]);
    const minX = Math.min(...rotated.map((p) => required(p[0])));
    const minY = Math.min(...rotated.map((p) => required(p[1])));
    const normalized = rotated
      .map((p) => [
        Math.round((required(p[0]) - minX) * 1e8),
        Math.round((required(p[1]) - minY) * 1e8),
      ])
      .toSorted(
        (a, b) =>
          required(a[0]) - required(b[0]) || required(a[1]) - required(b[1]),
      );
    return JSON.stringify(normalized);
  });
  return `${patch.shape}-${keys.toSorted()[0]}`;
}
export function matchingRotatingPatch(model: RotatingPatchVisual) {
  return model.candidates.findIndex(
    (candidate) =>
      congruentPatchKey(candidate.patch) ===
      congruentPatchKey(model.target.patch),
  );
}
export function isRotatingPatchVisual(
  value: unknown,
): value is RotatingPatchVisual {
  if (
    !record(value) ||
    Object.keys(value).length !== 3 ||
    value.kind !== 'rotating-patch' ||
    !isRotatingPatch(value.target) ||
    !Array.isArray(value.candidates) ||
    value.candidates.length < 3 ||
    value.candidates.length > 5
  )
    return false;
  const target = value.target.patch;
  const keys: string[] = [];
  for (const candidate of [...value.candidates]) {
    if (!isRotatingPatch(candidate)) return false;
    keys.push(congruentPatchKey(candidate.patch));
  }
  return (
    new Set(keys).size === keys.length &&
    keys.filter((key) => key === congruentPatchKey(target)).length === 1
  );
}
