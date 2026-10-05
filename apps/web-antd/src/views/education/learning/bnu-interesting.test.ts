import { expect, it } from 'vitest';

import { bnuInterestingRows, isBnuInterestingVisual } from './bnu-interesting';

it('preserves every source known entry and lettered blank, without supplying result answers', () => {
  expect(
    bnuInterestingRows({
      kind: 'bnu-interesting',
      scene: 'addition',
      variant: 'main',
    }),
  ).toEqual([
    [11, 11, null],
    [12, 21, null],
    [13, 31, null],
    [14, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  expect(
    bnuInterestingRows({
      kind: 'bnu-interesting',
      scene: 'subtraction',
      variant: 'main',
    }),
  ).toEqual([
    [22, 11, null],
    [33, 21, null],
    [44, 31, null],
    [55, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  expect(
    bnuInterestingRows({
      kind: 'bnu-interesting',
      scene: 'eleven',
      variant: 'main',
    }),
  ).toEqual([
    [1, null, 12],
    [12, null, 23],
    [23, null, 34],
    [34, null, 45],
    [45, null, 56],
    [56, null, 67],
    [67, null, 78],
    [78, null, 89],
  ]);
});
it('checks all changed review rows and fresh arrays', () => {
  const add = bnuInterestingRows({
    kind: 'bnu-interesting',
    scene: 'addition',
    variant: 'review',
  });
  expect(add).toEqual([
    [18, 81, null],
    [17, 71, null],
    [16, 61, null],
    [15, 51, null],
    [14, 41, null],
    [13, 31, null],
    [12, 21, null],
    [11, 11, null],
  ]);
  expect(
    bnuInterestingRows({
      kind: 'bnu-interesting',
      scene: 'subtraction',
      variant: 'review',
    }),
  ).toEqual([
    [99, 81, null],
    [88, 71, null],
    [77, 61, null],
    [66, 51, null],
    [55, 41, null],
    [44, 31, null],
    [33, 21, null],
    [22, 11, null],
  ]);
  expect(
    bnuInterestingRows({
      kind: 'bnu-interesting',
      scene: 'eleven',
      variant: 'review',
    }),
  ).toEqual([
    [2, null, 24],
    [12, null, 34],
    [22, null, 44],
    [32, null, 54],
    [42, null, 64],
    [52, null, 74],
    [62, null, 84],
    [72, null, 94],
  ]);
  const again = bnuInterestingRows({
    kind: 'bnu-interesting',
    scene: 'addition',
    variant: 'review',
  });
  expect(again).not.toBe(add);
  expect(again[0]).not.toBe(add[0]);
});
it('rejects extras and coercion, accepting only the six fixed combinations', () => {
  for (const scene of ['addition', 'subtraction', 'eleven'] as const)
    for (const variant of ['main', 'review'] as const)
      expect(
        isBnuInterestingVisual({ kind: 'bnu-interesting', scene, variant }),
      ).toBe(true);
  for (const bad of [
    null,
    [],
    {},
    {
      kind: 'bnu-interesting',
      scene: 'addition',
      variant: 'main',
      answers: [22, 33],
    },
    {
      kind: 'bnu-interesting',
      scene: { toString: () => 'addition' },
      variant: 'main',
    },
    { kind: 'bnu-interesting', scene: 'other', variant: 'main' },
    { kind: 'bnu-interesting', scene: 'addition', variant: 'other' },
  ])
    expect(isBnuInterestingVisual(bad)).toBe(false);
});
