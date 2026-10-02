import type { FlagCode, PeriodicFlagsVisual } from './types';

import { required } from './required';

export function flagAt(
  model: PeriodicFlagsVisual,
  index: number,
): FlagCode | undefined {
  return Number.isInteger(index) && index >= 0 && index < model.total
    ? model.pattern[index % 3]
    : undefined;
}
export function flagCounts(
  model: PeriodicFlagsVisual,
): [number, number, number] {
  const counts: [number, number, number] = [0, 0, 0];
  for (let index = 0; index < model.total; index++) {
    const code = flagAt(model, index);
    if (code) {
      const index = ['A', 'B', 'C'].indexOf(code);
      counts[index] = required(counts[index]) + 1;
    }
  }
  return counts;
}
export function isPeriodicFlagsVisual(
  value: unknown,
): value is PeriodicFlagsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 4 &&
    model.kind === 'periodic-flags' &&
    Array.isArray(model.pattern) &&
    model.pattern.length === 3 &&
    [...model.pattern].every(
      (code) => typeof code === 'string' && ['A', 'B', 'C'].includes(code),
    ) &&
    new Set(model.pattern).size === 3 &&
    typeof model.total === 'number' &&
    Number.isInteger(model.total) &&
    model.total >= 6 &&
    model.total <= 19 &&
    typeof model.shown === 'number' &&
    Number.isInteger(model.shown) &&
    model.shown >= 6 &&
    model.shown <= model.total &&
    model.shown % 3 === 0
  );
}
