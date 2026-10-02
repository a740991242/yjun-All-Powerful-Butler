import type { VisualState } from './types';

/** Break-ten model: the original ones stay aside while units are taken from 10. */
export function breakTen(left: number, right: number, state: VisualState = {}) {
  if (
    !Number.isInteger(left) ||
    !Number.isInteger(right) ||
    left < 11 ||
    left > 19 ||
    right <= left % 10 ||
    right > 9
  )
    throw new Error('Invalid break-ten calculation');
  const broken = state.broken === true;
  const removed =
    broken && Number.isInteger(state.removed)
      ? Math.max(0, Math.min(right, state.removed ?? 0))
      : 0;
  return {
    broken,
    removed,
    originalOnes: left % 10,
    tenRemaining: 10 - removed,
    remaining: left - removed,
    complete: broken && removed === right,
  };
}
