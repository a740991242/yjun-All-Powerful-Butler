import { expect, it } from 'vitest';

import { bnuNumberReview, isBnuNumberReviewVisual } from './bnu-number-review';
import { isNumberStripVisual } from './number-strip';
import { isPlaceCountersVisual } from './place-counters';

it('preserves all original materials and review changes without normalizing away fifteen loose units', () => {
  const cases = [
    ['objects', 0, 43, 0, 52],
    ['sticks', 3, 8, 4, 6],
    ['counter', 2, 5, 3, 2],
    ['cubes', 2, 15, 3, 12],
  ] as const;
  for (const [scene, tens, singles, newTens, newSingles] of cases) {
    const main = bnuNumberReview({
      kind: 'bnu-number-review',
      scene,
      variant: 'main',
    });
    const review = bnuNumberReview({
      kind: 'bnu-number-review',
      scene,
      variant: 'review',
    });
    expect(main).toMatchObject({
      type: 'material',
      material: scene,
      tens,
      singles,
    });
    expect(review).toMatchObject({
      type: 'material',
      material: scene,
      tens: newTens,
      singles: newSingles,
    });
    expect(main).not.toHaveProperty('answer');
  }
  expect(
    bnuNumberReview({
      kind: 'bnu-number-review',
      scene: 'objects',
      variant: 'main',
    }),
  ).toMatchObject({ rows: [10, 10, 10, 10, 3] });
});
it('preserves every source train position and labels all four unknowns without returning fill answers', () => {
  const cases = [
    [
      'five-up',
      [15, 20, 25, null, 35, null, 45, null, null],
      [12, 17, 22, null, 32, null, 42, null, null],
    ],
    [
      'two-up',
      [22, null, 26, 28, null, 32, null, null],
      [41, null, 45, 47, null, 51, null, null],
    ],
    [
      'ten-up',
      [10, 20, 30, null, null, null, null],
      [9, 19, 29, null, null, null, null],
    ],
    [
      'five-down',
      [100, 95, 90, 85, null, null, null, null],
      [99, 94, 89, 84, null, null, null, null],
    ],
  ] as const;
  for (const [scene, main, review] of cases) {
    for (const [variant, values] of [
      ['main', main],
      ['review', review],
    ] as const) {
      const model = bnuNumberReview({
        kind: 'bnu-number-review',
        scene,
        variant,
      });
      expect(model.type).toBe('train');
      if (model.type !== 'train') throw new Error('Expected train');
      expect(model.values).toEqual(values);
      expect(model.labels.filter((x) => x !== null)).toEqual([
        'A',
        'B',
        'C',
        'D',
      ]);
      expect(model.values.filter((x) => x === null)).toHaveLength(4);
      for (const [i, label] of model.labels.entries())
        expect(label === null).toBe(model.values[i] !== null);
      expect(model).not.toHaveProperty('answers');
    }
  }
});
it('strictly rejects unknown, coerced and extra fields while preserving old number-strip and counter limits', () => {
  const valid = { kind: 'bnu-number-review', scene: 'cubes', variant: 'main' };
  expect(isBnuNumberReviewVisual(valid)).toBe(true);
  for (const value of [
    null,
    [],
    {},
    { ...valid, scene: ['cubes'] },
    { ...valid, variant: ['main'] },
    { ...valid, scene: 'missing' },
    { ...valid, variant: 'other' },
    { ...valid, answer: 35 },
    { ...valid, singles: 5 },
    { ...valid, values: [35] },
  ])
    expect(isBnuNumberReviewVisual(value)).toBe(false);
  expect(
    isNumberStripVisual({ kind: 'number-strip', values: [99, null] }),
  ).toBe(true);
  expect(
    isNumberStripVisual({ kind: 'number-strip', values: [100, null] }),
  ).toBe(false);
  expect(
    isPlaceCountersVisual({
      kind: 'place-counters',
      values: [4, 13, 22, 31, 40],
    }),
  ).toBe(false);
});
