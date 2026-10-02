import { expect, it } from 'vitest';

import { finalLineGrid } from '../content/sujiao-final-counting';
import {
  isBookGroupsVisual,
  isNumberLineGridVisual,
  numberLinePointX,
  numberLineTicks,
} from './final-counting';
import { sparseArray } from './sparse-array';
it('keeps groups separate from total and rejects malformed or answer-bearing book models', () => {
  for (const size of [5, 10] as const)
    for (const total of [30, 40])
      expect(
        isBookGroupsVisual({ kind: 'book-groups', size, groups: total / size }),
      ).toBe(true);
  for (const model of [
    null,
    [],
    { kind: 'book-groups', size: 5, groups: 0 },
    { kind: 'book-groups', size: 10, groups: 10 },
    { kind: 'book-groups', size: 5, groups: 2.5 },
    { kind: 'book-groups', size: 4, groups: 2 },
    { kind: 'book-groups', size: 5, groups: 8, total: 40 },
  ])
    expect(isBookGroupsVisual(model)).toBe(false);
});
it('draws unit intervals and only major labels, allowing a blank scaffold without hidden answer labels', () => {
  for (const review of [false, true])
    for (const blank of [false, true]) {
      const line = finalLineGrid(review, blank);
      const ticks = numberLineTicks(line);
      expect(isNumberLineGridVisual(line)).toBe(true);
      expect(ticks).toHaveLength(line.maximum - line.minimum + 1);
      expect(ticks.filter((t) => t.major).map((t) => t.value)).toEqual(
        review ? [20, 30, 40, 50, 60, 70, 80] : [30, 40, 50, 60, 70],
      );
      expect(
        ticks.every((t, i) => i === 0 || t.x - ticks[i - 1]!.x === 16),
      ).toBe(true);
      line.points.forEach((value) =>
        expect(numberLinePointX(line, value)).toBe(
          30 + (value - line.minimum) * 16,
        ),
      );
    }
  const line = finalLineGrid();
  for (const patch of [
    { points: sparseArray(6) },
    { points: [36, 62, 53, 47, 60, 36] },
    { points: [36, 62, 53, 47, 60, 71] },
    { points: [36, 62, 53, 47, 60, 41.5] },
    { points: [36] },
    { minimum: 31 },
    { maximum: 100 },
    { maximum: 40 },
    { points: ['36', 62, 53, 47, 60, 41] },
    { answer: 36 },
  ])
    expect(isNumberLineGridVisual({ ...line, ...patch })).toBe(false);
});
