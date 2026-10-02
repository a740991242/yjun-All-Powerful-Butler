import type { CountGroupsVisual } from './types';

import { fold } from './fold';

/** Container count and contained objects are deliberately separate quantities. */
export function countGroupsTotal(model: CountGroupsVisual) {
  return fold(model.groups, 0, (sum, count) => sum + count);
}

export function isCountGroupsVisual(
  value: unknown,
): value is CountGroupsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'count-groups' &&
    Array.isArray(model.groups) &&
    model.groups.length >= 2 &&
    model.groups.length <= 5 &&
    model.groups.every(
      (count) => Number.isInteger(count) && count >= 0 && count <= 10,
    ) &&
    fold(model.groups, 0, (sum, count) => sum + count) <= 10
  );
}
